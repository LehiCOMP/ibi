import { 
  users, type User, type InsertUser, type NewUser,
  bibleStudies, type BibleStudy, type InsertBibleStudy,
  blogPosts, type BlogPost, type InsertBlogPost,
  forumTopics, type ForumTopic, type InsertForumTopic,
  forumReplies, type ForumReply, type InsertForumReply,
  events, type Event, type InsertEvent
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: NewUser): Promise<User>;

  // Bible Study operations
  getBibleStudies(): Promise<BibleStudy[]>;
  getBibleStudy(id: number): Promise<BibleStudy | undefined>;
  createBibleStudy(study: InsertBibleStudy): Promise<BibleStudy>;

  // Blog Post operations
  getBlogPosts(): Promise<BlogPost[]>;
  getFeaturedBlogPost(): Promise<BlogPost | undefined>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  incrementBlogPostViews(id: number): Promise<void>;

  // Forum operations
  getForumTopics(): Promise<ForumTopic[]>;
  getForumTopic(id: number): Promise<ForumTopic | undefined>;
  createForumTopic(topic: InsertForumTopic): Promise<ForumTopic>;
  incrementForumTopicViews(id: number): Promise<void>;

  // Forum reply operations
  getForumReplies(topicId: number): Promise<ForumReply[]>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;

  // Event operations
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bibleStudies: Map<number, BibleStudy>;
  private blogPosts: Map<number, BlogPost>;
  private forumTopics: Map<number, ForumTopic>;
  private forumReplies: Map<number, ForumReply>;
  private events: Map<number, Event>;

  private currentUserId: number;
  private currentBibleStudyId: number;
  private currentBlogPostId: number;
  private currentForumTopicId: number;
  private currentForumReplyId: number;
  private currentEventId: number;

  constructor() {
    this.users = new Map();
    this.bibleStudies = new Map();
    this.blogPosts = new Map();
    this.forumTopics = new Map();
    this.forumReplies = new Map();
    this.events = new Map();

    this.currentUserId = 1;
    this.currentBibleStudyId = 1;
    this.currentBlogPostId = 1;
    this.currentForumTopicId = 1;
    this.currentForumReplyId = 1;
    this.currentEventId = 1;

    // Add some initial data
    this.seedInitialData();
  }

  private seedInitialData() {
    // Create a default admin user
    const adminUser: InsertUser = {
      username: "admin",
      password: "adminpass",
      displayName: "Administrador",
      email: "admin@igrejaaonline.com",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    };

    const pastorMaria: InsertUser = {
      username: "pastora.maria",
      password: "password",
      displayName: "Pastora Maria Silva",
      email: "maria@igrejaaonline.com",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    };

    const pastorJoao: InsertUser = {
      username: "pastor.joao",
      password: "password",
      displayName: "Pastor João Oliveira",
      email: "joao@igrejaaonline.com",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    };

    const diaconaAna: InsertUser = {
      username: "diacona.ana",
      password: "password",
      displayName: "Diácona Ana Souza",
      email: "ana@igrejaaonline.com",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    };

    const lucasMendes: InsertUser = {
      username: "lucas.mendes",
      password: "password",
      displayName: "Lucas Mendes",
      email: "lucas@igrejaaonline.com",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    };

    const pedroAlmeida: InsertUser = {
      username: "pedro.almeida",
      password: "password",
      displayName: "Pedro Almeida",
      email: "pedro@igrejaaonline.com",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    };

    const carlaSantos: InsertUser = {
      username: "carla.santos",
      password: "password",
      displayName: "Carla Santos",
      email: "carla@igrejaaonline.com",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    };

    const robertoGomes: InsertUser = {
      username: "roberto.gomes",
      password: "password",
      displayName: "Roberto Gomes",
      email: "roberto@igrejaaonline.com",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    };

    this.createUser(adminUser);
    const mariaUser = this.createUser(pastorMaria);
    const joaoUser = this.createUser(pastorJoao);
    const anaUser = this.createUser(diaconaAna);
    const lucasUser = this.createUser(lucasMendes);
    const pedroUser = this.createUser(pedroAlmeida);
    const carlaUser = this.createUser(carlaSantos);
    const robertoUser = this.createUser(robertoGomes);

    // Create Bible Studies
    const parabolasDeJesus: InsertBibleStudy = {
      title: "As Parábolas de Jesus",
      content: "Um estudo profundo sobre as parábolas de Jesus e seus significados para a vida moderna. Jesus frequentemente utilizava parábolas para ensinar lições importantes sobre o Reino de Deus, moralidade e espiritualidade. Neste estudo, exploramos o contexto histórico, significado e aplicações práticas das principais parábolas encontradas nos evangelhos.",
      summary: "Um estudo profundo sobre as parábolas e seus significados para a vida moderna.",
      imageUrl: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      bibleVerse: "Todas estas coisas falou Jesus por parábolas à multidão; e nada lhes falava sem parábolas.",
      bibleReference: "Mateus 13:34",
      authorId: joaoUser.id,
      category: "Série",
      published: true
    };

    const salmosDeEsperanca: InsertBibleStudy = {
      title: "Salmos de Esperança",
      content: "Encontrando força e conforto nos Salmos em tempos de incerteza. O livro de Salmos é uma rica coleção de orações, hinos e poemas que expressam toda a gama de emoções humanas. Neste estudo, nos concentramos nos salmos que oferecem esperança e conforto em meio às lutas e desafios da vida, explorando como podemos aplicar essas verdades em nossa caminhada diária de fé.",
      summary: "Encontrando força e conforto nos Salmos em tempos de incerteza.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      bibleVerse: "O Senhor é a minha luz e a minha salvação; a quem temerei?",
      bibleReference: "Salmos 27:1",
      authorId: mariaUser.id,
      category: "Novo",
      published: true
    };

    const poderDaOracao: InsertBibleStudy = {
      title: "O Poder da Oração",
      content: "Como desenvolver uma vida de oração eficaz e transformadora. A oração é nossa linha direta de comunicação com Deus, mas muitos crentes lutam para desenvolver uma vida de oração consistente e significativa. Neste estudo prático, exploramos os princípios bíblicos da oração, diferentes tipos de oração, e estratégias práticas para superar obstáculos comuns à vida de oração.",
      summary: "Como desenvolver uma vida de oração eficaz e transformadora.",
      imageUrl: "https://images.unsplash.com/photo-1513001900722-370f803f498d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      bibleVerse: "Orai sem cessar.",
      bibleReference: "1 Tessalonicenses 5:17",
      authorId: anaUser.id,
      category: "",
      published: true
    };

    this.createBibleStudy(parabolasDeJesus);
    this.createBibleStudy(salmosDeEsperanca);
    this.createBibleStudy(poderDaOracao);

    // Create Blog Posts
    const familiaEraDigital: InsertBlogPost = {
      title: "Fortalecendo famílias na era digital: desafios e oportunidades",
      content: "Como podemos usar a tecnologia para construir laços familiares mais fortes enquanto enfrentamos os desafios do mundo digital. Em um mundo cada vez mais conectado, as famílias enfrentam desafios únicos na criação de filhos e na manutenção de relacionamentos saudáveis. Este artigo explora estratégias práticas para usar a tecnologia como aliada na construção de famílias mais fortes, estabelecendo limites saudáveis, e aproveitando as oportunidades digitais para o crescimento espiritual conjunto.",
      summary: "Como podemos usar a tecnologia para construir laços familiares mais fortes enquanto enfrentamos os desafios do mundo digital.",
      imageUrl: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070&auto=format&fit=crop",
      authorId: mariaUser.id,
      readTime: 8,
      featured: true,
      published: true
    };

    const poderAdoracaoColetiva: InsertBlogPost = {
      title: "O poder da adoração coletiva: renovando nossa visão",
      content: "Por que devemos priorizar a adoração comunitária e como ela transforma nossa perspectiva espiritual. A adoração não é apenas um ato individual, mas uma experiência coletiva que fortalece o corpo de Cristo. Este artigo examina as bases bíblicas da adoração comunitária, seus benefícios espirituais e emocionais, e como podemos revitalizar nossa abordagem à adoração coletiva em tempos de individualismo crescente.",
      summary: "Por que devemos priorizar a adoração comunitária e como ela transforma nossa perspectiva espiritual.",
      imageUrl: "https://images.unsplash.com/photo-1508921340878-ba53e1f016ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60",
      authorId: joaoUser.id,
      readTime: 6,
      featured: false,
      published: true
    };

    const cestasBasicas: InsertBlogPost = {
      title: "Servindo ao próximo: o projeto de cestas básicas atinge marco importante",
      content: "Nosso ministério de ação social alcançou mais de 100 famílias neste mês. Veja como você pode participar. O ministério de assistência social da nossa igreja tem trabalhado incansavelmente para atender às necessidades materiais de nossa comunidade. Neste artigo, celebramos o marco recente de ter servido mais de 100 famílias em um único mês, compartilhamos histórias inspiradoras de vidas transformadas, e oferecemos informações práticas sobre como você pode se envolver neste importante ministério.",
      summary: "Nosso ministério de ação social alcançou mais de 100 famílias neste mês. Veja como você pode participar.",
      imageUrl: "https://images.unsplash.com/photo-1535057866921-a768e391e410?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60",
      authorId: anaUser.id,
      readTime: 5,
      featured: false,
      published: true
    };

    const ministerioLouvor: InsertBlogPost = {
      title: "Ministério de louvor abre inscrições para novos integrantes",
      content: "Se você tem talento musical e deseja servir na adoração, confira as oportunidades disponíveis. O ministério de louvor da nossa igreja está em expansão e buscamos pessoas talentosas e dedicadas para servir nesta área vital. Este artigo detalha os requisitos para participação, o processo de seleção, e como o envolvimento no ministério de louvor pode enriquecer sua vida espiritual enquanto você serve à congregação.",
      summary: "Se você tem talento musical e deseja servir na adoração, confira as oportunidades disponíveis.",
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60",
      authorId: lucasUser.id,
      readTime: 4,
      featured: false,
      published: true
    };

    this.createBlogPost(familiaEraDigital);
    this.createBlogPost(poderAdoracaoColetiva);
    this.createBlogPost(cestasBasicas);
    this.createBlogPost(ministerioLouvor);

    // Create Forum Topics
    const criacaoParaCriancas: InsertForumTopic = {
      title: "Como explicar a criação para crianças?",
      content: "Estou organizando uma aula para a escola dominical e gostaria de sugestões de atividades práticas para ensinar sobre a criação do mundo para crianças de 5-7 anos. Alguém tem experiência com materiais ou dinâmicas que funcionem bem para esta faixa etária?",
      authorId: pedroUser.id
    };

    const livrosLideranca: InsertForumTopic = {
      title: "Livros recomendados sobre liderança cristã",
      content: "Estou buscando material para estudar sobre liderança na igreja. Quais autores vocês recomendam? Preciso especialmente de conteúdos que abordem o desenvolvimento de novos líderes e a formação de equipes ministeriais eficazes.",
      authorId: carlaUser.id
    };

    const duvidasApocalipse: InsertForumTopic = {
      title: "Dúvidas sobre o livro de Apocalipse",
      content: "Estou estudando o livro de Apocalipse e tenho algumas dúvidas sobre a interpretação dos selos. Existem diferentes abordagens para entender as profecias deste livro? Como vocês interpretam a sequência dos sete selos em particular?",
      authorId: robertoUser.id
    };

    const topic1 = this.createForumTopic(criacaoParaCriancas);
    const topic2 = this.createForumTopic(livrosLideranca);
    const topic3 = this.createForumTopic(duvidasApocalipse);

    // Update view and reply counts
    this.incrementForumTopicViews(topic1.id);
    this.incrementForumTopicViews(topic1.id);
    this.incrementForumTopicViews(topic1.id);
    this.incrementForumTopicViews(topic1.id);
    this.incrementForumTopicViews(topic1.id);
    this.incrementForumTopicViews(topic1.id);
    this.incrementForumTopicViews(topic1.id);
    this.incrementForumTopicViews(topic1.id);

    this.incrementForumTopicViews(topic2.id);
    this.incrementForumTopicViews(topic2.id);
    this.incrementForumTopicViews(topic2.id);
    this.incrementForumTopicViews(topic2.id);
    this.incrementForumTopicViews(topic2.id);

    this.incrementForumTopicViews(topic3.id);
    this.incrementForumTopicViews(topic3.id);
    this.incrementForumTopicViews(topic3.id);
    this.incrementForumTopicViews(topic3.id);

    // Create replies
    for (let i = 0; i < 8; i++) {
      this.createForumReply({
        topicId: topic1.id,
        content: `Resposta ${i+1} ao tópico sobre criação para crianças.`,
        authorId: [mariaUser.id, joaoUser.id, anaUser.id, lucasUser.id][i % 4]
      });
    }

    for (let i = 0; i < 12; i++) {
      this.createForumReply({
        topicId: topic2.id,
        content: `Resposta ${i+1} ao tópico sobre livros de liderança.`,
        authorId: [mariaUser.id, joaoUser.id, anaUser.id, lucasUser.id][i % 4]
      });
    }

    for (let i = 0; i < 32; i++) {
      this.createForumReply({
        topicId: topic3.id,
        content: `Resposta ${i+1} ao tópico sobre Apocalipse.`,
        authorId: [mariaUser.id, joaoUser.id, anaUser.id, lucasUser.id][i % 4]
      });
    }

    // Create Events
    const cultoEspecial: InsertEvent = {
      title: "Culto Especial de Louvor",
      description: "Uma noite especial de adoração com participação do ministério de louvor e convidados.",
      location: "Santuário Principal",
      startTime: new Date("2023-07-23T19:00:00"),
      endTime: new Date("2023-07-23T21:30:00"),
      category: "Culto"
    };

    const encontroJovens: InsertEvent = {
      title: "Encontro de Jovens",
      description: "Tarde de comunhão, jogos e estudos bíblicos para jovens de 15 a 25 anos.",
      location: "Salão de Atividades",
      startTime: new Date("2023-07-28T15:00:00"),
      endTime: new Date("2023-07-28T18:00:00"),
      category: "Jovens"
    };

    const cafeDaManha: InsertEvent = {
      title: "Café da Manhã de Comunhão",
      description: "Momento especial para compartilhar um café da manhã e fortalecer os laços da comunidade.",
      location: "Refeitório",
      startTime: new Date("2023-08-05T08:30:00"),
      endTime: new Date("2023-08-05T10:30:00"),
      category: "Comunhão"
    };

    this.createEvent(cultoEspecial);
    this.createEvent(encontroJovens);
    this.createEvent(cafeDaManha);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Bible Study methods
  async getBibleStudies(): Promise<BibleStudy[]> {
    return Array.from(this.bibleStudies.values()).filter(study => study.published);
  }

  async getBibleStudy(id: number): Promise<BibleStudy | undefined> {
    return this.bibleStudies.get(id);
  }

  async createBibleStudy(study: InsertBibleStudy): Promise<BibleStudy> {
    const id = this.currentBibleStudyId++;
    const createdAt = new Date();
    const bibleStudy: BibleStudy = { ...study, id, createdAt };
    this.bibleStudies.set(id, bibleStudy);
    return bibleStudy;
  }

  // Blog Post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(post => post.published);
  }

  async getFeaturedBlogPost(): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.featured && post.published);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const createdAt = new Date();
    const blogPost: BlogPost = { ...post, id, createdAt, views: 0 };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async incrementBlogPostViews(id: number): Promise<void> {
    const post = this.blogPosts.get(id);
    if (post) {
      post.views += 1;
      this.blogPosts.set(id, post);
    }
  }

  // Forum methods
  async getForumTopics(): Promise<ForumTopic[]> {
    return Array.from(this.forumTopics.values());
  }

  async getForumTopic(id: number): Promise<ForumTopic | undefined> {
    return this.forumTopics.get(id);
  }

  async createForumTopic(topic: InsertForumTopic): Promise<ForumTopic> {
    const id = this.currentForumTopicId++;
    const createdAt = new Date();
    const forumTopic: ForumTopic = { 
      ...topic, 
      id, 
      createdAt, 
      views: 0, 
      replyCount: 0,
      lastReplyAt: createdAt 
    };
    this.forumTopics.set(id, forumTopic);
    return forumTopic;
  }

  async incrementForumTopicViews(id: number): Promise<void> {
    const topic = this.forumTopics.get(id);
    if (topic) {
      topic.views += 1;
      this.forumTopics.set(id, topic);
    }
  }

  // Forum Reply methods
  async getForumReplies(topicId: number): Promise<ForumReply[]> {
    return Array.from(this.forumReplies.values())
      .filter(reply => reply.topicId === topicId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const id = this.currentForumReplyId++;
    const createdAt = new Date();
    const forumReply: ForumReply = { ...reply, id, createdAt };
    this.forumReplies.set(id, forumReply);

    // Update topic reply count and last reply time
    const topic = this.forumTopics.get(reply.topicId);
    if (topic) {
      topic.replyCount += 1;
      topic.lastReplyAt = createdAt;
      this.forumTopics.set(reply.topicId, topic);
    }

    return forumReply;
  }

  // Event methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const createdAt = new Date();
    const newEvent: Event = { ...event, id, createdAt };
    this.events.set(id, newEvent);
    return newEvent;
  }
}

import { supabase } from "./db";
import type { Database } from "@/types/supabase";
import type { NewUser, User } from "@shared/schema";

export const storage = {
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserByUsername(username: string) {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('username', username)
      .single();

    if (error) throw error;
    return data;
  },

  async createUser(user: NewUser) {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getBibleStudies() {
    return await db.select().from(bibleStudies).orderBy(bibleStudies.createdAt);
  },

  async getBibleStudy(id: number) {
    const result = await db.select().from(bibleStudies).where(eq(bibleStudies.id, id));
    return result[0];
  },

  async createBibleStudy(study: typeof bibleStudies.$inferInsert) {
    const result = await db.insert(bibleStudies).values(study).returning();
    return result[0];
  },

  async getBlogPosts() {
    return await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
  },

  async getBlogPost(id: number) {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return result[0];
  },

  async createBlogPost(post: typeof blogPosts.$inferInsert) {
    const result = await db.insert(blogPosts).values(post).returning();
    return result[0];
  },

  async getForumTopics() {
    const { data, error } = await supabase
      .from('forum_topics')
      .select()
      .order('created_at');
    if (error) throw error;
    return data;
  },

  async getForumTopic(id: number) {
    const result = await db.select().from(forumTopics).where(eq(forumTopics.id, id));
    return result[0];
  },

  async createForumTopic(topic: typeof forumTopics.$inferInsert) {
    const result = await db.insert(forumTopics).values(topic).returning();
    return result[0];
  },

  async getForumReplies(topicId: string) {
    const { data, error } = await supabase
      .from('forum_replies')
      .select()
      .eq('topic_id', topicId)
      .order('created_at');
    if (error) throw error;
    return data;
  },

  async createForumReply(reply: typeof forumReplies.$inferInsert) {
    const result = await db.insert(forumReplies).values(reply).returning();
    return result[0];
  },

  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select()
      .order('created_at');
    if (error) throw error;
    return data;
  },

  async getEvent(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select()
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createEvent(event: InsertEvent) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async incrementBlogPostViews(id: number) {
    await db
      .update(blogPosts)
      .set({ views: blogPosts.views + 1 })
      .where(eq(blogPosts.id, id));
  },

  async incrementForumTopicViews(id: number) {
    await db
      .update(forumTopics)
      .set({ views: forumTopics.views + 1 })
      .where(eq(forumTopics.id, id));
  }
};