
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('As variáveis de ambiente SUPABASE_URL e SUPABASE_KEY são necessárias');
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const client = postgres(process.env.SUPABASE_URL);
export const db = drizzle(client);
