// firebaseConfig.js
// Complete Firebase Configuration for Zero Trap

import { initializeApp } from 'firebase/app';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage (for future use when upgraded to Blaze)
const storage = getStorage(app);

export { app, auth, db, storage };