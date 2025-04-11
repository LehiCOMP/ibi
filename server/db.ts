
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_KEY) {
  throw new Error('As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_KEY são necessárias');
}

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

let db: ReturnType<typeof drizzle>;

try {
  const pool = postgres(process.env.VITE_SUPABASE_URL, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
    connection: {
      application_name: 'igreja-app'
    }
  });
  db = drizzle(pool, { schema });
  console.log("Conexão com banco de dados estabelecida com sucesso");
} catch (error) {
  console.error("Erro ao conectar com banco de dados:", error);
  throw error;
}

export { db };
