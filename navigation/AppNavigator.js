// navigation/AppNavigator.js
// FIXED - Removed NavigationContainer (only in App.js)

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import all screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SearchHelpScreen from '../screens/SearchHelpScreen';
import HelpChatScreen from '../screens/HelpChatScreen';
import MapScreen from '../screens/MapScreen';
import BluetoothSearchScreen from '../screens/BluetoothSearchScreen';
import HelpHistoryScreen from '../screens/HelpHistoryScreen';
import AllUsersScreen from '../screens/AllUsersScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import DeveloperInfoScreen from '../screens/DeveloperInfoScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

const Stack = createStackNavigator();

const AppNavigator = ({ initialRoute = 'Splash' }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress,
          },
        }),
      }}
    >
      {/* Auth Screens */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

      {/* Main Screens */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />

      {/* Help Screens */}
      <Stack.Screen name="SearchHelp" component={SearchHelpScreen} />
      <Stack.Screen name="HelpChat" component={HelpChatScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="BluetoothSearch" component={BluetoothSearchScreen} />
      <Stack.Screen name="HelpHistory" component={HelpHistoryScreen} />

      {/* Users Screens */}
      <Stack.Screen name="AllUsers" component={AllUsersScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />

      {/* Info Screens */}
      <Stack.Screen name="DeveloperInfo" component={DeveloperInfoScreen} />
      <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;