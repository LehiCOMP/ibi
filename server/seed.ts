
import { createClient } from '@supabase/supabase-js';

async function seed() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Variáveis SUPABASE_URL e SUPABASE_KEY são necessárias');
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  // Inserir usuários
  const users = [
    {
      username: "admin",
      email: "admin@igrejaaonline.com",
      display_name: "Administrador",
      avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      username: "pastora.maria",
      email: "maria@igrejaaonline.com",
      display_name: "Pastora Maria Silva",
      avatar_url: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    // Adicione outros usuários aqui
  ];

  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .insert(users)
    .select();

  if (usersError) throw usersError;
  console.log('Usuários inseridos:', usersData);

  // Inserir estudos bíblicos
  const bibleStudies = [
    {
      title: "As Parábolas de Jesus",
      content: "Um estudo profundo sobre as parábolas de Jesus...",
      author_id: usersData[1].id, // Pastora Maria
      created_at: new Date().toISOString(),
    },
    // Adicione outros estudos aqui
  ];

  const { error: studiesError } = await supabase
    .from('bible_studies')
    .insert(bibleStudies);

  if (studiesError) throw studiesError;
  console.log('Estudos bíblicos inseridos');

  // Inserir eventos
  const events = [
    {
      title: "Culto Especial de Louvor",
      description: "Uma noite especial de adoração...",
      start_time: new Date("2024-04-23T19:00:00").toISOString(),
      end_time: new Date("2024-04-23T21:30:00").toISOString(),
      category: "Culto",
    },
    // Adicione outros eventos aqui
  ];

  const { error: eventsError } = await supabase
    .from('events')
    .insert(events);

  if (eventsError) throw eventsError;
  console.log('Eventos inseridos');
}

seed()
  .then(() => console.log('Seed concluído com sucesso!'))
  .catch(console.error);
