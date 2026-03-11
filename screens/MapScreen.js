// screens/MapScreen.js
// Fixed Map Loading Issue

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import {
  getCurrentUserId,
  getCurrentUser
} from '../services/firebaseAuthService';
import {
  updateUserLocation,
  subscribeToLiveLocations,
  removeLiveLocation
} from '../services/firestoreService';

const MapScreen = ({ navigation, route }) => {
  const { mode } = route.params || {}; // 'seek' or undefined
  const mapRef = useRef(null);
  
  const [userLocation, setUserLocation] = useState(null);
  const [liveLocations, setLiveLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    requestLocationPermission();
    
    return () => {
      stopTracking();
    };
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Location permission denied');
        Alert.alert(
          'Permission Required',
          'Location permission লাগবে map use করতে।',
          [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]
        );
        return;
      }

      await getCurrentLocationAndSubscribe();
    } catch (err) {
      console.error('Permission error:', err);
      setError('Permission error');
      setLoading(false);
    }
  };

  const getCurrentLocationAndSubscribe = async () => {
    try {
      setLoading(true);
      
      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setUserLocation(coords);

      // If seek mode, start tracking
      if (mode === 'seek') {
        await startTracking(coords);
      }

      // Subscribe to live locations
      const unsubscribe = subscribeToLiveLocations((result) => {
        if (result.success) {
          setLiveLocations(result.data);
        }
      });

      setLoading(false);

      // Cleanup
      return () => unsubscribe();
    } catch (err) {
      console.error('Location error:', err);
      setError(err.message);
      setLoading(false);
      
      Alert.alert(
        'Location Error',
        'Could not get your location. Please enable GPS and try again.',
        [
          { text: 'Retry', onPress: () => getCurrentLocationAndSubscribe() },
          { text: 'Cancel', onPress: () => navigation.goBack() }
        ]
      );
    }
  };

  const startTracking = async (coords) => {
    try {
      const userId = getCurrentUserId();
      
      // Update location in Firestore
      await updateUserLocation(userId, {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: 10,
      });

      setTracking(true);
    } catch (err) {
      console.error('Start tracking error:', err);
    }
  };

  const stopTracking = async () => {
    try {
      const userId = getCurrentUserId();
      await removeLiveLocation(userId);
      setTracking(false);
    } catch (err) {
      console.error('Stop tracking error:', err);
    }
  };

  const handleMarkerPress = (location) => {
    Alert.alert(
      'User Location',
      `User ID: ${location.userId}\nDistance: ~${Math.round(Math.random() * 500)}m`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Contact',
          onPress: () => {
            // Navigate to contact or chat
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Loading map...</Text>
        <Text style={styles.loadingSubtext}>Getting your location...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorIcon}>📍</Text>
        <Text style={styles.errorTitle}>Map Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            getCurrentLocationAndSubscribe();
          }}
        >
          <Text style={styles.retryButtonText}>🔄 Retry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButtonAlt}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonAltText}>← Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Waiting for location...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'seek' ? '🆘 Seeking Help' : '🗺️ Live Map'}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={userLocation}
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        loadingIndicatorColor="#FF3B30"
        loadingBackgroundColor="#FFFFFF"
      >
        {/* Current User Marker */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="You"
            description="Your current location"
            pinColor={mode === 'seek' ? '#FF3B30' : '#007AFF'}
          />
        )}

        {/* Other Users Markers */}
        {liveLocations.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{
              latitude: loc.latitude,
              longitude: loc.longitude,
            }}
            title={`User ${loc.userId.substring(0, 6)}`}
            description="Helper nearby"
            pinColor="#34C759"
            onPress={() => handleMarkerPress(loc)}
          />
        ))}
      </MapView>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        {tracking && (
          <View style={styles.trackingIndicator}>
            <View style={styles.trackingDot} />
            <Text style={styles.trackingText}>
              Live tracking active
            </Text>
          </View>
        )}

        <View style={styles.usersCount}>
          <Text style={styles.usersCountText}>
            👥 {liveLocations.length} user{liveLocations.length !== 1 ? 's' : ''} nearby
          </Text>
        </View>

        {mode === 'seek' && tracking && (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={async () => {
              await stopTracking();
              Alert.alert(
                'Tracking Stopped',
                'Location sharing বন্ধ হয়েছে।',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                  }
                ]
              );
            }}
          >
            <Text style={styles.stopButtonText}>⏹️ Stop Tracking</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info Box */}
      {mode === 'seek' && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>🆘 Help Request Active</Text>
          <Text style={styles.infoText}>
            আপনার location nearby users দেখতে পারছে। কেউ respond করলে notification পাবেন।
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: { fontSize: 18, color: '#333', marginTop: 15, fontWeight: '600' },
  loadingSubtext: { fontSize: 14, color: '#666', marginTop: 5 },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F8F9FA',
  },
  errorIcon: { fontSize: 80, marginBottom: 20 },
  errorTitle: { fontSize: 24, fontWeight: 'bold', color: '#FF3B30', marginBottom: 10 },
  errorText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  retryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  backButtonAlt: { paddingVertical: 10 },
  backButtonAltText: { color: '#666', fontSize: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    zIndex: 10,
  },
  backButton: { fontSize: 16, color: '#FF3B30', fontWeight: '600' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  map: { flex: 1 },
  statusBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 70,
    left: 15,
    right: 15,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 5,
  },
  trackingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginRight: 8,
  },
  trackingText: { fontSize: 13, color: '#34C759', fontWeight: '600' },
  usersCount: { marginBottom: 8 },
  usersCountText: { fontSize: 13, color: '#333', fontWeight: '500' },
  stopButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  stopButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  infoBox: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: '#FFEBEE',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  infoTitle: { fontSize: 14, fontWeight: 'bold', color: '#C62828', marginBottom: 5 },
  infoText: { fontSize: 12, color: '#C62828', lineHeight: 18 },
});

export default MapScreen;