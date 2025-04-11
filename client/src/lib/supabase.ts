
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('As variáveis de ambiente SUPABASE_URL e SUPABASE_KEY são necessárias');
}

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
