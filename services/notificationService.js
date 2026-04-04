// services/notificationService.js
// Firebase Cloud Messaging - Real-time Push Notifications
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { db } from '../firebaseConfig';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

// ============================================
// REGISTER FOR PUSH NOTIFICATIONS
// ============================================

export const registerForPushNotifications = async (userId) => {
  try {
    if (!Device.isDevice) {
      console.log('Push notifications work only on physical devices');
      return { success: false, error: 'Not a physical device' };
    }

    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permission if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return { success: false, error: 'Permission not granted' };
    }

    // Get push token
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'a4292b6d-747f-46d3-8d5b-034b2608ddcd'
    });

    // Save token to Firestore (merge so it works if the profile row is still syncing)
    if (userId && token.data) {
      const userRef = doc(db, 'users', userId);
      await setDoc(
        userRef,
        {
          pushToken: token.data,
          pushTokenUpdatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    }

    // Configure Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('emergency', {
        name: 'Emergency Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF3B30',
        sound: 'default',
        enableVibrate: true,
        enableLights: true,
      });
    }

    return { success: true, token: token.data };

  } catch (error) {
    console.error('Push notification registration error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// SEND HELP REQUEST NOTIFICATION
// ============================================

export const sendHelpRequestNotification = async (
  targetUserIds,
  senderName,
  location,
  message
) => {
  try {
    // Get push tokens for target users
    const tokens = [];
    
    for (const userId of targetUserIds) {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists() && userDoc.data().pushToken) {
        tokens.push(userDoc.data().pushToken);
      }
    }

    if (tokens.length === 0) {
      return { success: false, error: 'No valid push tokens found' };
    }

    // Prepare notification payload
    const notifications = tokens.map(token => ({
      to: token,
      sound: 'default',
      title: '🚨 Emergency Help Request!',
      body: `${senderName} needs help nearby!\n${message}`,
      data: {
        type: 'help_request',
        senderName,
        location,
        timestamp: new Date().toISOString()
      },
      priority: 'high',
      channelId: 'emergency',
    }));

    // Send to Expo Push Notification service
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notifications),
    });

    const result = await response.json();
    
    return { success: true, data: result };

  } catch (error) {
    console.error('Send notification error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// SEND CHAT MESSAGE NOTIFICATION
// ============================================

export const sendChatNotification = async (
  recipientUserId,
  senderName,
  message
) => {
  try {
    // Get recipient's push token
    const userDoc = await getDoc(doc(db, 'users', recipientUserId));
    
    if (!userDoc.exists() || !userDoc.data().pushToken) {
      return { success: false, error: 'No push token found' };
    }

    const token = userDoc.data().pushToken;

    // Send notification
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        sound: 'default',
        title: `💬 ${senderName}`,
        body: message,
        data: {
          type: 'chat_message',
          senderName,
          timestamp: new Date().toISOString()
        },
        priority: 'high',
      }),
    });

    const result = await response.json();
    
    return { success: true };

  } catch (error) {
    console.error('Send chat notification error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// NOTIFICATION LISTENERS
// ============================================

export const setupNotificationListeners = (navigation) => {
  // Notification received while app is foregrounded
  const foregroundSubscription = Notifications.addNotificationReceivedListener(
    notification => {
      console.log('Notification received:', notification);
      
      // Custom handling for foreground notifications
      const data = notification.request.content.data;
      
      if (data.type === 'help_request') {
        // Show in-app alert or banner
        // Navigate to help request if needed
      }
    }
  );

  // Notification tapped (app opened from notification)
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    response => {
      const data = response.notification.request.content.data;
      
      if (data.type === 'help_request') {
        // Navigate to search help screen
        navigation.navigate('SearchHelp');
      } else if (data.type === 'chat_message') {
        // Navigate to chat screen
        navigation.navigate('HelpChat', {
          // Add necessary params
        });
      }
    }
  );

  // Return cleanup function
  return () => {
    foregroundSubscription.remove();
    responseSubscription.remove();
  };
};

// ============================================
// SCHEDULE LOCAL NOTIFICATION (For Testing)
// ============================================

export const scheduleTestNotification = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚨 Test Notification",
        body: 'Zero Trap notification system working!',
        data: { test: true },
      },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Schedule notification error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// GET NEARBY USERS FOR NOTIFICATION
// ============================================

export const getNearbyUserIds = async (currentLocation, radiusKm = 5) => {
  try {
    // This is a simplified version
    // Production should use GeoFirestore for efficient geoqueries
    
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const nearbyUserIds = [];
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      
      // Check if user has location and is online
      if (userData.isOnline && userData.lastLocation) {
        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          userData.lastLocation.latitude,
          userData.lastLocation.longitude
        );
        
        if (distance <= radiusKm) {
          nearbyUserIds.push(doc.id);
        }
      }
    });

    return { success: true, userIds: nearbyUserIds };

  } catch (error) {
    console.error('Get nearby users error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// ============================================
// REMOVE PUSH TOKEN (On Logout)
// ============================================

export const removePushToken = async (userId) => {
  try {
    if (!userId) return { success: false };

    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        pushToken: null,
        pushTokenUpdatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return { success: true };

  } catch (error) {
    console.error('Remove push token error:', error);
    return { success: false, error: error.message };
  }
};