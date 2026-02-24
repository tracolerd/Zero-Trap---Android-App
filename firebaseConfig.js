// firebaseConfig.js
// Firebase Web SDK with Email Authentication

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2KF8TRejRghM3ZVUd8WTt39w5uXMITxc",
  authDomain: "zerotrap-d81fd.firebaseapp.com",
  projectId: "zerotrap-d81fd",
  storageBucket: "zerotrap-d81fd.firebasestorage.app",
  messagingSenderId: "411206037583",
  appId: "1:411206037583:web:43bca0fe892f7ac85dfa3a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };