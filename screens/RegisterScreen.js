// screens/RegisterScreen.js
// COMPLETE WORKING VERSION

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerWithEmail, signOut } from '../services/firebaseAuthService';
import { checkUsernameAvailability } from '../services/firestoreService';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(''); // 'available', 'taken', 'invalid', ''

  // Debounce username check
  useEffect(() => {
    if (username.length < 3) {
      setUsernameStatus('');
      return;
    }

    const timeoutId = setTimeout(() => {
      checkUsername();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  const checkUsername = async () => {
    const cleanUsername = username.toLowerCase().trim();

    // Validate format
    const usernameRegex = /^[a-z0-9_.]{3,20}$/;
    if (!usernameRegex.test(cleanUsername)) {
      setUsernameStatus('invalid');
      return;
    }

    setCheckingUsername(true);

    try {
      const result = await checkUsernameAvailability(cleanUsername);

      if (result.success) {
        setUsernameStatus(result.available ? 'available' : 'taken');
      } else {
        setUsernameStatus('');
      }
    } catch (error) {
      console.error('Username check error:', error);
      setUsernameStatus('');
    } finally {
      setCheckingUsername(false);
    }
  };

  const validateInputs = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      Alert.alert('Error', 'Only Gmail accounts are allowed');
      return false;
    }

    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return false;
    }

    if (usernameStatus !== 'available') {
      Alert.alert('Error', 'Please choose a valid and available username');
      return false;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!gender) {
      Alert.alert('Error', 'Please select your gender');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    console.log('🔵 Register button pressed');

    if (!validateInputs()) {
      console.log('❌ Validation failed');
      return;
    }

    console.log('✅ Validation passed');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Username:', username);
    console.log('Gender:', gender);

    setLoading(true);

    try {
      console.log('🔄 Calling registerWithEmail...');

      const result = await registerWithEmail(
        email.trim(),
        password,
        name.trim(),
        username.toLowerCase().trim(),
        gender
      );

      console.log('Registration result:', result);

      setLoading(false);

      if (result.success) {
        console.log('✅ Registration successful!');
        // createUserWithEmailAndPassword leaves an active session; sign out so "verify then login" is real
        await signOut();

        Alert.alert(
          'Success! 🎉',
          'Account created successfully! A verification email has been sent to your email address. Please verify your email and then login.',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('Login')
            }
          ]
        );
      } else {
        console.log('❌ Registration failed:', result.error);

        Alert.alert(
          'Registration Failed',
          result.error || 'Something went wrong. Please try again.'
        );
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🚨</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Zero Trap Community</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>👤 Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>📧 Email (Gmail only)</Text>
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

            {/* Username */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>✨ Username</Text>
              <View style={styles.usernameContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="choose_username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  editable={!loading}
                />
                {checkingUsername && (
                  <ActivityIndicator size="small" color="#007AFF" style={styles.usernameIcon} />
                )}
                {!checkingUsername && usernameStatus === 'available' && (
                  <Text style={styles.usernameIconAvailable}>✓</Text>
                )}
                {!checkingUsername && usernameStatus === 'taken' && (
                  <Text style={styles.usernameIconTaken}>✗</Text>
                )}
              </View>
              
              {usernameStatus === 'available' && (
                <Text style={styles.usernameHelp}>✓ Username available!</Text>
              )}
              {usernameStatus === 'taken' && (
                <Text style={styles.usernameError}>✗ Username already taken</Text>
              )}
              {usernameStatus === 'invalid' && (
                <Text style={styles.usernameError}>✗ Only lowercase letters, numbers, _ and .</Text>
              )}
              {!usernameStatus && username.length > 0 && username.length < 3 && (
                <Text style={styles.usernameHelp}>Minimum 3 characters</Text>
              )}
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>🔒 Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Minimum 6 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>🔒 Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Gender */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>⚧ Gender</Text>
              <View style={styles.genderContainer}>
                {['Male', 'Female', 'Other'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderButton,
                      gender === g && styles.genderButtonActive
                    ]}
                    onPress={() => !loading && setGender(g)}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === g && styles.genderButtonTextActive
                      ]}
                    >
                      {g === 'Male' ? '👨' : g === 'Female' ? '👩' : '⚧'} {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#FFFFFF" />
                  <Text style={styles.registerButtonText}>  Creating account...</Text>
                </View>
              ) : (
                <Text style={styles.registerButtonText}>📝 Register করুন</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => !loading && navigation.navigate('Login')}
                disabled={loading}
              >
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { paddingBottom: 40 },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
  },
  logo: { fontSize: 60, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666' },
  form: { padding: 20 },
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
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameIcon: { position: 'absolute', right: 15 },
  usernameIconAvailable: {
    position: 'absolute',
    right: 15,
    fontSize: 24,
    color: '#34C759',
    fontWeight: 'bold',
  },
  usernameIconTaken: {
    position: 'absolute',
    right: 15,
    fontSize: 24,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  usernameHelp: { fontSize: 12, color: '#34C759', marginTop: 5 },
  usernameError: { fontSize: 12, color: '#FF3B30', marginTop: 5 },
  genderContainer: { flexDirection: 'row', gap: 10 },
  genderButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  genderButtonActive: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  genderButtonText: { fontSize: 14, color: '#666', fontWeight: '600' },
  genderButtonTextActive: { color: '#FFFFFF' },
  registerButton: {
    backgroundColor: '#FF3B30',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonDisabled: { backgroundColor: '#FFB3AE', elevation: 0 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center' },
  registerButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: { fontSize: 14, color: '#666' },
  loginLink: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
});

export default RegisterScreen;