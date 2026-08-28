// firebaseConfig.js
// Complete Firebase Configuration for Zero Trap

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use the Web app apiKey/appId for the Firebase JS SDK in Expo/RN (not the Android-restricted key from google-services.json).
const firebaseConfig = {
  apiKey: "AIzaSyB2KF8TRejRghM3ZVUd8WTt39w5uXMITxc",
  authDomain: "zerotrap-d81fd.firebaseapp.com",
  projectId: "zerotrap-d81fd",
  storageBucket: "zerotrap-d81fd.firebasestorage.app",
  messagingSenderId: "411206037583",
  appId: "1:411206037583:web:43bca0fe892f7ac85dfa3a"
};

// Single Firebase app instance (avoids "already exists" on Fast Refresh)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with AsyncStorage persistence (getAuth fallback avoids crash on Fast Refresh)
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage (for future use when upgraded to Blaze)
const storage = getStorage(app);

export { app, auth, db, storage };