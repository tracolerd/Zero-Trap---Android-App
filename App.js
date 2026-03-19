// App.js
// FINAL - Fixed navigation and white screen

import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState('Splash');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 App initializing...');

      // Wait for Firebase to initialize
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check auth state
      const user = auth.currentUser;
      const cachedUserId = await AsyncStorage.getItem('userId');

      console.log('Firebase user:', user?.email);
      console.log('Cached userId:', cachedUserId);

      if (user && cachedUserId) {
        console.log('✅ User authenticated, going to Home');
        setInitialRouteName('Home');
      } else {
        console.log('❌ No user, going to Login');
        setInitialRouteName('Login');
      }

      // Setup auth listener
      setupAuthListener();

      setIsReady(true);
    } catch (error) {
      console.error('❌ Initialization error:', error);
      setInitialRouteName('Login');
      setIsReady(true);
    }
  };

  const setupAuthListener = () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Auth changed: User logged in -', user.email);
        await AsyncStorage.setItem('userId', user.uid);
        await AsyncStorage.setItem('userEmail', user.email || '');
      } else {
        console.log('Auth changed: User logged out');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('userEmail');
        await AsyncStorage.removeItem('currentUser');
      }
    });

    return unsubscribe;
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
        <Text style={styles.logo}>🚨</Text>
        <Text style={styles.appName}>Zero Trap</Text>
        <Text style={styles.tagline}>Emergency Help Network</Text>
        <ActivityIndicator size="large" color="#FF3B30" style={styles.loader} />
        <Text style={styles.loadingText}>Starting app...</Text>
      </View>
    );
  }

  console.log('📱 Rendering app with initial route:', initialRouteName);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#FF3B30" barStyle="light-content" />
      <AppNavigator initialRoute={initialRouteName} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 100,
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    marginTop: 15,
  },
});