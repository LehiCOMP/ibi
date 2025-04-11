
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Variáveis SUPABASE_URL e SUPABASE_KEY são necessárias');
  }

  console.log('Iniciando seed do banco de dados...');

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  try {
    console.log('Criando usuário admin...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@igrejaaonline.com',
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
        email: 'admin@igrejaaonline.com',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      });

    if (profileError) throw profileError;

    console.log('Inserindo estudos bíblicos...');
    const { error: studiesError } = await supabase
      .from('bible_studies')
      .insert({
        title: "As Parábolas de Jesus",
        content: "Um estudo profundo sobre as parábolas de Jesus...",
        summary: "Estudo sobre parábolas",
        author_id: adminId,
        created_at: new Date().toISOString()
      });

    if (studiesError) throw studiesError;

    console.log('Inserindo eventos...');
    const { error: eventsError } = await supabase
      .from('events')
      .insert({
        title: "Culto Especial de Louvor",
        description: "Uma noite especial de adoração...",
        location: "Santuário Principal",
        start_time: new Date("2024-04-23T19:00:00").toISOString(),
        end_time: new Date("2024-04-23T21:30:00").toISOString(),
        category: "Culto"
      });

    if (eventsError) throw eventsError;

    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
    throw error;
  }
}

seed()
  .catch(console.error);
