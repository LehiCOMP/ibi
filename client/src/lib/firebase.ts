
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Variáveis de ambiente faltando: ${missingVars.join(', ')}`);
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.replace(/["']/g, ''),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.replace(/["']/g, ''),
  projectId: "ibiparnaiba-71381",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.replace(/["']/g, ''),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.replace(/["']/g, ''),
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.replace(/["']/g, '')
};

console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'Configurada (length: ' + firebaseConfig.apiKey.length + ')' : 'Não configurada',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
