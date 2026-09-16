// screens/SettingsScreen.js
// FIXED - Proper account deletion

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';
import { deleteAccount, getCurrentUserId } from '../services/firebaseAuthService';

const SettingsScreen = ({ navigation }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Delete Account',
      'আপনার account permanently delete হবে। এটা undo করা যাবে না!\n\n- সব data মুছে যাবে\n- Username available হবে\n- Chat history মুছে যাবে\n\nContinue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: confirmDeleteAccount
        }
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    setDeleting(true);

    try {
      const userId = getCurrentUserId();
      const user = auth.currentUser;

      if (!user || !userId) {
        Alert.alert('Error', 'User not found');
        setDeleting(false);
        return;
      }

      const result = await deleteAccount();
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete account');
      }

      // 5. Navigate to login
      Alert.alert(
        'Account Deleted',
        'আপনার account successfully delete হয়েছে।',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login')
          }
        ]
      );
    } catch (error) {
      console.error('Delete account error:', error);
      
      let errorMessage = 'Failed to delete account';
      
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please logout and login again, then try deleting.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.menuIcon}>✏️</Text>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.menuIcon}>👤</Text>
            <Text style={styles.menuText}>View Profile</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Legal</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Text style={styles.menuIcon}>🔒</Text>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('TermsConditions')}
          >
            <Text style={styles.menuIcon}>📄</Text>
            <Text style={styles.menuText}>Terms & Conditions</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('DeveloperInfo')}
          >
            <Text style={styles.menuIcon}>👨‍💻</Text>
            <Text style={styles.menuText}>Developer Info</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>📱</Text>
            <Text style={styles.menuText}>Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>⚠️ Danger Zone</Text>

          <TouchableOpacity
            style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
            onPress={handleDeleteAccount}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.deleteIcon}>🗑️</Text>
                <Text style={styles.deleteButtonText}>Delete Account</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.dangerWarning}>
            ⚠️ This action cannot be undone. All your data will be permanently deleted.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: { fontSize: 16, color: '#FF3B30', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  content: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
  },
  menuIcon: { fontSize: 24, marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, color: '#000', fontWeight: '500' },
  menuArrow: { fontSize: 18, color: '#999' },
  versionText: { fontSize: 14, color: '#999' },
  dangerSection: {
    backgroundColor: '#FFEBEE',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF3B30',
    marginTop: 20,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  deleteButtonDisabled: { backgroundColor: '#FFB3AE' },
  deleteIcon: { fontSize: 20, marginRight: 10 },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dangerWarning: {
    fontSize: 12,
    color: '#C62828',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default SettingsScreen;