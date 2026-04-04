// App.js
// FINAL - Fixed navigation and white screen

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState('Login');
  const initialAuthResolved = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (cancelled) return;

      try {
        if (user) {
          await AsyncStorage.setItem('userId', user.uid);
          await AsyncStorage.setItem('userEmail', user.email || '');
        } else {
          await AsyncStorage.removeItem('userId');
          await AsyncStorage.removeItem('userEmail');
          await AsyncStorage.removeItem('currentUser');
        }
      } catch (e) {
        console.error('Auth storage sync error:', e);
      }

      if (cancelled) return;

      if (!initialAuthResolved.current) {
        initialAuthResolved.current = true;
        setInitialRouteName(user ? 'Home' : 'Login');
        setIsReady(true);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

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
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#FF3B30" barStyle="light-content" />
        <AppNavigator initialRoute={initialRouteName} />
      </NavigationContainer>
    </SafeAreaProvider>
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