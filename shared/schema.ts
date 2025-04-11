import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  avatar: true,
});

// Bible Studies schema
export const bibleStudies = pgTable("bible_studies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  imageUrl: text("image_url"),
  bibleVerse: text("bible_verse"),
  bibleReference: text("bible_reference"),
  authorId: integer("author_id").notNull(),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  published: boolean("published").default(true).notNull(),
});

export const insertBibleStudySchema = createInsertSchema(bibleStudies).pick({
  title: true,
  content: true,
  summary: true,
  imageUrl: true,
  bibleVerse: true,
  bibleReference: true,
  authorId: true,
  category: true,
  published: true,
});

// Blog Posts schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  imageUrl: text("image_url"),
  authorId: integer("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readTime: integer("read_time").notNull(), // in minutes
  views: integer("views").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  content: true,
  summary: true,
  imageUrl: true,
  authorId: true,
  readTime: true,
  featured: true,
  published: true,
});

// Forum Topics schema
export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(), 
  authorId: integer("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  views: integer("views").default(0).notNull(),
  replyCount: integer("reply_count").default(0).notNull(),
  lastReplyAt: timestamp("last_reply_at"),
});

export const insertForumTopicSchema = createInsertSchema(forumTopics).pick({
  title: true,
  content: true,
  authorId: true,
});

// Forum Replies schema
export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertForumReplySchema = createInsertSchema(forumReplies).pick({
  topicId: true,
  content: true,
  authorId: true,
});

// Events schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  category: text("category"),
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  location: true,
  startTime: true,
  endTime: true,
  category: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BibleStudy = typeof bibleStudies.$inferSelect;
export type InsertBibleStudy = z.infer<typeof insertBibleStudySchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type ForumTopic = typeof forumTopics.$inferSelect;
export type InsertForumTopic = z.infer<typeof insertForumTopicSchema>;

export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
