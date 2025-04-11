import { createClient } from '@supabase/supabase-js';
import { hashPassword } from './auth';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';
import { sql } from 'drizzle-orm';

dotenv.config();

async function seed() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Variáveis SUPABASE_URL e SUPABASE_KEY são necessárias');
  }

  console.log('Iniciando seed do banco de dados...');

  const supabase = createClient(
    process.env.SUPABASE_URL.trim(),
    process.env.SUPABASE_KEY.trim()
  );

  try {
    console.log('Criando usuário admin...');

    const hashedPassword = await hashPassword('adminpass123');

    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('username', 'admin')
      .single();

    if (!existingUser) {
      const { data: user, error } = await supabase
        .from('users')
        .insert({
          username: 'admin',
          password: hashedPassword,
          display_name: 'Administrador',
          email: 'lehikayn@gmail.com',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      console.log('Usuário admin criado com sucesso!');
    } else {
      console.log('Usuário admin já existe.');
    }

    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
    throw error;
  }
}

async function createTables() {
  if (!process.env.VITE_SUPABASE_URL) {
    throw new Error('VITE_SUPABASE_URL é necessária');
  }

  const poolUrl = process.env.VITE_SUPABASE_URL.replace('.supabase.co', '-pooler.supabase.co');
  const pool = postgres(poolUrl, { ssl: { rejectUnauthorized: false } });
  const db = drizzle(pool, { schema });

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        display_name TEXT NOT NULL,
        email TEXT NOT NULL,
        avatar TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tabelas verificadas/criadas com sucesso');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed()
  .catch(console.error);

createTables()
  .then(() => console.log('Setup concluído'))
  .catch(console.error);