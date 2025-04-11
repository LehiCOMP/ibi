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

class Storage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getBibleStudies(): Promise<BibleStudy[]> {
    return await db.select().from(bibleStudies).orderBy(bibleStudies.createdAt);
  }

  async getBibleStudy(id: string): Promise<BibleStudy | undefined> {
    const result = await db.select().from(bibleStudies).where(eq(bibleStudies.id, id));
    return result[0];
  }

  async createBibleStudy(study: InsertBibleStudy): Promise<BibleStudy> {
    const result = await db.insert(bibleStudies).values(study).returning();
    return result[0];
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return result[0];
  }

  async getFeaturedBlogPost(): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.featured, true)).limit(1);
    return result[0];
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(post).returning();
    return result[0];
  }

  async incrementBlogPostViews(id: string): Promise<void> {
    await db
      .update(blogPosts)
      .set({ views: blogPosts.views + 1 })
      .where(eq(blogPosts.id, id));
  }

  async getForumTopics(): Promise<ForumTopic[]> {
    return await db.select().from(forumTopics).orderBy(forumTopics.createdAt);
  }

  async getForumTopic(id: string): Promise<ForumTopic | undefined> {
    const result = await db.select().from(forumTopics).where(eq(forumTopics.id, id));
    return result[0];
  }

  async createForumTopic(topic: InsertForumTopic): Promise<ForumTopic> {
    const result = await db.insert(forumTopics).values(topic).returning();
    return result[0];
  }

  async incrementForumTopicViews(id: string): Promise<void> {
    await db
      .update(forumTopics)
      .set({ views: forumTopics.views + 1 })
      .where(eq(forumTopics.id, id));
  }

  async getForumReplies(topicId: string): Promise<ForumReply[]> {
    return await db
      .select()
      .from(forumReplies)
      .where(eq(forumReplies.topicId, topicId))
      .orderBy(forumReplies.createdAt);
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const result = await db.insert(forumReplies).values(reply).returning();

    // Atualizar contagem de respostas e última resposta
    await db
      .update(forumTopics)
      .set({
        replyCount: forumTopics.replyCount + 1,
        lastReplyAt: new Date()
      })
      .where(eq(forumTopics.id, reply.topicId));

    return result[0];
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(events.startTime);
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id));
    return result[0];
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }
}

export const storage = new Storage();