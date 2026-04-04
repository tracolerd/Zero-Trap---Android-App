// services/locationService.js
// Background Location Tracking with Battery Optimization

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { updateUserLocation } from './firestoreService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_TASK_NAME = 'background-location-task';
const LOCATION_UPDATE_INTERVAL = 30000; // 30 seconds (balanced)
const MIN_UPDATE_DISTANCE = 50; // 50 meters

// ============================================
// DEFINE BACKGROUND TASK
// ============================================

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error);
    return;
  }

  if (data) {
    const { locations } = data;
    const location = locations[0];

    if (location) {
      try {
        // Get current user ID from storage
        let userId = null;
        const userDataStr = await AsyncStorage.getItem('currentUser');
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            userId = userData.userId || null;
          } catch (_) {
            userId = null;
          }
        }
        if (!userId) {
          userId = await AsyncStorage.getItem('userId');
        }

        if (userId) {
          // Check if emergency mode is active
          const emergencyMode = await AsyncStorage.getItem('emergencyMode');
          
          if (emergencyMode === 'true') {
            // Update location in Firestore
            await updateUserLocation(userId, {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy,
              heading: location.coords.heading,
              speed: location.coords.speed,
            });

            console.log('Background location updated:', {
              lat: location.coords.latitude,
              lng: location.coords.longitude
            });
          }
        }
      } catch (error) {
        console.error('Background location update error:', error);
      }
    }
  }
});

// ============================================
// REQUEST LOCATION PERMISSIONS
// ============================================

export const requestLocationPermissions = async () => {
  try {
    // Request foreground permission
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (foregroundStatus !== 'granted') {
      return {
        success: false,
        error: 'Location permission denied। Emergency features work করবে না।'
      };
    }

    // Request background permission (Android 10+)
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    
    if (backgroundStatus !== 'granted') {
      return {
        success: false,
        error: 'Background location permission needed for emergency tracking।',
        foregroundOnly: true
      };
    }

    return { success: true };

  } catch (error) {
    console.error('Location permission error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// START BACKGROUND LOCATION TRACKING
// ============================================

export const startBackgroundLocationTracking = async () => {
  try {
    // Check if already tracking
    const isTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    
    if (isTracking) {
      console.log('Background tracking already active');
      return { success: true, message: 'Already tracking' };
    }

    // Start tracking
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced, // Battery optimized
      timeInterval: LOCATION_UPDATE_INTERVAL,
      distanceInterval: MIN_UPDATE_DISTANCE,
      foregroundService: {
        notificationTitle: '🚨 Zero Trap - Emergency Mode',
        notificationBody: 'Tracking your location for safety',
        notificationColor: '#FF3B30',
      },
      pausesUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: true,
    });

    // Set emergency mode flag
    await AsyncStorage.setItem('emergencyMode', 'true');

    console.log('Background location tracking started');
    return { success: true };

  } catch (error) {
    console.error('Start background tracking error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// STOP BACKGROUND LOCATION TRACKING
// ============================================

export const stopBackgroundLocationTracking = async () => {
  try {
    const isTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    
    if (isTracking) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log('Background location tracking stopped');
    }

    // Clear emergency mode flag
    await AsyncStorage.setItem('emergencyMode', 'false');

    return { success: true };

  } catch (error) {
    console.error('Stop background tracking error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// GET CURRENT LOCATION (One-time)
// ============================================

export const getCurrentLocation = async () => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      success: true,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        heading: location.coords.heading,
        speed: location.coords.speed,
      }
    };

  } catch (error) {
    console.error('Get current location error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// WATCH LOCATION (Foreground - Real-time)
// ============================================

export const watchLocation = async (callback) => {
  try {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // 5 seconds for real-time
        distanceInterval: 10, // 10 meters
      },
      (location) => {
        callback({
          success: true,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            heading: location.coords.heading,
            speed: location.coords.speed,
          }
        });
      }
    );

    return subscription;

  } catch (error) {
    console.error('Watch location error:', error);
    callback({ success: false, error: error.message });
    return null;
  }
};

// ============================================
// CHECK IF BACKGROUND TRACKING IS ACTIVE
// ============================================

export const isBackgroundTrackingActive = async () => {
  try {
    const isTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    const emergencyMode = await AsyncStorage.getItem('emergencyMode');
    
    return {
      success: true,
      isTracking: isTracking && emergencyMode === 'true'
    };

  } catch (error) {
    console.error('Check tracking status error:', error);
    return { success: false, isTracking: false };
  }
};

// ============================================
// CALCULATE DISTANCE BETWEEN TWO POINTS
// ============================================

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// ============================================
// GET ADDRESS FROM COORDINATES (Reverse Geocoding)
// ============================================

export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });

    if (addresses && addresses.length > 0) {
      const address = addresses[0];
      const formattedAddress = [
        address.name,
        address.street,
        address.district,
        address.city,
        address.country
      ].filter(Boolean).join(', ');

      return { success: true, address: formattedAddress, details: address };
    }

    return { success: false, error: 'No address found' };

  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// BATTERY OPTIMIZATION TIPS
// ============================================

export const getBatteryOptimizationInfo = () => {
  return {
    updateInterval: `${LOCATION_UPDATE_INTERVAL / 1000} seconds`,
    minDistance: `${MIN_UPDATE_DISTANCE} meters`,
    accuracy: 'Balanced (Battery optimized)',
    tips: [
      '🔋 Location updates শুধু emergency mode এ active',
      '⏱️ Updates every 30 seconds (balanced)',
      '📍 Minimum 50m movement required',
      '⚡ Background service stops when emergency ends',
      '💡 Foreground updates are real-time (5 sec)'
    ]
  };
};

// ============================================
// EMERGENCY MODE HELPERS
// ============================================

export const setEmergencyMode = async (isActive) => {
  try {
    await AsyncStorage.setItem('emergencyMode', isActive ? 'true' : 'false');
    
    if (isActive) {
      await startBackgroundLocationTracking();
    } else {
      await stopBackgroundLocationTracking();
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const isEmergencyModeActive = async () => {
  try {
    const mode = await AsyncStorage.getItem('emergencyMode');
    return mode === 'true';
  } catch (error) {
    return false;
  }
};