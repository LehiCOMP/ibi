
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

console.log('Variáveis disponíveis:', {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_KEY: process.env.VITE_SUPABASE_KEY
});

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_KEY) {
  throw new Error('As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_KEY são necessárias');
}

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

let db: ReturnType<typeof drizzle>;

try {
  const connectionString = process.env.VITE_SUPABASE_URL;
  
  const pool = postgres(connectionString, {
    max: 3,
    idle_timeout: 30,
    connect_timeout: 30,
    max_lifetime: 60 * 30,
    connection: {
      application_name: 'igreja-app',
      keepalive: true,
      keepaliveInitialDelayMillis: 5000,
      statement_timeout: 60000,
      query_timeout: 60000
    },
    ssl: {
      rejectUnauthorized: false
    }
  });

  db = drizzle(pool, { schema });
  console.log("Conexão com banco de dados estabelecida com sucesso");
} catch (error) {
  console.error("Erro ao conectar com banco de dados:", error);
  throw error;
}

export { db };
