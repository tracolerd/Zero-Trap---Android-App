import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getUserData } from '../services/storageService';
import {
  sendEmergencyNotification,
  sendHelpRequestNotification
} from '../services/notificationService';

const HomeScreen = ({ navigation }) => {
  const [mode, setMode] = useState('internet');
  const [userData, setUserData] = useState(null);
  const [helpingScore, setHelpingScore] = useState(0);
  const [lastHelped, setLastHelped] = useState(null);
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
      setHelpingScore(data.helpingScore || 0);
      setLastHelped(data.lastHelped || null);
    }
    setLoading(false);
  };

  const handleSeekHelp = () => {
    Alert.alert(
      '🚨 Seek Help',
      `আপনি ${mode === 'bluetooth' ? 'Bluetooth (100m range)' : 'Internet (unlimited)'} mode এ সাহায্য চাচ্ছেন।\n\nNearby helpers কে notify করা হবে।`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: async () => {
            await sendEmergencyNotification(
              userData?.name || 'Someone',
              mode === 'bluetooth' ? '50m' : null
            );
            navigation.navigate('Map', { mode: mode });
          }
        }
      ]
    );
  };

  const handleSearchHelp = () => {
    if (mode === 'bluetooth') {
      navigation.navigate('BluetoothSearch');
    } else {
      navigation.navigate('SearchHelp', { mode: mode });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3B30" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              স্বাগতম, {userData?.name || 'User'} 👋
            </Text>
            <Text style={styles.subGreeting}>আপনি কি সাহায্য করতে প্রস্তুত?</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileButtonText}>
              {userData?.name ? userData.name[0].toUpperCase() : '👤'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeCard}>
          <View style={styles.modeHeader}>
            <Text style={styles.modeTitle}>Connection Mode</Text>
            <View style={[
              styles.modeBadge,
              { backgroundColor: mode === 'bluetooth' ? '#007AFF' : '#34C759' }
            ]}>
              <Text style={styles.modeBadgeText}>
                {mode === 'bluetooth' ? '📡 Bluetooth' : '🌐 Internet'}
              </Text>
            </View>
          </View>

          <View style={styles.modeToggleRow}>
            <View style={styles.modeOption}>
              <Text style={styles.modeIcon}>📡</Text>
              <Text style={styles.modeLabel}>Bluetooth</Text>
              <Text style={styles.modeDesc}>100m range</Text>
            </View>

            <Switch
              value={mode === 'internet'}
              onValueChange={(val) => setMode(val ? 'internet' : 'bluetooth')}
              trackColor={{ false: '#007AFF', true: '#34C759' }}
              thumbColor="#FFFFFF"
              style={styles.modeSwitch}
            />

            <View style={styles.modeOption}>
              <Text style={styles.modeIcon}>🌐</Text>
              <Text style={styles.modeLabel}>Internet</Text>
              <Text style={styles.modeDesc}>Unlimited</Text>
            </View>
          </View>

          <Text style={styles.modeInfo}>
            {mode === 'bluetooth'
              ? '📴 Offline mode - ইন্টারনেট ছাড়াও কাজ করবে। ১০০ মিটার রেঞ্জে সাহায্য পাবেন।'
              : '🌍 Online mode - যেকোনো জায়গা থেকে সাহায্য পাবেন। Real-time GPS tracking।'}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{helpingScore}</Text>
            <Text style={styles.statLabel}>Helping Score</Text>
            <Text style={styles.statIcon}>⭐</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userData?.totalHelped || 0}</Text>
            <Text style={styles.statLabel}>Times Helped</Text>
            <Text style={styles.statIcon}>🤝</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumberSmall}>
              {lastHelped ? new Date(lastHelped).toLocaleDateString('bn-BD') : 'কখনো না'}
            </Text>
            <Text style={styles.statLabel}>Last Helped</Text>
            <Text style={styles.statIcon}>📅</Text>
          </View>
        </View>

        {/* Main Action - SEEK HELP */}
        <TouchableOpacity
          style={styles.seekHelpButton}
          onPress={handleSeekHelp}
          activeOpacity={0.8}
        >
          <Text style={styles.seekHelpIcon}>🆘</Text>
          <Text style={styles.seekHelpTitle}>SEEK HELP</Text>
          <Text style={styles.seekHelpSubtitle}>
            জরুরি সাহায্য দরকার? এখানে চাপুন
          </Text>
        </TouchableOpacity>

        {/* Search Help Button */}
        <TouchableOpacity
          style={styles.searchHelpButton}
          onPress={handleSearchHelp}
          activeOpacity={0.8}
        >
          <Text style={styles.searchHelpIcon}>🔍</Text>
          <Text style={styles.searchHelpTitle}>Search for Help</Text>
          <Text style={styles.searchHelpSubtitle}>
            কাউকে সাহায্য করতে চান? এখানে চাপুন
          </Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>⚠️ গুরুত্বপূর্ণ</Text>
          <Text style={styles.infoText}>
            জীবন-মৃত্যু সমস্যায় সবার আগে{' '}
            <Text style={styles.infoHighlight}>999</Text> তে call করুন।
            Zero Trap official emergency services এর substitute নয়।
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  profileButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  modeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  modeBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  modeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  modeOption: {
    alignItems: 'center',
    flex: 1,
  },
  modeIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  modeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  modeDesc: {
    fontSize: 11,
    color: '#999',
  },
  modeSwitch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  modeInfo: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  statNumberSmall: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF3B30',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 3,
  },
  statIcon: {
    fontSize: 16,
    marginTop: 4,
  },
  seekHelpButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  seekHelpIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  seekHelpTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 8,
  },
  seekHelpSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  searchHelpButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FF3B30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchHelpIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  searchHelpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 5,
  },
  searchHelpSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  infoHighlight: {
    fontWeight: 'bold',
    color: '#FF3B30',
    fontSize: 15,
  },
});

export default HomeScreen;