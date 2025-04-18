
import { pgTable, text, uuid, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bibleStudies = pgTable("bible_studies", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  imageUrl: text("image_url"),
  bibleVerse: text("bible_verse"),
  bibleReference: text("bible_reference"),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  published: boolean("published").default(true).notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  imageUrl: text("image_url"),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readTime: integer("read_time").notNull(),
  views: integer("views").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
});

export const forumTopics = pgTable("forum_topics", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  views: integer("views").default(0).notNull(),
  replyCount: integer("reply_count").default(0).notNull(),
  lastReplyAt: timestamp("last_reply_at"),
});

export const forumReplies = pgTable("forum_replies", {
  id: uuid("id").primaryKey().defaultRandom(),
  topicId: uuid("topic_id").references(() => forumTopics.id).notNull(),
  content: text("content").notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  category: text("category"),
});

export const insertUserSchema = createInsertSchema(users);
export const insertBibleStudySchema = createInsertSchema(bibleStudies);
export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const insertForumTopicSchema = createInsertSchema(forumTopics);
export const insertForumReplySchema = createInsertSchema(forumReplies);
export const insertEventSchema = createInsertSchema(events);

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
