const fs = require('fs');

const config = {
  name: 'Zero Trap',
  slug: 'zero-trap',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#FF3B30',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.zerotrap.emergency',
  },
  android: {
    package: 'com.zerotrap.emergency',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FF3B30',
    },
    permissions: [
      'ACCESS_COARSE_LOCATION',
      'ACCESS_FINE_LOCATION',
      'ACCESS_BACKGROUND_LOCATION',
      'CAMERA',
      'READ_MEDIA_IMAGES',
      'POST_NOTIFICATIONS',
      'INTERNET',
      'ACCESS_NETWORK_STATE',
      'WAKE_LOCK',
    ],
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'SET_VIA_BUILD_CONFIGURATION',
      },
    },
  },
  plugins: [
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'Zero Trap needs your location to provide emergency help to nearby users.',
        isAndroidBackgroundLocationEnabled: true,
        locationWhenInUsePermission:
          'Zero Trap needs your location to show nearby helpers during emergencies.',
      },
    ],
    [
      'expo-notifications',
      {
        color: '#FF3B30',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'Zero Trap needs access to your photos to update your profile picture.',
        cameraPermission: 'Zero Trap needs camera access to take profile pictures.',
      },
    ],
    'expo-asset',
  ],
  extra: {
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || 'SET_VIA_EAS_CONFIGURATION',
    },
  },
};

if (fs.existsSync('./google-services.json')) {
  config.android.googleServicesFile = './google-services.json';
}

module.exports = { expo: config };
