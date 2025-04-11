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