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
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'lehikayn@gmail.com',
      password: 'adminpass123',
    });

    if (authError) throw authError;

    const adminId = authData.user?.id;
    if (!adminId) throw new Error('Falha ao criar usuário admin');

    console.log('Inserindo dados do usuário...');
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: adminId,
        username: 'admin',
        display_name: 'Administrador',
        email: 'lehikayn@gmail.com'
      });

    if (profileError) throw profileError;

    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
    throw error;
  }
}

seed()
  .catch(console.error);