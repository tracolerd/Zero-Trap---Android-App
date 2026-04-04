// screens/SplashScreen.js
// Fixed - Checks AsyncStorage for logged in user

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../services/firebaseAuthService';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Wait a bit for Firebase to initialize
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user is logged in (userId matches App.js; currentUser may load later on Home)
      const firebaseUser = getCurrentUser();
      const cachedUserId = await AsyncStorage.getItem('userId');

      if (firebaseUser && cachedUserId) {
        // User is logged in
        console.log('User found, navigating to Home');
        navigation.replace('Home');
      } else {
        // User not logged in
        console.log('No user found, navigating to Login');
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // On error, go to login
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🚨</Text>
      <Text style={styles.appName}>Zero Trap</Text>
      <Text style={styles.tagline}>Emergency Help Network</Text>
      
      <ActivityIndicator 
        size="large" 
        color="#FF3B30" 
        style={styles.loader}
      />
      
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { fontSize: 100, marginBottom: 20 },
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
  loader: { marginTop: 20 },
  loadingText: {
    fontSize: 14,
    color: '#999',
    marginTop: 15,
  },
});

export default SplashScreen;