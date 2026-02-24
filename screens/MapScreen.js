import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Circle } from 'react-native-maps';
import {
  getCurrentLocation,
  startLocationTracking,
  stopLocationTracking,
  requestLocationPermission
} from '../services/locationService';
import {
  createHelpRequest,
  updateHelpRequestLocation,
  completeHelpRequest,
  cancelHelpRequest
} from '../services/helpRequestService';

// Notification Services Import
import {
  sendHelperAcceptedNotification,
  sendTaskCompleteNotification
} from '../services/notificationService';

const MapScreen = ({ route, navigation }) => {
  const { mode, requestId, isHelper } = route.params || { mode: 'internet', isHelper: false };
  
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState(requestId || null);
  const [helpers, setHelpers] = useState([]);
  
  const mapRef = useRef(null);
  const trackingSubscription = useRef(null);

  useEffect(() => {
    initializeMap();
    
    return () => {
      // Cleanup on unmount
      if (trackingSubscription.current) {
        stopLocationTracking(trackingSubscription.current);
      }
    };
  }, []);

  const initializeMap = async () => {
    // Request permission
    const permissionResult = await requestLocationPermission();
    
    if (!permissionResult.success) {
      Alert.alert('Permission Required', 'Location permission needed to continue', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      return;
    }

    // Get initial location
    const locationResult = await getCurrentLocation();
    
    if (locationResult.success) {
      setLocation(locationResult.location);
      setLoading(false);
      
      // If not a helper, create help request automatically
      if (!isHelper) {
        await createNewHelpRequest(locationResult.location);
      }
    } else {
      Alert.alert('Error', 'Could not get location', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      setLoading(false);
    }
  };

  const createNewHelpRequest = async (currentLocation) => {
    const requestData = {
      seekerName: 'User Name', // Replace with actual user name
      phoneNumber: '+8801707073812', // Replace with actual phone
      mode: mode,
      location: currentLocation,
      message: 'Need emergency help!',
      seekerId: 'user_id_123' // Replace with actual user ID
    };

    const result = await createHelpRequest(requestData);

    if (result.success) {
      setActiveRequestId(result.requestId);
      handleStartTracking(result.requestId);
    } else {
      Alert.alert('Error', 'Could not create help request');
    }
  };

  const handleStartTracking = async (reqId = activeRequestId) => {
    if (!reqId) return;
    
    setTracking(true);
    
    const result = await startLocationTracking((newLocation) => {
      setLocation(newLocation);
      
      // Update location in Firestore
      updateHelpRequestLocation(reqId, newLocation);
    });
    
    if (result.success) {
      trackingSubscription.current = result.subscription;
    }
  };

  const handleStopTracking = () => {
    if (trackingSubscription.current) {
      stopLocationTracking(trackingSubscription.current);
      trackingSubscription.current = null;
    }
    setTracking(false);
  };

  const handleTaskDone = () => {
    Alert.alert(
      'Complete Help',
      'সাহায্য সম্পূর্ণ হয়েছে?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            handleStopTracking();

            if (activeRequestId) {
              await completeHelpRequest(activeRequestId);
            }

            // Send completion notification
            const newScore = 15; // Calculate actual score
            await sendTaskCompleteNotification(newScore);

            Alert.alert(
              'Success! 🌟',
              isHelper
                ? '✅ ধন্যবাদ! আপনার helping score বৃদ্ধি পেয়েছে।'
                : '✅ সাহায্য সম্পূর্ণ হয়েছে। ধন্যবাদ!',
              [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
            );
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Request',
      'আপনি কি নিশ্চিত request cancel করতে চান?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            handleStopTracking();
            
            if (activeRequestId) {
              await cancelHelpRequest(activeRequestId);
            }
            
            navigation.goBack();
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
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Could not get location</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Current Location Marker */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={isHelper ? "Helper Location" : "Your Location"}
          description={isHelper ? "আপনি এখানে আছেন" : "আপনার অবস্থান"}
          pinColor={isHelper ? "#007AFF" : "#FF3B30"}
        />

        {/* Bluetooth Range Circle */}
        {mode === 'bluetooth' && !isHelper && (
          <Circle
            center={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            radius={100}
            strokeColor="rgba(255, 59, 48, 0.5)"
            fillColor="rgba(255, 59, 48, 0.1)"
          />
        )}

        {/* Helper Markers (dummy for now) */}
        {helpers.map((helper, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: helper.latitude,
              longitude: helper.longitude,
            }}
            title={helper.name}
            description="Helper"
            pinColor="#007AFF"
          />
        ))}
      </MapView>

      {/* Top Info Bar */}
      <View style={styles.topBar}>
        <View style={[
          styles.modeIndicator,
          isHelper && styles.helperModeIndicator
        ]}>
          <Text style={styles.modeText}>
            {isHelper ? '💙 Helping Mode' : (mode === 'bluetooth' ? '📡 Bluetooth' : '🌐 Internet')}
          </Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Control Panel */}
      <View style={styles.controlPanel}>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text style={[styles.statusValue, tracking && styles.statusValueActive]}>
              {tracking ? '📍 Tracking' : '⏸️ Paused'}
            </Text>
          </View>
          
          {!isHelper && (
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Helpers:</Text>
              <Text style={styles.statusValue}>{helpers.length}</Text>
            </View>
          )}
        </View>

        {!isHelper && !tracking && (
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={() => handleStartTracking()}
          >
            <Text style={styles.startButtonText}>▶️ Start Tracking</Text>
          </TouchableOpacity>
        )}

        {tracking && (
          <View style={styles.trackingActions}>
            <TouchableOpacity 
              style={styles.pauseButton} 
              onPress={handleStopTracking}
            >
              <Text style={styles.pauseButtonText}>⏸️ Pause</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.doneButton} 
              onPress={handleTaskDone}
            >
              <Text style={styles.doneButtonText}>✓ Task Done</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel Request</Text>
        </TouchableOpacity>

        {!isHelper && (
          <Text style={styles.infoText}>
            💡 আপনার location real-time track হচ্ছে। Helpers আপনার location দেখতে পাবে।
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  modeIndicator: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  helperModeIndicator: {
    backgroundColor: '#007AFF',
  },
  modeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  controlPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statusItem: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  statusValueActive: {
    color: '#34C759',
  },
  startButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackingActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#FF9500',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  pauseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
});

export default MapScreen;