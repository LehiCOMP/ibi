
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_PROJECT_ID) {
  throw new Error('Todas as variáveis do Firebase são necessárias');
}

try {
  const app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });

  export const db = getFirestore(app);
} catch (error) {
  console.error('Erro ao inicializar Firebase:', error);
  throw error;
}
