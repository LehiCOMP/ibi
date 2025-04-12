
import { Express } from "express";
import { db } from "./db";
import * as bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function setupAuth(app: Express) {
  app.get("/api/user", async (req, res) => {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    
    try {
      const userDoc = await db.collection('users').doc(userId as string).get();
      if (!userDoc.exists) {
        return res.status(401).json({ message: "Usuário não encontrado" });
      }
      res.json(userDoc.data());
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  });

  app.post("/api/register", async (req, res) => {
    const { email, password, username, displayName } = req.body;

    try {
      const hashedPassword = await hashPassword(password);
      
      const userRef = db.collection('users').doc();
      await userRef.set({
        email,
        username,
        displayName,
        password: hashedPassword,
        createdAt: new Date()
      });

      res.status(201).json({
        user: {
          id: userRef.id,
          email,
          username,
          displayName
        }
      });
    } catch (err) {
      console.error("Erro no registro:", err);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', email).get();
      
      if (snapshot.empty) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      
      const validPassword = await bcrypt.compare(password, userData.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      res.json({
        user: {
          id: userDoc.id,
          email: userData.email,
          username: userData.username,
          displayName: userData.displayName
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Erro no login" });
    }
  });

  app.post("/api/logout", (req, res) => {
    res.status(200).json({ message: "Logout realizado com sucesso" });
  });
}
