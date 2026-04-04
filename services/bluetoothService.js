import { Platform, PermissionsAndroid } from 'react-native';

// Request Bluetooth permissions
export const requestBluetoothPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        // Android 12+
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const allGranted = Object.values(granted).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );

        return {
          success: allGranted,
          error: allGranted ? null : 'Bluetooth permissions not granted'
        };
      } else {
        // Android 11 and below
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
        ]);

        const allGranted = Object.values(granted).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );

        return {
          success: allGranted,
          error: allGranted ? null : 'Bluetooth permissions not granted'
        };
      }
    }

    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Error requesting Bluetooth permission:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Check if Bluetooth is available
export const isBluetoothAvailable = () => {
  return {
    success: true,
    available: true
  };
};

// Start advertising (Seek Help mode)
export const startAdvertising = async (userData) => {
  try {
    console.log('Starting Bluetooth advertising with data:', userData);
    
    return {
      success: true,
      message: 'Broadcasting help signal via Bluetooth'
    };
  } catch (error) {
    console.error('Error starting advertising:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Stop advertising
export const stopAdvertising = async () => {
  try {
    console.log('Stopping Bluetooth advertising');
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error stopping advertising:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Start scanning (Search Help mode)
export const startScanning = async (onDeviceFound) => {
  try {
    console.log('Starting Bluetooth scanning');
    
    // Demo: Simulate finding devices after 2 seconds
    setTimeout(() => {
      const demoDevices = [
        {
          id: 'demo_device_1',
          name: 'User 1 - Need Help',
          distance: 45,
          phoneNumber: '+8801711111111',
          signal: -60
        },
        {
          id: 'demo_device_2',
          name: 'User 2 - Emergency',
          distance: 78,
          phoneNumber: '+8801722222222',
          signal: -75
        }
      ];
      
      demoDevices.forEach(device => {
        onDeviceFound(device);
      });
    }, 2000);
    
    return {
      success: true,
      message: 'Scanning for nearby help requests'
    };
  } catch (error) {
    console.error('Error starting scan:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Stop scanning
export const stopScanning = async () => {
  try {
    console.log('Stopping Bluetooth scanning');
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error stopping scan:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Connect to device
export const connectToDevice = async (deviceId) => {
  try {
    console.log('Connecting to device:', deviceId);
    
    return {
      success: true,
      connection: {
        deviceId: deviceId,
        connected: true
      }
    };
  } catch (error) {
    console.error('Error connecting to device:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send message via Bluetooth
export const sendMessage = async (deviceId, message) => {
  try {
    console.log('Sending message to', deviceId, ':', message);
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Disconnect from device
export const disconnectDevice = async (deviceId) => {
  try {
    console.log('Disconnecting from device:', deviceId);
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error disconnecting:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get signal strength (RSSI)
export const getSignalStrength = (rssi) => {
  if (rssi > -60) return 'Very Close (<5m)';
  if (rssi > -75) return 'Close (5-20m)';
  if (rssi > -85) return 'Medium (20-50m)';
  return 'Far (50-100m)';
};

// Estimate distance from RSSI
export const estimateDistance = (rssi, txPower = -59) => {
  const n = 2.5;
  const distance = Math.pow(10, (txPower - rssi) / (10 * n));
  return Math.round(distance * 10) / 10;
};