import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const demoDevices = [
  { id: '1', name: 'Rahim', distance: '50m', signalStrength: 85, message: 'সাহায্য দরকার!' },
  { id: '2', name: 'Karim', distance: '75m', signalStrength: 70, message: 'গাড়ি নষ্ট হয়েছে' },
  { id: '3', name: 'Nasrin', distance: '90m', signalStrength: 60, message: 'অসুস্থ' },
];

const BluetoothSearchScreen = ({ navigation }) => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [permissionChecking, setPermissionChecking] = useState(false);

  const requestPermissions = async () => {
    setPermissionChecking(true);

    try {
      if (Platform.OS === 'android') {
        // Android 12+ (API 31+) needs different permissions
        const androidVersion = Platform.Version;
        
        let permissionsToRequest = [];
        
        if (androidVersion >= 31) {
          // Android 12+
          permissionsToRequest = [
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ];
        } else {
          // Android 11 and below
          permissionsToRequest = [
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ];
        }

        const granted = await PermissionsAndroid.requestMultiple(permissionsToRequest);

        // Check if all granted
        const allGranted = Object.values(granted).every(
          status => status === PermissionsAndroid.RESULTS.GRANTED
        );

        setPermissionChecking(false);

        if (allGranted) {
          setPermissionGranted(true);
          Alert.alert(
            '✅ সফল!',
            'Bluetooth এবং Location access দেওয়া হয়েছে!\n\nএখন scan শুরু করছি...',
            [{ text: 'OK', onPress: () => startScanning() }]
          );
        } else {
          // Some permissions denied
          Alert.alert(
            '⚠️ Permission প্রয়োজন',
            'Bluetooth search করতে সব permissions দিতে হবে।\n\nSettings এ গিয়ে manually enable করবেন?',
            [
              { text: 'পরে করবো', style: 'cancel', onPress: () => navigation.goBack() },
              { 
                text: 'Settings খুলুন', 
                onPress: () => Linking.openSettings()
              }
            ]
          );
        }
      } else {
        // iOS - permissions are handled automatically
        setPermissionChecking(false);
        setPermissionGranted(true);
        startScanning();
      }
    } catch (err) {
      console.error('Permission error:', err);
      setPermissionChecking(false);
      Alert.alert(
        'Error',
        'Permission request failed। আবার try করুন।',
        [{ text: 'OK' }]
      );
    }
  };

  const startScanning = async () => {
    setScanning(true);
    setHasScanned(false);
    setDevices([]);

    // Simulate BLE scanning
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Show demo devices
    setDevices(demoDevices);
    setScanning(false);
    setHasScanned(true);

    // Show completion message
    Alert.alert(
      '✅ Scan সম্পন্ন!',
      `${demoDevices.length}টি nearby help request পাওয়া গেছে!\n\n🤖 Demo Mode Active:\nএগুলো test devices। Production এ real users দেখাবে।`,
      [{ text: 'OK' }]
    );
  };

  const handleDeviceSelect = (device) => {
    Alert.alert(
      `🆘 ${device.name} এর Help Request`,
      `📍 দূরত্ব: ${device.distance}\n💬 বার্তা: "${device.message}"\n\n🤖 এটি demo request। Chat করতে চান?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Chat শুরু করুন',
          onPress: () => navigation.navigate('HelpChat', {
            requestId: `bt_${device.id}`,
            seekerName: device.name,
            seekerPhone: '+880171234567' + device.id,
            isHelper: true,
            helperName: 'You',
            mode: 'bluetooth',
            isDemo: true
          })
        }
      ]
    );
  };

  // Permission screen
  if (!permissionGranted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bluetooth Search</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.permissionContainer}>
          <Text style={styles.permissionIcon}>📡</Text>
          <Text style={styles.permissionTitle}>Permission Required</Text>
          <Text style={styles.permissionText}>
            Bluetooth এবং Location permissions প্রয়োজন আশেপাশের help requests খুঁজতে।
          </Text>

          <View style={styles.permissionList}>
            <View style={styles.permissionItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.permissionItemText}>Bluetooth Scan</Text>
            </View>
            <View style={styles.permissionItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.permissionItemText}>Bluetooth Connect</Text>
            </View>
            <View style={styles.permissionItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.permissionItemText}>Location Access</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.grantButton, permissionChecking && styles.buttonDisabled]}
            onPress={requestPermissions}
            disabled={permissionChecking}
          >
            {permissionChecking ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.grantButtonText}>Grant Permissions</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.permissionNote}>
            এই permissions গুলো শুধুমাত্র nearby help requests খুঁজতে ব্যবহার করা হবে। আপনার privacy সুরক্ষিত থাকবে।
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Main scanning screen
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📡 Bluetooth Search</Text>
        <TouchableOpacity onPress={startScanning} disabled={scanning}>
          <Text style={[styles.scanButton, scanning && styles.scanButtonDisabled]}>
            {scanning ? '⏳' : '🔄'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          🔵 100 মিটার রেঞ্জে offline help requests খুঁজছি
        </Text>
        <Text style={styles.infoSubtext}>
          {scanning 
            ? '⏳ Scanning চলছে...' 
            : hasScanned 
              ? `✅ Scan সম্পন্ন - ${devices.length}টি পাওয়া গেছে`
              : '📡 Scan করার জন্য প্রস্তুত'
          }
        </Text>
      </View>

      {scanning ? (
        <View style={styles.scanningContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.scanningText}>Bluetooth স্ক্যান করা হচ্ছে...</Text>
          <Text style={styles.scanningSubtext}>📡 আশেপাশের 100 মিটার এলাকায় খুঁজছি</Text>
          <Text style={styles.scanningNote}>⏱️ কয়েক সেকেন্ড অপেক্ষা করুন</Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.deviceCard}
              onPress={() => handleDeviceSelect(item)}
            >
              <View style={styles.deviceIcon}>
                <Text style={styles.deviceIconText}>🆘</Text>
              </View>
              <View style={styles.deviceInfo}>
                <View style={styles.deviceHeader}>
                  <Text style={styles.deviceName}>{item.name}</Text>
                  <View style={styles.demoBadge}>
                    <Text style={styles.demoBadgeText}>DEMO</Text>
                  </View>
                </View>
                <Text style={styles.deviceMessage}>💬 {item.message}</Text>
                <Text style={styles.deviceDistance}>📍 {item.distance} দূরে</Text>
              </View>
              <View style={styles.signalContainer}>
                <Text style={styles.signalText}>{item.signalStrength}%</Text>
                <View style={styles.signalBars}>
                  <View style={[styles.signalBar, item.signalStrength > 25 && styles.signalBarActive]} />
                  <View style={[styles.signalBar, item.signalStrength > 50 && styles.signalBarActive]} />
                  <View style={[styles.signalBar, item.signalStrength > 75 && styles.signalBarActive]} />
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            hasScanned ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>কাউকে পাওয়া যায়নি</Text>
                <Text style={styles.emptyText}>
                  আশেপাশে কোনো help request নেই।{'\n'}100 মিটার এলাকায় কোনো active request পাওয়া যায়নি।
                </Text>
                <TouchableOpacity
                  style={styles.rescanButton}
                  onPress={startScanning}
                >
                  <Text style={styles.rescanButtonText}>🔄 আবার Scan করুন</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      )}

      {!scanning && hasScanned && devices.length > 0 && (
        <TouchableOpacity
          style={styles.mainScanButton}
          onPress={startScanning}
        >
          <Text style={styles.mainScanButtonText}>🔄 নতুন করে Scan করুন</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
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
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#000' },
  scanButton: { fontSize: 26, color: '#007AFF' },
  scanButtonDisabled: { opacity: 0.4 },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionIcon: { fontSize: 80, marginBottom: 20 },
  permissionTitle: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  permissionText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  permissionList: { marginBottom: 35, width: '100%', paddingHorizontal: 40 },
  permissionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  checkmark: { fontSize: 22, color: '#007AFF', marginRight: 12, fontWeight: 'bold' },
  permissionItemText: { fontSize: 16, color: '#333', fontWeight: '500' },
  grantButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 20,
    minWidth: 240,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: { backgroundColor: '#99CCFF', opacity: 0.7 },
  grantButtonText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: 'bold', 
    letterSpacing: 0.5 
  },
  permissionNote: { 
    fontSize: 13, 
    color: '#999', 
    textAlign: 'center', 
    paddingHorizontal: 30, 
    lineHeight: 20 
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    marginHorizontal: 15,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: { fontSize: 14, color: '#1976D2', fontWeight: '600', marginBottom: 4 },
  infoSubtext: { fontSize: 12, color: '#666', fontStyle: 'italic' },
  scanningContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingBottom: 60 
  },
  scanningText: { marginTop: 20, fontSize: 17, color: '#333', fontWeight: '600' },
  scanningSubtext: { marginTop: 8, fontSize: 14, color: '#666' },
  scanningNote: { marginTop: 15, fontSize: 13, color: '#999', fontStyle: 'italic' },
  listContent: { padding: 15, paddingBottom: 100 },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  deviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  deviceIconText: { fontSize: 26 },
  deviceInfo: { flex: 1 },
  deviceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  deviceName: { fontSize: 17, fontWeight: 'bold', color: '#000', marginRight: 8 },
  demoBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  demoBadgeText: { fontSize: 10, color: '#FFFFFF', fontWeight: 'bold' },
  deviceMessage: { fontSize: 14, color: '#555', marginBottom: 4, fontStyle: 'italic' },
  deviceDistance: { fontSize: 13, color: '#666' },
  signalContainer: { alignItems: 'center' },
  signalText: { fontSize: 12, color: '#007AFF', marginBottom: 6, fontWeight: '700' },
  signalBars: { flexDirection: 'row', gap: 3 },
  signalBar: { width: 6, height: 16, backgroundColor: '#E0E0E0', borderRadius: 2 },
  signalBarActive: { backgroundColor: '#007AFF' },
  emptyContainer: { 
    alignItems: 'center', 
    paddingVertical: 80, 
    paddingHorizontal: 30 
  },
  emptyIcon: { fontSize: 70, marginBottom: 20 },
  emptyTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 12 
  },
  emptyText: { 
    fontSize: 15, 
    color: '#666', 
    textAlign: 'center', 
    lineHeight: 24, 
    marginBottom: 25 
  },
  rescanButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
  },
  rescanButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  mainScanButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  mainScanButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },
});

export default BluetoothSearchScreen;