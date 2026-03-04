// firebaseConfig.js
// Firebase Web SDK with Storage + Auth + Firestore

import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

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
const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.log('Persistence not available');
  }
});

export { app, db, auth, storage };