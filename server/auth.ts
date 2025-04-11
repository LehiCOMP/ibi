import { Express } from "express";
import { supabase } from "./db";

export function setupAuth(app: Express) {
  // Rota para verificar usuário atual
  app.get("/api/user", async (req, res) => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    res.json(user);
  });

  // Rota de registro
  app.post("/api/register", async (req, res) => {
    const { email, password, username } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json(data);
  });

  // Rota de login
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    res.json(data);
  });

  // Rota de logout
  app.post("/api/logout", async (req, res) => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.status(200).json({ message: "Logout realizado com sucesso" });
  });
}