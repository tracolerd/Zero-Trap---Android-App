// firebaseConfig.js
// Complete Firebase Configuration for Zero Trap

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCR34xAzwjLJAmsbIbBXuC_udV2rbQwgMo",
  authDomain: "zerotrap-d81fd.firebaseapp.com",
  projectId: "zerotrap-d81fd",
  storageBucket: "zerotrap-d81fd.firebasestorage.app",
  messagingSenderId: "411206037583",
  appId: "1:411206037583:android:9d03c60e6f43d08d5dfa3a"
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