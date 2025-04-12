import { db, pool } from './db';
import { and, eq } from 'drizzle-orm';
import {
  users,
  bibleStudies,
  blogPosts,
  forumTopics,
  forumReplies,
  events,
  type User,
  type BibleStudy,
  type BlogPost,
  type ForumTopic,
  type ForumReply,
  type Event,
  type InsertUser,
  type InsertBibleStudy,
  type InsertBlogPost,
  type InsertForumTopic,
  type InsertForumReply,
  type InsertEvent
} from '@shared/schema';

export const storage = {
  async getUserByUsername(username: string, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await db.select().from(users).where(eq(users.username, username));
        return result[0];
      } catch (error: any) {
        console.error(`Tentativa ${i + 1}/${retries} falhou:`, error);
        if (i === retries - 1 || error.code !== 'CONNECT_TIMEOUT') {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  },

  async getUserByEmail(email: string) {
    try {
      const result = await db.select().from(users).where(eq(users.email, email));
      return result[0];
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  },

  async createUser(userData: InsertUser) {
    try {
      console.log("Storage: Iniciando criação do usuário");
      const result = await db.insert(users).values(userData).returning();
      console.log("Storage: Usuário criado com sucesso");
      return result[0];
    } catch (error: any) {
      console.error("Storage: Erro ao criar usuário:", {
        code: error.code,
        message: error.message,
        detail: error.detail
      });
      if (error.code === '23505') {
        throw new Error("Usuário ou email já está em uso");
      }
      throw error;
    }
  },

  async getUser(id: number) {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  async getBibleStudies() {
    try {
      return await db.select().from(bibleStudies).orderBy(bibleStudies.createdAt);
    } catch (error) {
      console.error('Erro ao buscar estudos bíblicos:', error);
      throw error;
    }
  },

  async createBibleStudy(studyData: InsertBibleStudy) {
    try {
      console.log('Criando estudo bíblico:', studyData);
      const result = await db.insert(bibleStudies).values(studyData).returning();
      console.log('Estudo criado:', result[0]);
      return result[0];
    } catch (error) {
      console.error('Erro ao criar estudo bíblico:', error);
      throw error;
    }
  },

  async getBlogPosts() {
    try {
      return await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      throw error;
    }
  },

  async getForumTopics() {
    try {
      return await db.select().from(forumTopics).orderBy(forumTopics.createdAt);
    } catch (error) {
      console.error('Erro ao buscar tópicos:', error);
      throw error;
    }
  },

  async getEvents() {
    try {
      return await db.select().from(events).orderBy(events.startTime);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    }
  }
};