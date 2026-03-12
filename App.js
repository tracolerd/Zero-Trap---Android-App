// App.js
// FIXED - Proper authentication persistence

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Splash');

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in
        // Save to AsyncStorage
        await AsyncStorage.setItem('userId', user.uid);
        await AsyncStorage.setItem('userEmail', user.email);
        console.log('✅ User authenticated:', user.email);
      } else {
        // User is logged out
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('currentUser');
        console.log('❌ User logged out');
      }
    });

    // Check initial auth state
    checkInitialAuth();

    return () => unsubscribe();
  }, []);

  const checkInitialAuth = async () => {
    try {
      // Check AsyncStorage first
      const userId = await AsyncStorage.getItem('userId');
      const firebaseUser = auth.currentUser;

      console.log('Checking auth - userId:', userId, 'firebaseUser:', firebaseUser?.email);

      if (userId && firebaseUser) {
        // User is logged in
        setInitialRoute('Home');
      } else {
        // User not logged in
        setInitialRoute('Login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setInitialRoute('Login');
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return null; // Or your splash screen
  }

  return (
    <NavigationContainer>
      <AppNavigator initialRouteName={initialRoute} />
    </NavigationContainer>
  );
}