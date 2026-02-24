import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getUserData, clearUserData, updateUserData } from '../services/storageService';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    setLoading(true);
    const data = await getUserData();
    if (data) {
      setUserData(data);
    } else {
      Alert.alert('Error', 'Please login first', [
        { text: 'OK', onPress: () => navigation.replace('Login') }
      ]);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'আপনি কি নিশ্চিত logout করতে চান?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await updateUserData({ isLoggedIn: false });
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3B30" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) return null;

  const getRegisterMethodIcon = () => {
    return userData.registerMethod === 'gmail' ? '📧' : '📱';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { userData })}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => navigation.navigate('EditProfile', { userData })}
          >
            {userData.profileImage ? (
              <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>
                  {userData.name ? userData.name[0].toUpperCase() : '👤'}
                </Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>✏️</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.profileName}>{userData.name}</Text>

          <View style={styles.identifierRow}>
            <Text style={styles.identifierIcon}>{getRegisterMethodIcon()}</Text>
            <Text style={styles.profileIdentifier}>
              {userData.registerMethod === 'gmail'
                ? userData.email
                : userData.phoneNumber}
            </Text>
          </View>

          <View style={styles.genderBadge}>
            <Text style={styles.genderBadgeText}>
              {userData.gender === 'Male' ? '👨 Male'
                : userData.gender === 'Female' ? '👩 Female'
                : '🧑 Other'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardHighlight]}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statNumber}>{userData.helpingScore || 0}</Text>
            <Text style={styles.statLabel}>Helping Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🤝</Text>
            <Text style={styles.statNumber}>{userData.totalHelped || 0}</Text>
            <Text style={styles.statLabel}>Times Helped</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={styles.statNumberSmall}>
              {userData.lastHelped
                ? new Date(userData.lastHelped).toLocaleDateString('bn-BD')
                : 'কখনো না'}
            </Text>
            <Text style={styles.statLabel}>Last Helped</Text>
          </View>
        </View>

        {/* Personal Info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>👤 Name</Text>
            <Text style={styles.infoValue}>{userData.name}</Text>
          </View>

          {userData.email ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📧 Email</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
          ) : null}

          {userData.phoneNumber ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📱 Phone</Text>
              <Text style={styles.infoValue}>{userData.phoneNumber}</Text>
            </View>
          ) : null}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>⚧ Gender</Text>
            <Text style={styles.infoValue}>{userData.gender}</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>📆 Joined</Text>
            <Text style={styles.infoValue}>
              {userData.registeredAt
                ? new Date(userData.registeredAt).toLocaleDateString('en-BD')
                : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditProfile', { userData })}
          >
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={styles.actionText}>Edit Profile</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('HelpHistory')}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>Help History</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Settings</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('DeveloperInfo')}
          >
            <Text style={styles.actionIcon}>👨‍💻</Text>
            <Text style={styles.actionText}>Developer Info</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.actionIcon}>🚪</Text>
            <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Zero Trap v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 14, color: '#666' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: { fontSize: 16, color: '#FF3B30', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  editButton: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: { position: 'relative', marginBottom: 15 },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#FF3B30',
  },
  imagePlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FF3B30',
  },
  imagePlaceholderText: { fontSize: 46, color: '#FFFFFF', fontWeight: 'bold' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editBadgeText: { fontSize: 14 },
  profileName: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  identifierRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  identifierIcon: { fontSize: 16, marginRight: 6 },
  profileIdentifier: { fontSize: 14, color: '#666' },
  genderBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#FFE5E5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  genderBadgeText: { fontSize: 13, color: '#FF3B30', fontWeight: '600' },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  statCardHighlight: {
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  statIcon: { fontSize: 22, marginBottom: 6 },
  statNumber: { fontSize: 26, fontWeight: 'bold', color: '#FF3B30', marginBottom: 4 },
  statNumberSmall: { fontSize: 11, fontWeight: 'bold', color: '#FF3B30', marginBottom: 4, textAlign: 'center' },
  statLabel: { fontSize: 11, color: '#666', textAlign: 'center' },
  infoSection: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 15 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: { fontSize: 14, color: '#666' },
  infoValue: { fontSize: 14, color: '#000', fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  actionsSection: { margin: 15 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: { fontSize: 22, marginRight: 15 },
  actionText: { flex: 1, fontSize: 16, color: '#000', fontWeight: '500' },
  actionArrow: { fontSize: 16, color: '#999' },
  logoutButton: { backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#FFE5E5' },
  logoutText: { color: '#FF3B30' },
  versionText: { textAlign: 'center', fontSize: 12, color: '#999', marginVertical: 20 },
});

export default ProfileScreen;