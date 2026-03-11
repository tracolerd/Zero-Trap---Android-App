// screens/HomeScreen.js
// FINAL - Developer Info in Quick Links + Google Maps API configured

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, signOut } from '../services/firebaseAuthService';
import { getUserProfile, setUserOnlineStatus } from '../services/firestoreService';

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [selectedMode, setSelectedMode] = useState('internet');

  useEffect(() => {
    loadUserData();
    setOnlineStatus(true);

    return () => {
      setOnlineStatus(false);
    };
  }, []);

  const loadUserData = async () => {
    try {
      const user = getCurrentUser();
      
      if (!user) {
        navigation.replace('Login');
        return;
      }

      const result = await getUserProfile(user.uid);
      
      if (result.success) {
        setUserData(result.data);
        await AsyncStorage.setItem('currentUser', JSON.stringify(result.data));
      }
    } catch (error) {
      console.error('Load user data error:', error);
    }
  };

  const setOnlineStatus = async (isOnline) => {
    const user = getCurrentUser();
    if (user) {
      await setUserOnlineStatus(user.uid, isOnline);
    }
  };

  const handleSeekHelp = () => {
    if (selectedMode === 'internet') {
      navigation.navigate('Map', { mode: 'seek' });
    } else {
      navigation.navigate('BluetoothSearch', { mode: 'seek' });
    }
  };

  const handleProvideHelp = () => {
    if (selectedMode === 'internet') {
      navigation.navigate('SearchHelp');
    } else {
      navigation.navigate('BluetoothSearch', { mode: 'provide' });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'আপনি কি logout করতে চান?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await setOnlineStatus(false);
            await signOut();
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF3B30" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>🚨</Text>
            <View>
              <Text style={styles.appName}>Zero Trap</Text>
              <Text style={styles.tagline}>Emergency Help Network</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            {userData?.profileImage ? (
              <Image
                source={{ uri: userData.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>
                  {userData?.name ? userData.name[0].toUpperCase() : '?'}
                </Text>
              </View>
            )}
            {userData?.isOnline && <View style={styles.onlineDot} />}
          </TouchableOpacity>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            স্বাগতম, {userData?.name || 'User'}!
          </Text>
          <Text style={styles.welcomeSubtext}>
            @{userData?.username || 'username'} • Score: {userData?.helpingScore || 0}
          </Text>
        </View>

        {/* Mode Selection */}
        <View style={styles.modeSection}>
          <Text style={styles.sectionTitle}>Select Mode</Text>
          
          <View style={styles.modeButtons}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                selectedMode === 'internet' && styles.modeButtonActive
              ]}
              onPress={() => setSelectedMode('internet')}
            >
              <Text style={styles.modeIcon}>🌐</Text>
              <Text style={[
                styles.modeButtonText,
                selectedMode === 'internet' && styles.modeButtonTextActive
              ]}>
                Internet Mode
              </Text>
              <Text style={styles.modeDescription}>
                GPS tracking • Unlimited range
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeButton,
                selectedMode === 'bluetooth' && styles.modeButtonActive
              ]}
              onPress={() => setSelectedMode('bluetooth')}
            >
              <Text style={styles.modeIcon}>📡</Text>
              <Text style={[
                styles.modeButtonText,
                selectedMode === 'bluetooth' && styles.modeButtonTextActive
              ]}>
                Bluetooth Mode
              </Text>
              <Text style={styles.modeDescription}>
                Offline • 100m range
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.seekHelpButton}
            onPress={handleSeekHelp}
          >
            <Text style={styles.actionIcon}>🆘</Text>
            <Text style={styles.actionButtonText}>Seek Help</Text>
            <Text style={styles.actionButtonSubtext}>
              {selectedMode === 'internet' 
                ? 'Send emergency request' 
                : 'Find nearby helpers'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.provideHelpButton}
            onPress={handleProvideHelp}
          >
            <Text style={styles.actionIcon}>🤝</Text>
            <Text style={styles.actionButtonText}>Provide Help</Text>
            <Text style={styles.actionButtonSubtext}>
              {selectedMode === 'internet' 
                ? 'See who needs help nearby' 
                : 'Broadcast availability'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Links - UPDATED WITH DEVELOPER INFO */}
        <View style={styles.quickLinksSection}>
          <Text style={styles.sectionTitle}>Community & Info</Text>

          <View style={styles.quickLinksGrid}>
            <TouchableOpacity
              style={styles.quickLinkCard}
              onPress={() => navigation.navigate('AllUsers')}
            >
              <Text style={styles.quickLinkIcon}>👥</Text>
              <Text style={styles.quickLinkText}>All Users</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickLinkCard}
              onPress={() => navigation.navigate('Map')}
            >
              <Text style={styles.quickLinkIcon}>🗺️</Text>
              <Text style={styles.quickLinkText}>Live Map</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickLinkCard}
              onPress={() => navigation.navigate('HelpHistory')}
            >
              <Text style={styles.quickLinkIcon}>📊</Text>
              <Text style={styles.quickLinkText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickLinkCard}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.quickLinkIcon}>⚙️</Text>
              <Text style={styles.quickLinkText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickLinkCard}
              onPress={() => navigation.navigate('DeveloperInfo')}
            >
              <Text style={styles.quickLinkIcon}>👨‍💻</Text>
              <Text style={styles.quickLinkText}>Developer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData?.totalHelped || 0}</Text>
            <Text style={styles.statLabel}>People Helped</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData?.helpingScore || 0}</Text>
            <Text style={styles.statLabel}>Helping Score</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>

        {/* Footer - ONLY LEGAL LINKS */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('TermsConditions')}>
            <Text style={styles.footerLink}>Terms</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}>•</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
            <Text style={styles.footerLink}>Privacy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { paddingBottom: 30 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    padding: 20,
    paddingTop: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { fontSize: 40, marginRight: 12 },
  appName: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  tagline: { fontSize: 11, color: '#FFE5E5' },
  profileButton: { position: 'relative' },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileImagePlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: { fontSize: 18, fontWeight: 'bold', color: '#FF3B30' },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  welcomeSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  welcomeText: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  welcomeSubtext: { fontSize: 13, color: '#666' },
  modeSection: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 15 },
  modeButtons: { flexDirection: 'row', gap: 10 },
  modeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  modeIcon: { fontSize: 30, marginBottom: 8 },
  modeButtonText: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  modeButtonTextActive: { color: '#FFFFFF' },
  modeDescription: { fontSize: 11, color: '#666', textAlign: 'center' },
  actionsSection: { paddingHorizontal: 20, marginBottom: 20 },
  seekHelpButton: {
    backgroundColor: '#FF3B30',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 5,
  },
  provideHelpButton: {
    backgroundColor: '#34C759',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  actionIcon: { fontSize: 40, marginBottom: 8 },
  actionButtonText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  actionButtonSubtext: { fontSize: 12, color: '#FFFFFF', opacity: 0.9 },
  quickLinksSection: { paddingHorizontal: 20, marginBottom: 20 },
  quickLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickLinkCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  quickLinkIcon: { fontSize: 32, marginBottom: 8 },
  quickLinkText: { fontSize: 12, fontWeight: 'bold', color: '#000', textAlign: 'center' },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#FF3B30', marginBottom: 5 },
  statLabel: { fontSize: 12, color: '#666' },
  logoutButton: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF3B30',
    marginBottom: 20,
  },
  logoutButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FF3B30' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  footerLink: { fontSize: 12, color: '#007AFF' },
  footerDivider: { fontSize: 12, color: '#999', marginHorizontal: 8 },
});

export default HomeScreen;