// screens/ProfileScreen.js
// FIXED - Refreshes email verification status

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getCurrentUserId, getCurrentUser } from '../services/firebaseAuthService';
import { getUserProfile } from '../services/firestoreService';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userId = getCurrentUserId();
      const firebaseUser = getCurrentUser();

      if (!userId || !firebaseUser) {
        navigation.replace('Login');
        return;
      }

      // Reload user to get fresh verification status
      await firebaseUser.reload();
      const freshUser = auth.currentUser;
      
      setEmailVerified(freshUser?.emailVerified || false);

      const result = await getUserProfile(userId);

      if (result.success) {
        setUserData(result.data);
      }
    } catch (error) {
      console.error('Load profile error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
  };

  const handleResendVerification = async () => {
    setSendingVerification(true);

    try {
      const user = getCurrentUser();

      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      // Reload to check current status
      await user.reload();
      const freshUser = auth.currentUser;

      if (freshUser.emailVerified) {
        setEmailVerified(true);
        Alert.alert('Already Verified', 'আপনার email already verified!');
        return;
      }

      await sendEmailVerification(user);

      Alert.alert(
        'Verification Email Sent',
        'আপনার email এ verification link পাঠানো হয়েছে। Link এ click করার পর এই page refresh করুন।'
      );
    } catch (error) {
      console.error('Resend verification error:', error);

      let errorMessage = 'Failed to send verification email';

      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a few minutes.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setSendingVerification(false);
    }
  };

  const handleCheckVerification = async () => {
    setRefreshing(true);

    try {
      const user = getCurrentUser();
      
      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      // Force reload from Firebase
      await user.reload();
      const freshUser = auth.currentUser;

      setEmailVerified(freshUser.emailVerified);

      if (freshUser.emailVerified) {
        Alert.alert(
          '✅ Verified!',
          'আপনার email successfully verified হয়েছে!'
        );
      } else {
        Alert.alert(
          '⚠️ Not Verified',
          'এখনো verify হয়নি। Email check করে link এ click করুন।'
        );
      }
    } catch (error) {
      console.error('Check verification error:', error);
      Alert.alert('Error', 'Failed to check verification status');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Profile Image */}
        <View style={styles.imageSection}>
          {userData?.profileImage ? (
            <Image
              source={{ uri: userData.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>
                {userData?.name ? userData.name[0].toUpperCase() : '?'}
              </Text>
            </View>
          )}
          {userData?.isOnline && <View style={styles.onlineDot} />}
        </View>

        {/* Name & Username */}
        <Text style={styles.name}>{userData?.name || 'Unknown'}</Text>
        <Text style={styles.username}>@{userData?.username || 'username'}</Text>

        {/* Email Verification Status */}
        {!emailVerified && (
          <View style={styles.verificationCard}>
            <Text style={styles.verificationTitle}>⚠️ Email Not Verified</Text>
            <Text style={styles.verificationText}>
              আপনার email verify করা হয়নি। Verification link email এ পাঠানো হয়েছে।
            </Text>

            <View style={styles.verificationButtons}>
              <TouchableOpacity
                style={styles.checkButton}
                onPress={handleCheckVerification}
                disabled={refreshing}
              >
                <Text style={styles.checkButtonText}>
                  {refreshing ? 'Checking...' : '🔄 Check Status'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendVerification}
                disabled={sendingVerification}
              >
                {sendingVerification ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.resendButtonText}>📧 Resend Email</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {emailVerified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✅ Email Verified</Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData?.helpingScore || 0}</Text>
            <Text style={styles.statLabel}>Helping Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData?.totalHelped || 0}</Text>
            <Text style={styles.statLabel}>People Helped</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>📧 Email</Text>
            <Text style={styles.infoValue}>{userData?.email || 'N/A'}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>📞 Phone Number</Text>
            <Text style={styles.infoValue}>
              {userData?.phoneNumber ? `+880${userData.phoneNumber}` : 'Not provided'}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>⚧ Gender</Text>
            <Text style={styles.infoValue}>{userData?.gender || 'Not specified'}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>📅 Member Since</Text>
            <Text style={styles.infoValue}>
              {userData?.registeredAt
                ? new Date(userData.registeredAt).toLocaleDateString()
                : 'Unknown'}
            </Text>
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyTitle}>🔒 Privacy Notice</Text>
          <Text style={styles.privacyText}>
            Your name, username, and phone number are public and visible to all authenticated users for emergency help coordination.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: { marginTop: 15, fontSize: 16, color: '#666' },
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
  editButton: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  content: { padding: 20, paddingBottom: 40 },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FF3B30',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FF3B30',
  },
  imagePlaceholderText: { fontSize: 48, color: '#999', fontWeight: 'bold' },
  onlineDot: {
    position: 'absolute',
    bottom: 5,
    right: '35%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34C759',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  verificationCard: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  verificationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  verificationText: {
    fontSize: 13,
    color: '#856404',
    marginBottom: 12,
    lineHeight: 18,
  },
  verificationButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  checkButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  resendButton: {
    flex: 1,
    backgroundColor: '#FF9500',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  resendButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  verifiedBadge: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifiedText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 5,
  },
  statLabel: { fontSize: 13, color: '#666' },
  infoSection: { marginBottom: 20 },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  infoValue: { fontSize: 16, color: '#000' },
  privacyNotice: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  privacyText: {
    fontSize: 12,
    color: '#1976D2',
    lineHeight: 18,
  },
});

export default ProfileScreen;