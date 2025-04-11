import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

export function setupAuth(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());

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

  // Rota de registro
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      // Login automático após registro
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Erro ao fazer login após registro" });
        }
        return res.status(201).json(newUser);
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Rota de login
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
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