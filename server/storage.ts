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
  async getUserByUsername(username: string) {
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error('Erro ao buscar usuário por username:', error);
      throw error;
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
      console.log('Tentando criar usuário:', { ...userData, password: '[REDACTED]' });
      const result = await db.insert(users).values(userData).returning();
      console.log('Usuário criado com sucesso:', result[0].id);
      return result[0];
    } catch (error) {
      console.error('Erro detalhado ao criar usuário:', error);
      throw new Error(`Falha ao criar usuário: ${error.message}`);
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