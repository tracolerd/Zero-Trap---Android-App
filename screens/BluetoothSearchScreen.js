// screens/BluetoothSearchScreen.js
// Bluetooth Search with User Names and Phone Numbers

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUserId } from '../services/firebaseAuthService';
import { getUserProfile } from '../services/firestoreService';

// Note: This is a simplified version
// Production would use actual Bluetooth scanning with user data sync

const BluetoothSearchScreen = ({ navigation, route }) => {
  const { mode } = route.params; // 'seek' or 'provide'
  const [scanning, setScanning] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      const apiLevel = Platform.Version;

      if (apiLevel >= 31) {
        // Android 12+
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const allGranted = Object.values(granted).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );

        setPermissionsGranted(allGranted);

        if (!allGranted) {
          Alert.alert(
            'Permissions Required',
            'Bluetooth এবং Location permissions লাগবে nearby users খুঁজতে।',
            [
              {
                text: 'Grant Permissions',
                onPress: () => checkPermissions()
              }
            ]
          );
        }
      } else {
        // Android 11 and below
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        setPermissionsGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
      }
    } else {
      setPermissionsGranted(true);
    }
  };

  const startScanning = async () => {
    if (!permissionsGranted) {
      Alert.alert('Error', 'Permissions not granted');
      return;
    }

    setScanning(true);
    setNearbyUsers([]);

    // Simulate Bluetooth scan
    // In production, this would:
    // 1. Scan for nearby Bluetooth devices
    // 2. Exchange user IDs via Bluetooth
    // 3. Fetch user profiles from Firestore
    // 4. Display users with phone numbers

    setTimeout(async () => {
      // Demo: Get some random users (in production, would be actual BT scan)
      const demoUsers = await getDemoNearbyUsers();
      setNearbyUsers(demoUsers);
      setScanning(false);
    }, 3000);
  };

  const getDemoNearbyUsers = async () => {
    // Demo implementation
    // In production, this would fetch actual users from Bluetooth scan
    return [
      {
        id: 'demo1',
        name: 'John Doe (DEMO)',
        username: 'john_doe',
        phoneNumber: '1234567890',
        distance: 15,
        signalStrength: -60,
        isDemoUser: true
      },
      {
        id: 'demo2',
        name: 'Jane Smith (DEMO)',
        username: 'jane_smith',
        phoneNumber: '9876543210',
        distance: 30,
        signalStrength: -75,
        isDemoUser: true
      },
      {
        id: 'demo3',
        name: 'Mike Wilson (DEMO)',
        username: 'mike_w',
        phoneNumber: '5555555555',
        distance: 50,
        signalStrength: -85,
        isDemoUser: true
      }
    ];
  };

  const handleCall = (user) => {
    if (!user.phoneNumber) {
      Alert.alert('No Phone Number', `${user.name} এর phone number নেই।`);
      return;
    }

    const phoneNumber = user.phoneNumber.startsWith('+880')
      ? user.phoneNumber
      : `+880${user.phoneNumber}`;

    Alert.alert(
      'Call User',
      `Call ${user.name} at ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${phoneNumber}`)
        }
      ]
    );
  };

  const handleUserPress = (user) => {
    Alert.alert(
      user.name,
      `Username: @${user.username}\nPhone: +880${user.phoneNumber}\nDistance: ~${user.distance}m`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => handleCall(user)
        }
      ]
    );
  };

  const renderUserItem = ({ item }) => {
    const getSignalColor = (strength) => {
      if (strength > -60) return '#34C759'; // Strong
      if (strength > -80) return '#FFC107'; // Medium
      return '#FF3B30'; // Weak
    };

    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => handleUserPress(item)}
      >
        <View style={styles.userIconContainer}>
          <View style={styles.userIcon}>
            <Text style={styles.userIconText}>
              {item.name ? item.name[0].toUpperCase() : '?'}
            </Text>
          </View>
          
          <View style={[
            styles.signalIndicator,
            { backgroundColor: getSignalColor(item.signalStrength) }
          ]}>
            <Text style={styles.signalText}>📡</Text>
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.name}
            {item.isDemoUser && (
              <Text style={styles.demoBadge}> DEMO</Text>
            )}
          </Text>
          <Text style={styles.userUsername}>@{item.username}</Text>
          
          <View style={styles.phoneRow}>
            <Text style={styles.phoneIcon}>📞</Text>
            <Text style={styles.phoneNumber}>+880{item.phoneNumber}</Text>
          </View>
          
          <Text style={styles.distance}>~{item.distance}m away</Text>
        </View>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall(item)}
        >
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (!permissionsGranted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionIcon}>🔒</Text>
          <Text style={styles.permissionTitle}>Permissions Required</Text>
          <Text style={styles.permissionText}>
            Bluetooth এবং Location permissions লাগবে nearby users খুঁজতে।
          </Text>
          
          <TouchableOpacity
            style={styles.grantButton}
            onPress={checkPermissions}
          >
            <Text style={styles.grantButtonText}>Grant Permissions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.backButtonAlt}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonAltText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'seek' ? 'Seek Help' : 'Provide Help'}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerText}>
          📡 Bluetooth Mode: আশেপাশের users খুঁজছি...{'\n'}
          Phone number দেখে সরাসরি call করতে পারবেন
        </Text>
      </View>

      {/* Scan Button */}
      {!scanning && nearbyUsers.length === 0 && (
        <View style={styles.scanSection}>
          <Text style={styles.scanIcon}>🔍</Text>
          <Text style={styles.scanTitle}>Start Scanning</Text>
          <Text style={styles.scanSubtitle}>
            Bluetooth দিয়ে nearby users খুঁজুন
          </Text>
          
          <TouchableOpacity
            style={styles.scanButton}
            onPress={startScanning}
          >
            <Text style={styles.scanButtonText}>Start Scan</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Scanning */}
      {scanning && (
        <View style={styles.scanningSection}>
          <ActivityIndicator size="large" color="#FF3B30" />
          <Text style={styles.scanningText}>Scanning for nearby users...</Text>
          <Text style={styles.scanningSubtext}>
            📡 Looking for Bluetooth devices
          </Text>
        </View>
      )}

      {/* User List */}
      {!scanning && nearbyUsers.length > 0 && (
        <>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>
              Found {nearbyUsers.length} user{nearbyUsers.length > 1 ? 's' : ''}
            </Text>
            <TouchableOpacity
              style={styles.rescanButton}
              onPress={startScanning}
            >
              <Text style={styles.rescanButtonText}>🔄 Rescan</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={nearbyUsers}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}

      {/* Empty State */}
      {!scanning && nearbyUsers.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            কাউকে পাওয়া যায়নি{'\n'}Scan করুন nearby users খুঁজতে
          </Text>
        </View>
      )}

      {/* Demo Notice */}
      <View style={styles.demoNotice}>
        <Text style={styles.demoNoticeText}>
          🔵 Demo mode: Real Bluetooth implementation coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionIcon: { fontSize: 80, marginBottom: 20 },
  permissionTitle: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  permissionText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  grantButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  grantButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  backButtonAlt: {
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  backButtonAltText: { color: '#666', fontSize: 16 },
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
  infoBanner: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2196F3',
  },
  infoBannerText: { fontSize: 12, color: '#1976D2', textAlign: 'center', lineHeight: 18 },
  scanSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  scanIcon: { fontSize: 80, marginBottom: 20 },
  scanTitle: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  scanSubtitle: { fontSize: 14, color: '#666', marginBottom: 30, textAlign: 'center' },
  scanButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  scanningSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  scanningText: { fontSize: 18, fontWeight: 'bold', color: '#000', marginTop: 20 },
  scanningSubtext: { fontSize: 14, color: '#666', marginTop: 10 },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  resultTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  rescanButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rescanButtonText: { fontSize: 14, color: '#333', fontWeight: '600' },
  listContent: { padding: 15 },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userIconContainer: { marginRight: 12, position: 'relative' },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconText: { fontSize: 20, fontWeight: 'bold', color: '#666' },
  signalIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  signalText: { fontSize: 10 },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 3 },
  demoBadge: { fontSize: 10, color: '#FF9500', fontWeight: 'normal' },
  userUsername: { fontSize: 13, color: '#666', marginBottom: 5 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  phoneIcon: { fontSize: 14, marginRight: 5 },
  phoneNumber: { fontSize: 14, color: '#FF3B30', fontWeight: '600' },
  distance: { fontSize: 11, color: '#999', fontStyle: 'italic' },
  callButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  callButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: { fontSize: 16, color: '#999', textAlign: 'center', lineHeight: 24 },
  demoNotice: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FFC107',
  },
  demoNoticeText: { fontSize: 11, color: '#856404', fontStyle: 'italic' },
});

export default BluetoothSearchScreen;