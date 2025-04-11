import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import session from "express-session";

export function setupAuth(app: Express) {
  // Configurar sessão antes do passport
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
  }));

  // Inicializar passport e sessão
  app.use(passport.initialize());
  app.use(passport.session());

  // Configurar serialização do usuário (apenas uma vez)
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Configurar estratégia local
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Usuário não encontrado" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Senha incorreta" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Rota de registro
  app.post("/api/register", async (req, res) => {
    console.log("Iniciando registro...");
    const userData = insertUserSchema.parse(req.body);

    try {
      // Verificar se usuário já existe
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Nome de usuário já está em uso" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email já está em uso" });
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      // Login automático após registro
      req.login(newUser, (err) => {
        if (err) {
          console.error("Erro no login após registro:", err);
          return res.status(500).json({ message: "Erro ao fazer login após registro" });
        }
        return res.status(201).json(newUser);
      });
    } catch (error: any) {
      console.error("Erro no registro:", error);
      res.status(400).json({ message: error.message || "Erro ao criar usuário" });
    }
  });

  // Rota de login
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: "Erro interno no servidor" });
      }

      if (!user) {
        return res.status(401).json({ message: info.message || "Credenciais inválidas" });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: "Erro ao iniciar sessão" });
        }
        return res.json(user);
      });
    })(req, res, next);
  });

  // Rota de logout
  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      res.status(200).json({ message: "Logout realizado com sucesso" });
    });
  });

  // Rota para verificar usuário atual
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    res.json(req.user);
  });
}