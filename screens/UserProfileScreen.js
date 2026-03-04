// screens/UserProfileScreen.js
// View Other User's Profile (Public Info Only)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserProfile, reportUser, blockUser } from '../services/firestoreService';
import { getCurrentUserId } from '../services/firebaseAuthService';

const UserProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = getCurrentUserId();
  const isOwnProfile = userId === currentUserId;

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    const result = await getUserProfile(userId);
    
    if (result.success) {
      setUserData(result.data);
    } else {
      Alert.alert('Error', 'Failed to load profile');
    }
    
    setLoading(false);
  };

  const handleCall = () => {
    if (!userData.phoneNumber) {
      Alert.alert('No Phone Number', 'This user has not added a phone number yet.');
      return;
    }

    const phoneNumber = userData.phoneNumber.startsWith('+880') 
      ? userData.phoneNumber 
      : `+880${userData.phoneNumber}`;

    Alert.alert(
      'Call User',
      `Call ${userData.name} at ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${phoneNumber}`)
        }
      ]
    );
  };

  const handleReport = () => {
    Alert.alert(
      'Report User',
      'Why are you reporting this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Inappropriate Behavior',
          onPress: () => submitReport('Inappropriate Behavior')
        },
        {
          text: 'Spam',
          onPress: () => submitReport('Spam')
        },
        {
          text: 'Harassment',
          onPress: () => submitReport('Harassment')
        },
        {
          text: 'Other',
          onPress: () => submitReport('Other')
        }
      ]
    );
  };

  const submitReport = async (reason) => {
    const result = await reportUser(currentUserId, userId, reason);
    
    if (result.success) {
      Alert.alert('Success', 'Report submitted। Admin review করবে।');
    } else {
      Alert.alert('Error', 'Failed to submit report');
    }
  };

  const handleBlock = () => {
    Alert.alert(
      'Block User',
      `Block ${userData.name}? আপনি এই user এর কোনো request দেখবেন না।`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: async () => {
            const result = await blockUser(currentUserId, userId);
            
            if (result.success) {
              Alert.alert(
                'Blocked',
                'User blocked successfully',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                  }
                ]
              );
            } else {
              Alert.alert('Error', 'Failed to block user');
            }
          }
        }
      ]
    );
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
        <Text style={styles.errorText}>❌ User not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.headerBackButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User Profile</Text>
          {!isOwnProfile && (
            <TouchableOpacity onPress={handleReport}>
              <Text style={styles.reportButton}>⚠️</Text>
            </TouchableOpacity>
          )}
          {isOwnProfile && <View style={{ width: 30 }} />}
        </View>

        {/* Profile Picture */}
        <View style={styles.profileSection}>
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
          
          {userData.isOnline && (
            <View style={styles.onlineIndicator} />
          )}
        </View>

        {/* User Info */}
        <View style={styles.userInfoSection}>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userUsername}>@{userData.username}</Text>
          
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

        {/* Contact Info (PUBLIC) */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>📞 Contact Information</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            {userData.phoneNumber ? (
              <>
                <Text style={styles.infoValue}>
                  +880{userData.phoneNumber}
                </Text>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={handleCall}
                >
                  <Text style={styles.callButtonText}>📞 Call Now</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.infoValueEmpty}>Not provided</Text>
            )}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>
              {userData.gender === 'Male' ? '👨 Male' : 
               userData.gender === 'Female' ? '👩 Female' : 
               '⚧ Other'}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {new Date(userData.registeredAt).toLocaleDateString('en-GB')}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Online Status</Text>
            <Text style={[styles.infoValue, { color: userData.isOnline ? '#34C759' : '#999' }]}>
              {userData.isOnline ? '🟢 Online' : '🔴 Offline'}
            </Text>
          </View>
        </View>

        {/* Actions (Only for other users) */}
        {!isOwnProfile && (
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.reportActionButton}
              onPress={handleReport}
            >
              <Text style={styles.reportActionButtonText}>⚠️ Report User</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.blockActionButton}
              onPress={handleBlock}
            >
              <Text style={styles.blockActionButtonText}>🚫 Block User</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyTitle}>🔒 Privacy Notice</Text>
          <Text style={styles.privacyText}>
            {isOwnProfile 
              ? 'আপনার profile information সব users দেখতে পারবে emergency help এর জন্য।'
              : 'This is public information shared for emergency help purposes. যদি অপব্যবহার হয় তাহলে report/block করুন।'
            }
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
  backButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerBackButton: { fontSize: 16, color: '#FF3B30', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  reportButton: { fontSize: 24 },
  profileSection: {
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
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  profilePicturePlaceholderText: {
    fontSize: 48,
    color: '#999',
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
  userInfoSection: { alignItems: 'center', marginBottom: 20 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  userUsername: { fontSize: 14, color: '#666', marginBottom: 10 },
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
  infoValueEmpty: { fontSize: 16, color: '#999', fontStyle: 'italic' },
  callButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  callButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  actionsSection: { paddingHorizontal: 20, marginBottom: 20 },
  reportActionButton: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  reportActionButtonText: { color: '#856404', fontSize: 16, fontWeight: 'bold' },
  blockActionButton: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  blockActionButtonText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold' },
  privacyNotice: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  privacyTitle: { fontSize: 14, fontWeight: 'bold', color: '#1976D2', marginBottom: 5 },
  privacyText: { fontSize: 12, color: '#666', lineHeight: 18 },
});

export default UserProfileScreen;