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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    console.log('Inserindo estudos bíblicos...');
    const bibleStudies = [
      {
        title: "As Parábolas de Jesus",
        content: "Um estudo profundo sobre as parábolas de Jesus...",
        author_id: user.id,
        created_at: new Date().toISOString(),
      },
    ];

    const { error: studiesError } = await supabase
      .from('bible_studies')
      .insert(bibleStudies);

    if (studiesError) throw studiesError;
    console.log('Estudos bíblicos inseridos com sucesso');

    console.log('Inserindo eventos...');
    const events = [
      {
        title: "Culto Especial de Louvor",
        description: "Uma noite especial de adoração...",
        start_time: new Date("2024-04-23T19:00:00").toISOString(),
        end_time: new Date("2024-04-23T21:30:00").toISOString(),
        category: "Culto",
      },
    ];

    const { error: eventsError } = await supabase
      .from('events')
      .insert(events);

    if (eventsError) throw eventsError;
    console.log('Eventos inseridos com sucesso');

    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
    throw error;
  }
}

seed()
  .catch(console.error);