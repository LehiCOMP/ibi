import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import pg from 'pg';
const { Pool } = pg;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('As variáveis de ambiente SUPABASE_URL e SUPABASE_KEY são necessárias');
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

import * as schema from "@shared/schema";

try {
  const pool = postgres(process.env.SUPABASE_URL);
  export const db = drizzle(pool, { schema });
  console.log("Conexão com banco de dados estabelecida com sucesso");
} catch (error) {
  console.error("Erro ao conectar com banco de dados:", error);
  throw error;
}

export const pool = new Pool({
  connectionString: process.env.SUPABASE_URL
});