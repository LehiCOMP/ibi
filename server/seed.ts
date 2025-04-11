import { createClient } from '@supabase/supabase-js';
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

    const { data: user, error: signUpError } = await supabase.auth.signUp({
      email: 'lehikayn@gmail.com',
      password: 'adminpass123',
      options: {
        data: {
          username: 'admin',
          display_name: 'Administrador'
        }
      }
    });

    if (signUpError) throw signUpError;

    console.log("Seed concluído com sucesso!");
  } catch (error) {
    console.error('Erro durante o seed:', error);
    throw error;
  }
}

seed()
  .catch(console.error);