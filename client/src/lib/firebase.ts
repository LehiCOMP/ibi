
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.replace(/['"]/g, '') || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.replace(/['"]/g, '') || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.replace(/['"]/g, '') || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.replace(/['"]/g, '') || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.replace(/['"]/g, '') || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.replace(/['"]/g, '') || ''
};

// Log para debug
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? '**********' : 'missing',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

try {
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const storage = getStorage(app);
} catch (error) {
  console.error('Erro ao inicializar Firebase:', error);
  throw error;
}
