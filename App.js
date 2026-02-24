import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import {
  requestNotificationPermission,
  setupNotificationListeners,
  removeNotificationListeners
} from './services/notificationService';

export default function App() {
  const listenersRef = useRef(null);

  useEffect(() => {
    setupNotifications();
    return () => {
      if (listenersRef.current) {
        removeNotificationListeners(listenersRef.current);
      }
    };
  }, []);

  const setupNotifications = async () => {
    const result = await requestNotificationPermission();
    if (result.success) {
      console.log('Notifications ready');
    }

    listenersRef.current = setupNotificationListeners(
      (notification) => {
        console.log('Notification received:', notification.request.content.data);
      },
      (response) => {
        console.log('Notification tapped:', response.notification.request.content.data);
      }
    );
  };

  return (
    <>
      <StatusBar style="auto" backgroundColor="#FF3B30" />
      <AppNavigator />
    </>
  );
}