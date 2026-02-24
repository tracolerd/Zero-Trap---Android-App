import * as Location from 'expo-location';

// Request location permissions
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      return {
        success: false,
        error: 'Location permission denied'
      };
    }

    // Also request background permission
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    
    return {
      success: true,
      foreground: status === 'granted',
      background: backgroundStatus === 'granted'
    };
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get current location
export const getCurrentLocation = async () => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
    
    return {
      success: true,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp
      }
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Watch location (real-time tracking)
export const startLocationTracking = async (callback) => {
  try {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10 // Update when moved 10 meters
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: location.timestamp
        });
      }
    );
    
    return {
      success: true,
      subscription: subscription
    };
  } catch (error) {
    console.error('Error tracking location:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Stop location tracking
export const stopLocationTracking = (subscription) => {
  if (subscription) {
    subscription.remove();
  }
};

// Calculate distance between two points (in meters)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Format distance for display
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
};