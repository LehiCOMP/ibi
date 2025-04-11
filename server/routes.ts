import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBibleStudySchema, 
  insertBlogPostSchema, 
  insertForumTopicSchema, 
  insertForumReplySchema,
  insertEventSchema 
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";

// Middleware para verificar autenticação
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Não autenticado. Faça login para continuar." });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configurar autenticação
  setupAuth(app);
  
  const apiRouter = express.Router();
  
  // Helper function to handle validation errors
  const validateRequest = (schema: any, data: any) => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        throw new Error(validationError.message);
      }
      throw error;
    }
  };

  // Bible Studies Endpoints
  apiRouter.get("/bible-studies", async (req: Request, res: Response) => {
    try {
      const studies = await storage.getBibleStudies();
      res.json(studies);
    } catch (error) {
      res.status(500).json({ message: "Error fetching Bible studies" });
    }
  });
  
  apiRouter.get("/bible-studies/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const study = await storage.getBibleStudy(id);
      if (!study) {
        return res.status(404).json({ message: "Bible study not found" });
      }
      
      res.json(study);
    } catch (error) {
      res.status(500).json({ message: "Error fetching Bible study" });
    }
  });
  
  apiRouter.post("/bible-studies", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = validateRequest(insertBibleStudySchema, req.body);
      
      // Adicionar o ID do usuário autenticado como autor
      const studyData = {
        ...validated,
        authorId: req.user!.id
      };
      
      const study = await storage.createBibleStudy(studyData);
      res.status(201).json(study);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid Bible study data" });
    }
  });
  
  // Blog Posts Endpoints
  apiRouter.get("/blog-posts", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });
  
  apiRouter.get("/blog-posts/featured", async (req: Request, res: Response) => {
    try {
      const post = await storage.getFeaturedBlogPost();
      if (!post) {
        return res.status(404).json({ message: "No featured post found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured blog post" });
    }
  });
  
  apiRouter.get("/blog-posts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Increment view count
      await storage.incrementBlogPostViews(id);
      
      // Get the updated post with incremented views
      const updatedPost = await storage.getBlogPost(id);
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });
  
  apiRouter.post("/blog-posts", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = validateRequest(insertBlogPostSchema, req.body);
      
      // Adicionar o ID do usuário autenticado como autor
      const postData = {
        ...validated,
        authorId: req.user!.id
      };
      
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid blog post data" });
    }
  });
  
  // Forum Topics Endpoints
  apiRouter.get("/forum-topics", async (req: Request, res: Response) => {
    try {
      const topics = await storage.getForumTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Error fetching forum topics" });
    }
  });
  
  apiRouter.get("/forum-topics/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const topic = await storage.getForumTopic(id);
      if (!topic) {
        return res.status(404).json({ message: "Forum topic not found" });
      }
      
      // Increment view count
      await storage.incrementForumTopicViews(id);
      
      // Get the updated topic with incremented views
      const updatedTopic = await storage.getForumTopic(id);
      
      // Get replies for this topic
      const replies = await storage.getForumReplies(id);
      
      // Get author information for each reply
      const repliesWithAuthors = await Promise.all(
        replies.map(async (reply) => {
          const author = await storage.getUser(reply.authorId);
          return {
            ...reply,
            author: author ? {
              id: author.id,
              displayName: author.displayName,
              avatar: author.avatar
            } : undefined
          };
        })
      );
      
      // Get author information for the topic
      const author = await storage.getUser(updatedTopic.authorId);
      
      res.json({
        topic: {
          ...updatedTopic,
          author: author ? {
            id: author.id,
            displayName: author.displayName,
            avatar: author.avatar
          } : undefined
        },
        replies: repliesWithAuthors
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching forum topic" });
    }
  });
  
  apiRouter.post("/forum-topics", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = validateRequest(insertForumTopicSchema, req.body);
      
      // Adicionar o ID do usuário autenticado como autor
      const topicData = {
        ...validated,
        authorId: req.user!.id
      };
      
      const topic = await storage.createForumTopic(topicData);
      
      // Get author information
      const author = await storage.getUser(topic.authorId);
      
      res.status(201).json({
        ...topic,
        author: author ? {
          id: author.id,
          displayName: author.displayName,
          avatar: author.avatar
        } : undefined
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid forum topic data" });
    }
  });
  
  // Forum Replies Endpoints
  apiRouter.post("/forum-replies", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = validateRequest(insertForumReplySchema, req.body);
      
      // Check if topic exists
      const topic = await storage.getForumTopic(validated.topicId);
      if (!topic) {
        return res.status(404).json({ message: "Forum topic not found" });
      }
      
      // Adicionar o ID do usuário autenticado como autor
      const replyData = {
        ...validated,
        authorId: req.user!.id
      };
      
      const reply = await storage.createForumReply(replyData);
      
      // Get author information
      const author = await storage.getUser(reply.authorId);
      
      res.status(201).json({
        ...reply,
        author: author ? {
          id: author.id,
          displayName: author.displayName,
          avatar: author.avatar
        } : undefined
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid forum reply data" });
    }
  });
  
  // Events Endpoints
  apiRouter.get("/events", async (req: Request, res: Response) => {
    try {
      const events = await storage.getEvents();
      
      // Sort events by start time
      events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Error fetching events" });
    }
  });
  
  apiRouter.get("/events/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Error fetching event" });
    }
  });
  
  apiRouter.post("/events", requireAuth, async (req: Request, res: Response) => {
    try {
      const validated = validateRequest(insertEventSchema, req.body);
      
      // Adicionar o ID do usuário autenticado como autor (se aplicável)
      const eventData = {
        ...validated
      };
      
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid event data" });
    }
  });
  
  // User Endpoints (just for getting author information)
  apiRouter.get("/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return sensitive information
      const safeUser = {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        createdAt: user.createdAt
      };
      
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  // Register API routes with /api prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
