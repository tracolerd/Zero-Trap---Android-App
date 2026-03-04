// screens/ProfileScreen.js
// Cloud-Synced Profile Screen with Real-time Updates

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser } from '../services/firebaseAuthService';
import {
  getUserProfile,
  subscribeToUserPresence
} from '../services/firestoreService';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserProfile();

    // Subscribe to real-time updates
    const user = getCurrentUser();
    if (user) {
      const unsubscribe = subscribeToUserPresence(user.uid, (result) => {
        if (result.success) {
          setUserData(prev => ({ ...prev, ...result.data }));
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const loadUserProfile = async () => {
    const user = getCurrentUser();
    
    if (!user) {
      navigation.replace('Login');
      return;
    }

    const result = await getUserProfile(user.uid);
    
    if (result.success) {
      setUserData(result.data);
    } else {
      Alert.alert('Error', 'Failed to load profile');
    }
    
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserProfile();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ Profile not found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadUserProfile}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          {userData.profileImage ? (
            <Image
              source={{ uri: userData.profileImage }}
              style={styles.profilePicture}
            />
          ) : (
            <View style={styles.profilePicturePlaceholder}>
              <Text style={styles.profilePicturePlaceholderText}>
                {userData.name ? userData.name[0].toUpperCase() : '?'}
              </Text>
            </View>
          )}
          
          {/* Online Status Indicator */}
          {userData.isOnline && (
            <View style={styles.onlineIndicator} />
          )}

          <TouchableOpacity
            style={styles.editProfilePicButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          
          {/* Email Verification Badge */}
          {userData.emailVerified ? (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          ) : (
            <View style={styles.unverifiedBadge}>
              <Text style={styles.unverifiedText}>⚠ Not Verified</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData.helpingScore || 0}</Text>
            <Text style={styles.statLabel}>Helping Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData.totalHelped || 0}</Text>
            <Text style={styles.statLabel}>People Helped</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>📞 Contact Information</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={styles.infoValue}>
              {userData.phoneNumber || 'Not added yet'}
            </Text>
            {!userData.phoneNumber && (
              <Text style={styles.infoHint}>
                ⚠️ Phone number জরুরি সাহায্যের জন্য গুরুত্বপূর্ণ
              </Text>
            )}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{userData.gender || 'Not set'}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {userData.registeredAt 
                ? new Date(userData.registeredAt).toLocaleDateString('en-GB')
                : 'N/A'
              }
            </Text>
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyTitle}>🔒 Privacy Note</Text>
          <Text style={styles.privacyText}>
            আপনার phone number emergency situations এ অন্য users দেখতে পারবে। 
            যদি কেউ অপব্যবহার করে, আপনি তাকে report/block করতে পারবেন।
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.helpHistoryButton}
          onPress={() => navigation.navigate('HelpHistory')}
        >
          <Text style={styles.helpHistoryButtonText}>📊 Help History</Text>
        </TouchableOpacity>

        {/* Cloud Sync Status */}
        <View style={styles.syncStatus}>
          <Text style={styles.syncText}>
            ☁️ Synced with Cloud
          </Text>
          <Text style={styles.syncSubtext}>
            Last updated: {new Date().toLocaleTimeString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { paddingBottom: 30 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: { marginTop: 10, fontSize: 14, color: '#666' },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorText: { fontSize: 18, color: '#FF3B30', marginBottom: 20 },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
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
  settingsIcon: { fontSize: 24 },
  profilePictureContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FF3B30',
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  profilePicturePlaceholderText: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  onlineIndicator: {
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
  editProfilePicButton: {
    position: 'absolute',
    bottom: 0,
    right: '32%',
    backgroundColor: '#FFFFFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editIcon: { fontSize: 18 },
  userInfoContainer: { alignItems: 'center', marginBottom: 20 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  userEmail: { fontSize: 14, color: '#666', marginBottom: 10 },
  verifiedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedText: { fontSize: 12, color: '#4CAF50', fontWeight: 'bold' },
  unverifiedBadge: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  unverifiedText: { fontSize: 12, color: '#FFC107', fontWeight: 'bold' },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#FF3B30', marginBottom: 5 },
  statLabel: { fontSize: 12, color: '#666' },
  infoSection: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 15 },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoLabel: { fontSize: 12, color: '#999', marginBottom: 5 },
  infoValue: { fontSize: 16, color: '#000', fontWeight: '500' },
  infoHint: { fontSize: 11, color: '#FF9500', marginTop: 5, fontStyle: 'italic' },
  privacyNotice: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  privacyTitle: { fontSize: 14, fontWeight: 'bold', color: '#1976D2', marginBottom: 5 },
  privacyText: { fontSize: 12, color: '#666', lineHeight: 18 },
  editButton: {
    backgroundColor: '#FF3B30',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  editButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  helpHistoryButton: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  helpHistoryButtonText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold' },
  syncStatus: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  syncText: { fontSize: 12, color: '#4CAF50', fontWeight: '600' },
  syncSubtext: { fontSize: 10, color: '#999', marginTop: 3 },
});

export default ProfileScreen;