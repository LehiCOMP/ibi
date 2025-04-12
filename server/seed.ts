import { db } from './db';
import { hashPassword } from './auth';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  console.log('Iniciando seed do banco de dados Firebase...');

  try {
    const hashedPassword = await hashPassword('adminpass123');

    // Verificar se o usuário admin já existe
    const usersRef = db.collection('users');
    const adminQuery = await usersRef.where('username', '==', 'admin').get();

    if (adminQuery.empty) {
      await usersRef.add({
        username: 'admin',
        password: hashedPassword,
        displayName: 'Administrador',
        email: 'lehikayn@gmail.com',
        createdAt: new Date().toISOString()
      });
      console.log('Usuário admin criado com sucesso!');
    } else {
      console.log('Usuário admin já existe.');
    }

    // Criar coleções vazias se não existirem
    const collections = [
      'bible_studies',
      'blog_posts',
      'forum_topics',
      'forum_replies',
      'events'
    ];

    for (const collectionName of collections) {
      const collRef = db.collection(collectionName);
      const snapshot = await collRef.limit(1).get();
      if (snapshot.empty) {
        console.log(`Coleção ${collectionName} criada.`);
      } else {
        console.log(`Coleção ${collectionName} já existe.`);
      }
    }

    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
    throw error;
  }
}

seed()
  .catch(console.error);