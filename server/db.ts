
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const requiredVars = {
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID
};

const missingVars = Object.entries(requiredVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Variáveis do Firebase faltando: ${missingVars.join(', ')}`);
}

console.log('Firebase Admin Config:', {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length
});

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID?.replace(/["']/g, '').trim(),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.replace(/["']/g, '').trim(),
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/["']/g, '').trim()
  })
});

// Log para debug
console.log('Firebase Admin inicializado com projeto:', process.env.FIREBASE_PROJECT_ID?.replace(/["']/g, '').trim());

const db = getFirestore(app);

export { db };

process.on('unhandledRejection', (error) => {
  console.error('Erro não tratado:', error);
});
