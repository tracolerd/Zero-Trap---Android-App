import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendPasswordReset, validateGmail } from '../services/firebaseAuthService';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Gmail address দিন');
      return;
    }

    if (!validateGmail(email.trim())) {
      Alert.alert('Error', 'Valid Gmail address দিন (@gmail.com)');
      return;
    }

    setLoading(true);

    const result = await sendPasswordReset(email.trim().toLowerCase());

    setLoading(false);

    if (result.success) {
      Alert.alert(
        '✅ সফল!',
        result.message,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.icon}>🔒</Text>
        <Text style={styles.title}>Password ভুলে গেছেন?</Text>
        <Text style={styles.subtitle}>
          কোনো সমস্যা নেই! আপনার Gmail address দিন।{'\n'}
          Password reset link পাঠানো হবে।
        </Text>

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

        <TouchableOpacity
          style={[styles.resetButton, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.resetButtonText}>Reset Link পাঠান</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backToLogin}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backToLoginText}>← Login এ ফিরে যান</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: { fontSize: 16, color: '#FF3B30', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  content: { flex: 1, padding: 30, justifyContent: 'center' },
  icon: { fontSize: 80, textAlign: 'center', marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  inputWrapper: { marginBottom: 25 },
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
  resetButton: {
    backgroundColor: '#FF3B30',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  buttonDisabled: { backgroundColor: '#FFB3AE', elevation: 0 },
  resetButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  backToLogin: { alignItems: 'center', paddingVertical: 15 },
  backToLoginText: { fontSize: 15, color: '#FF3B30', fontWeight: '600' },
});

export default ForgotPasswordScreen;