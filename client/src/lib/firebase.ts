
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBIzhPVXELE6TtWQGZ2snhXy-yo7pJc2OU",
  authDomain: "ibiparnaiba-71381.firebaseapp.com",
  projectId: "ibiparnaiba-71381",
  storageBucket: "ibiparnaiba-71381.firebasestorage.app",
  messagingSenderId: "726095178887",
  appId: "1:726095178887:web:7bf626edd44cde931f1c22"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
