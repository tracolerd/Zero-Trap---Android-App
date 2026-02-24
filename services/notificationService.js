import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { updateUserData } from './storageService';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request notification permissions
export const requestNotificationPermission = async () => {
  try {
    if (!Device.isDevice) {
      console.log('Using emulator - skipping push token');
      return { success: true, token: 'emulator_token' };
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return { success: false, error: 'Notification permission denied' };
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    await updateUserData({ pushToken: token });

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('emergency', {
        name: 'Emergency Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF3B30',
        sound: true,
      });

      await Notifications.setNotificationChannelAsync('help_requests', {
        name: 'Help Requests',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF9500',
        sound: true,
      });

      await Notifications.setNotificationChannelAsync('general', {
        name: 'General',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    return { success: true, token };
  } catch (error) {
    console.error('Notification permission error:', error);
    return { success: false, error: error.message };
  }
};

// Send local notification
export const sendLocalNotification = async (title, body, data = {}, channelId = 'general') => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        channelId,
      },
      trigger: null,
    });
    return { success: true };
  } catch (error) {
    console.error('Send notification error:', error);
    return { success: false, error: error.message };
  }
};

// Send emergency notification
export const sendEmergencyNotification = async (seekerName, distance) => {
  return sendLocalNotification(
    '🚨 Emergency Help Needed!',
    `${seekerName} আপনার কাছে সাহায্য চাইছে! ${distance ? `(${distance} দূরে)` : ''}`,
    { type: 'emergency' },
    'emergency'
  );
};

// Send help request notification
export const sendHelpRequestNotification = async (seekerName) => {
  return sendLocalNotification(
    '🆘 New Help Request',
    `${seekerName} সাহায্য চাইছে। এখনই সাহায্য করুন!`,
    { type: 'help_request' },
    'help_requests'
  );
};

// Send helper accepted notification
export const sendHelperAcceptedNotification = async (helperName) => {
  return sendLocalNotification(
    '✅ Helper Found!',
    `${helperName} আপনাকে সাহায্য করতে আসছে!`,
    { type: 'helper_accepted' },
    'emergency'
  );
};

// Send task complete notification
export const sendTaskCompleteNotification = async (score) => {
  return sendLocalNotification(
    '🌟 Task Completed!',
    `সাহায্য সম্পন্ন হয়েছে! আপনার helping score: ${score}`,
    { type: 'task_complete' },
    'general'
  );
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Set up notification listeners
export const setupNotificationListeners = (onNotification, onNotificationResponse) => {
  const notificationListener = Notifications.addNotificationReceivedListener(onNotification);
  const responseListener = Notifications.addNotificationResponseReceivedListener(onNotificationResponse);
  return { notificationListener, responseListener };
};

// Remove notification listeners
export const removeNotificationListeners = (listeners) => {
  if (listeners?.notificationListener) {
    Notifications.removeNotificationSubscription(listeners.notificationListener);
  }
  if (listeners?.responseListener) {
    Notifications.removeNotificationSubscription(listeners.responseListener);
  }
};