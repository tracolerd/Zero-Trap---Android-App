import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginWithEmail, checkEmailVerification } from '../services/firebaseAuthService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Gmail address দিন');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Password দিন');
      return;
    }

    setLoading(true);

    const result = await loginWithEmail(email.trim().toLowerCase(), password);

    setLoading(false);

    if (result.success) {
      // Check email verification
      if (!result.emailVerified) {
        Alert.alert(
          '⚠️ Email Not Verified',
          'আপনার email verify করা নেই।\n\nEmail inbox check করে verification link এ click করুন।',
          [
            { text: 'OK' }
          ]
        );
        // Still allow login, but show warning
      }

      navigation.replace('Home');
    } else {
      Alert.alert('Login Error', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoSection}>
            <Text style={styles.logo}>🚨</Text>
            <Text style={styles.appName}>Zero Trap</Text>
            <Text style={styles.tagline}>Emergency Help Network</Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>📧 Gmail Address</Text>
              <TextInput
                style={styles.input}
                placeholder="your@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>🔒 Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password দিন"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Password ভুলে গেছেন?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>নতুন user?</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerButtonText}>নতুন Account তৈরি করুন</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>Login করে আপনি আমাদের </Text>
            <TouchableOpacity onPress={() => navigation.navigate('TermsConditions')}>
              <Text style={styles.termsLink}>Terms</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}> ও </Text>
            <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}> মেনে নিচ্ছেন</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { flexGrow: 1, padding: 25, justifyContent: 'center' },
  logoSection: { alignItems: 'center', paddingVertical: 40 },
  logo: { fontSize: 80, marginBottom: 15 },
  appName: { fontSize: 36, fontWeight: 'bold', color: '#FF3B30', marginBottom: 8 },
  tagline: { fontSize: 15, color: '#666' },
  formSection: { marginBottom: 20 },
  inputWrapper: { marginBottom: 18 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
  },
  passwordInput: { flex: 1, padding: 16, fontSize: 16, color: '#000' },
  eyeButton: { paddingHorizontal: 15 },
  eyeIcon: { fontSize: 22 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20, marginTop: 5 },
  forgotPasswordText: { fontSize: 14, color: '#FF3B30', fontWeight: '600' },
  loginButton: {
    backgroundColor: '#FF3B30',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  buttonDisabled: { backgroundColor: '#FFB3AE', elevation: 0 },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: { flex: 1, height: 1, backgroundColor: '#E5E5EA' },
  dividerText: { marginHorizontal: 15, fontSize: 14, color: '#999' },
  registerButton: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  registerButtonText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold' },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  termsText: { fontSize: 12, color: '#999' },
  termsLink: { fontSize: 12, color: '#FF3B30', fontWeight: 'bold' },
});

export default LoginScreen;