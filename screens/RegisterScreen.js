import React, { useState } from 'react';
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
import { registerWithEmail, validateGmail } from '../services/firebaseAuthService';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (pass) => {
    if (pass.length < 6) return { strength: 'weak', color: '#FF3B30', text: 'দুর্বল' };
    if (pass.length < 8) return { strength: 'medium', color: '#FF9500', text: 'মাঝারি' };
    return { strength: 'strong', color: '#34C759', text: 'শক্তিশালী' };
  };

  const handleRegister = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('Error', 'Gmail address দিন');
      return;
    }

    if (!validateGmail(email.trim())) {
      Alert.alert('Error', 'শুধুমাত্র Gmail address দিয়ে register করতে পারবেন (@gmail.com)');
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert('Error', 'Password কমপক্ষে 6 character হতে হবে');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password match করছে না');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Error', 'আপনার নাম দিন');
      return;
    }

    if (!gender) {
      Alert.alert('Error', 'Gender select করুন');
      return;
    }

    setLoading(true);

    const result = await registerWithEmail(
      email.trim().toLowerCase(),
      password,
      name.trim(),
      gender
    );

    setLoading(false);

    if (result.success) {
      Alert.alert(
        '🎉 সফল!',
        result.message,
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Home')
          }
        ]
      );
    } else {
      Alert.alert('Registration Error', result.error);
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
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Register</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.logoSection}>
            <Text style={styles.logo}>🚨</Text>
            <Text style={styles.appName}>Zero Trap</Text>
            <Text style={styles.tagline}>নতুন Account তৈরি করুন</Text>
          </View>

          <View style={styles.formSection}>
            {/* Gmail Input */}
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
              <Text style={styles.helperText}>
                শুধুমাত্র Gmail (@gmail.com) address use করুন
              </Text>
            </View>

            {/* Name Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>👤 আপনার নাম</Text>
              <TextInput
                style={styles.input}
                placeholder="পুরো নাম লিখুন"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Gender Selection */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>⚧ Gender</Text>
              <View style={styles.genderContainer}>
                {['Male', 'Female', 'Other'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderButton, gender === g && styles.genderButtonActive]}
                    onPress={() => setGender(g)}
                  >
                    <Text style={[styles.genderButtonText, gender === g && styles.genderButtonTextActive]}>
                      {g === 'Male' ? '👨 Male' : g === 'Female' ? '👩 Female' : '⚧ Other'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>🔒 Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password দিন (minimum 6 characters)"
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
              {password.length > 0 && (
                <View style={[styles.strengthBar, { backgroundColor: getPasswordStrength(password).color }]}>
                  <Text style={styles.strengthText}>{getPasswordStrength(password).text}</Text>
                </View>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>🔒 Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password আবার দিন"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text style={styles.eyeIcon}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {confirmPassword.length > 0 && (
                <Text style={[styles.matchText, { color: password === confirmPassword ? '#34C759' : '#FF3B30' }]}>
                  {password === confirmPassword ? '✓ Password match হয়েছে' : '✗ Password match করছে না'}
                </Text>
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Register করুন</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginLinkText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login করুন</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>Register করে আপনি আমাদের </Text>
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
  scrollContent: { flexGrow: 1, padding: 25 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: { fontSize: 16, color: '#FF3B30', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  logoSection: { alignItems: 'center', paddingVertical: 20, marginBottom: 20 },
  logo: { fontSize: 60, marginBottom: 10 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#FF3B30', marginBottom: 5 },
  tagline: { fontSize: 14, color: '#666' },
  formSection: { marginBottom: 20 },
  inputWrapper: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    color: '#000',
  },
  helperText: { fontSize: 12, color: '#999', marginTop: 5, fontStyle: 'italic' },
  passwordContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
  },
  passwordInput: { flex: 1, padding: 15, fontSize: 16, color: '#000' },
  eyeButton: { paddingHorizontal: 15 },
  eyeIcon: { fontSize: 20 },
  strengthBar: {
    marginTop: 8,
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  strengthText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  matchText: { fontSize: 12, marginTop: 5, fontWeight: '600' },
  genderContainer: { flexDirection: 'row', gap: 10 },
  genderButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
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
    elevation: 5,
  },
  buttonDisabled: { backgroundColor: '#FFB3AE', elevation: 0 },
  registerButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginLinkText: { fontSize: 14, color: '#666' },
  loginLink: { fontSize: 14, color: '#FF3B30', fontWeight: 'bold' },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  termsText: { fontSize: 12, color: '#999' },
  termsLink: { fontSize: 12, color: '#FF3B30', fontWeight: 'bold' },
});

export default RegisterScreen;