// navigation/AppNavigator.js
// Complete Navigation with All Routes

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
import DeveloperInfoScreen from '../screens/DeveloperInfoScreen';
import TermsConditionsScreen from '../screens/TermsConditionsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

// NEW SCREENS
import AllUsersScreen from '../screens/AllUsersScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' }
        }}
      >
        {/* Authentication Flow */}
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
        />
        
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
        />
        
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
        />
        
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen}
        />

        {/* Main App Flow */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
        />

        {/* Profile & Settings */}
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
        />
        
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen}
        />
        
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
        />

        {/* Help Features */}
        <Stack.Screen 
          name="SearchHelp" 
          component={SearchHelpScreen}
        />
        
        <Stack.Screen 
          name="HelpChat" 
          component={HelpChatScreen}
        />
        
        <Stack.Screen 
          name="Map" 
          component={MapScreen}
        />
        
        <Stack.Screen 
          name="BluetoothSearch" 
          component={BluetoothSearchScreen}
        />
        
        <Stack.Screen 
          name="HelpHistory" 
          component={HelpHistoryScreen}
        />

        {/* User Discovery - NEW */}
        <Stack.Screen 
          name="AllUsers" 
          component={AllUsersScreen}
          options={{
            title: 'All Users',
            headerShown: false
          }}
        />
        
        <Stack.Screen 
          name="UserProfile" 
          component={UserProfileScreen}
          options={{
            title: 'User Profile',
            headerShown: false
          }}
        />

        {/* Information Pages */}
        <Stack.Screen 
          name="DeveloperInfo" 
          component={DeveloperInfoScreen}
        />
        
        <Stack.Screen 
          name="TermsConditions" 
          component={TermsConditionsScreen}
        />
        
        <Stack.Screen 
          name="PrivacyPolicy" 
          component={PrivacyPolicyScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;