
import { db } from './db';
import { 
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
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('username', '==', username).get();
      return snapshot.empty ? null : snapshot.docs[0].data() as User;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  async getUserByEmail(email: string) {
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', email).get();
      return snapshot.empty ? null : snapshot.docs[0].data() as User;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  },

  async createUser(userData: InsertUser) {
    try {
      const usersRef = db.collection('users');
      const docRef = await usersRef.add(userData);
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as User;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  async getUser(id: string) {
    try {
      const doc = await db.collection('users').doc(id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } as User : null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  async getBibleStudies() {
    try {
      const snapshot = await db.collection('bible_studies').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BibleStudy[];
    } catch (error) {
      console.error('Erro ao buscar estudos bíblicos:', error);
      throw error;
    }
  },

  async getBlogPosts() {
    try {
      const snapshot = await db.collection('blog_posts').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      throw error;
    }
  },

  async getForumTopics() {
    try {
      const snapshot = await db.collection('forum_topics').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ForumTopic[];
    } catch (error) {
      console.error('Erro ao buscar tópicos:', error);
      throw error;
    }
  },

  async getEvents() {
    try {
      const snapshot = await db.collection('events').orderBy('startTime', 'asc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    }
  },

  async createBibleStudy(data: InsertBibleStudy) {
    try {
      const docRef = await db.collection('bible_studies').add(data);
      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as BibleStudy;
    } catch (error) {
      console.error('Erro ao criar estudo:', error);
      throw error;
    }
  }
};
