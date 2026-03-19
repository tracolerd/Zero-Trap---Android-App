// screens/LoginScreen.js
// COMPLETE WORKING VERSION

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmail } from '../services/firebaseAuthService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log('🔵 Login button pressed');

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    console.log('Email:', email);
    setLoading(true);

    try {
      console.log('🔄 Calling signInWithEmail...');

      const result = await signInWithEmail(email.trim(), password);

      console.log('Login result:', result);

      setLoading(false);

      if (result.success) {
        console.log('✅ Login successful!');
        // Navigation will be handled by App.js auth listener
        navigation.replace('Home');
      } else {
        console.log('❌ Login failed:', result.error);

        Alert.alert(
          'Login Failed',
          result.error || 'Invalid email or password'
        );
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setLoading(false);

      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🚨</Text>
            <Text style={styles.appName}>Zero Trap</Text>
            <Text style={styles.tagline}>Emergency Help Network</Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to your account</Text>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>📧 Email</Text>
              <TextInput
                style={styles.input}
                placeholder="yourname@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>🔒 Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => !loading && navigation.navigate('ForgotPassword')}
              disabled={loading}
            >
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#FFFFFF" />
                  <Text style={styles.loginButtonText}>  Logging in...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>🔐 Login করুন</Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => !loading && navigation.navigate('Register')}
                disabled={loading}
              >
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { flex: 1, justifyContent: 'center' },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: { fontSize: 80, marginBottom: 15 },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 5,
  },
  tagline: { fontSize: 14, color: '#666' },
  form: { paddingHorizontal: 30 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  inputWrapper: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#000',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'right',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#FF3B30',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: { backgroundColor: '#FFB3AE', elevation: 0 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center' },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: { fontSize: 14, color: '#666' },
  registerLink: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
});

export default LoginScreen;