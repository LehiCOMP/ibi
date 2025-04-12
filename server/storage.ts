
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
import { collection, query, where, getDocs, addDoc, doc, getDoc, orderBy } from '@google-cloud/firestore';

export const storage = {
  async getUserByUsername(username: string) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as User;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  async getUserByEmail(email: string) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as User;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  },

  async createUser(userData: InsertUser) {
    try {
      const usersRef = collection(db, 'users');
      const docRef = await addDoc(usersRef, userData);
      const userDoc = await getDoc(docRef);
      return { id: docRef.id, ...userDoc.data() } as User;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  async getUser(id: string) {
    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as User : null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  async getBibleStudies() {
    try {
      const studiesRef = collection(db, 'bible_studies');
      const q = query(studiesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BibleStudy[];
    } catch (error) {
      console.error('Erro ao buscar estudos bíblicos:', error);
      throw error;
    }
  },

  async getBlogPosts() {
    try {
      const postsRef = collection(db, 'blog_posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      throw error;
    }
  },

  async getForumTopics() {
    try {
      const topicsRef = collection(db, 'forum_topics');
      const q = query(topicsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ForumTopic[];
    } catch (error) {
      console.error('Erro ao buscar tópicos:', error);
      throw error;
    }
  },

  async getEvents() {
    try {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('startTime', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    }
  }
};
