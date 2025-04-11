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
    const { email, password, username, displayName } = req.body;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            displayName
          },
          emailRedirectTo: undefined
        }
      });

      if (error) {
        console.error("Erro no registro Supabase:", error);
        if (error.message.includes("Email not confirmed")) {
          return res.status(400).json({ 
            message: "Por favor, verifique seu email para confirmar o cadastro. Um link de confirmação foi enviado para seu email." 
          });
        }
        return res.status(400).json({ message: error.message });
      }

      if (!data.user) {
        return res.status(400).json({ message: "Erro ao criar usuário" });
      }

      // Retorna um objeto estruturado com os dados do usuário
      res.status(201).json({
        user: {
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata?.username || '',
          displayName: data.user.user_metadata?.displayName || data.user.user_metadata?.username || '',
          avatar: data.user.user_metadata?.avatar || ''
        }
      });
    } catch (err) {
      console.error("Erro no registro:", err);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  });

  // Rota de login
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          email_confirm: false
        }
      }
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