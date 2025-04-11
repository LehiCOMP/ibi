
import { createClient } from '@supabase/supabase-js';
import { hashPassword } from './auth';
import dotenv from 'dotenv';

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

seed()
  .catch(console.error);
