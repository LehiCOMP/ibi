import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

// Garantir que a tipagem do usuário do Express inclua o nosso tipo de usuário
declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  if (!stored || !stored.includes(".")) return false;
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) return false;
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "igreja-batista-independente-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semana
    },
    store: new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: "session",
    }),
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          console.log('Usuário não encontrado:', username);
          return done(null, false);
        }

        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          console.log('Senha inválida para usuário:', username);
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        console.error('Erro na autenticação:', err);
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Rota para registro de novos usuários
  app.post("/api/register", async (req, res) => {
    try {
      console.log("Dados recebidos para registro:", req.body);
      console.log("Iniciando validação dos dados...");

      const { username, password, email, displayName } = req.body;

      if (!username || !password || !email) {
        return res.status(400).json({ 
          message: "Username, password e email são obrigatórios" 
        });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Nome de usuário já existe" });
      }

      const hashedPassword = await hashPassword(password);

      const userData = {
        username,
        display_name: displayName || username,
        password: hashedPassword,
        email,
        created_at: new Date().toISOString()
      };

      const user = await storage.createUser(userData);
      
      req.login(user, (err) => {
        if (err) {
          console.error("Erro no login após registro:", err);
          return res.status(500).json({ 
            message: "Erro ao fazer login após registro" 
          });
        }
        return res.status(201).json({
          id: user.id,
          username: user.username,
          display_name: user.display_name,
          email: user.email
        });
      });
    } catch (error) {
      console.error("Erro no registro:", error);
      res.status(500).json({ 
        message: "Erro ao criar usuário: " + error.message 
      });
    }
  });

  // Rota para login
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Credenciais inválidas" });

      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.json(user);
      });
    })(req, res, next);
  });

  // Rota para logout
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Rota para obter informações do usuário atual
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Não autenticado" });
    res.json(req.user);
  });
}