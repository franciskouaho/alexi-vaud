import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDsPdvwfJtJ5lfkrSbEtrmW6gQ7lO7sW48",
  authDomain: "jeu-d-enquete---chatel.firebaseapp.com",
  projectId: "jeu-d-enquete---chatel",
  storageBucket: "jeu-d-enquete---chatel.firebasestorage.app",
  messagingSenderId: "937006056816",
  appId: "1:937006056816:web:cc984f68c596308cd73bb5",
  measurementId: "G-GL35JENGW3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export { signInAnonymously, onAuthStateChanged };

export default app;