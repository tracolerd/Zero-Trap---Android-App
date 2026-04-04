// services/firebaseAuthService.js
// COMPLETE FIX - Registration with username system

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebaseConfig';
import { removePushToken } from './notificationService';

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get current user ID
export const getCurrentUserId = () => {
  const user = auth.currentUser;
  return user ? user.uid : null;
};

// Check if username is available
export const checkUsernameAvailability = async (username) => {
  try {
    const cleanUsername = username.toLowerCase().trim();
    
    // Check in usernames collection
    const usernameRef = doc(db, 'usernames', cleanUsername);
    const usernameSnap = await getDoc(usernameRef);
    
    const isAvailable = !usernameSnap.exists();
    
    console.log(`Username "${cleanUsername}" availability:`, isAvailable);
    
    return {
      success: true,
      available: isAvailable
    };
  } catch (error) {
    console.error('Check username error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Create username document
const createUsernameDocument = async (username, userId) => {
  try {
    const cleanUsername = username.toLowerCase().trim();
    
    // Create username document
    const usernameRef = doc(db, 'usernames', cleanUsername);
    await setDoc(usernameRef, {
      userId: userId,
      createdAt: new Date().toISOString()
    });
    
    console.log('✅ Username document created:', cleanUsername);
    
    return { success: true };
  } catch (error) {
    console.error('Create username document error:', error);
    return { success: false, error: error.message };
  }
};

// Create user profile
const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const profileData = {
      userId: userId,
      name: userData.name,
      email: userData.email,
      username: userData.username.toLowerCase().trim(),
      phoneNumber: userData.phoneNumber || '',
      gender: userData.gender || '',
      profileImage: '',
      emailVerified: false,
      
      // Stats
      helpingScore: 0,
      totalHelped: 0,
      lastHelped: null,
      
      // Status
      isOnline: false,
      lastSeen: null,
      blockedUsers: [],
      
      // Timestamps
      registeredAt: new Date().toISOString(),
      accountCreatedAt: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(userRef, profileData);
    
    console.log('✅ User profile created:', userId);
    
    return { success: true };
  } catch (error) {
    console.error('Create user profile error:', error);
    return { success: false, error: error.message };
  }
};

// Register with email
export const registerWithEmail = async (email, password, name, username, gender) => {
  try {
    console.log('🔄 Starting registration...');
    console.log('Email:', email);
    console.log('Name:', name);
    console.log('Username:', username);
    console.log('Gender:', gender);

    // Validate inputs
    if (!email || !password || !name || !username) {
      return {
        success: false,
        error: 'All fields are required'
      };
    }

    // Validate email is Gmail
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return {
        success: false,
        error: 'Only Gmail accounts are allowed'
      };
    }

    // Validate username format
    const cleanUsername = username.toLowerCase().trim();
    if (cleanUsername.length < 3 || cleanUsername.length > 20) {
      return {
        success: false,
        error: 'Username must be 3-20 characters'
      };
    }

    // Check if username is available
    console.log('🔍 Checking username availability...');
    const usernameCheck = await checkUsernameAvailability(cleanUsername);
    
    if (!usernameCheck.success) {
      return {
        success: false,
        error: 'Failed to check username availability'
      };
    }

    if (!usernameCheck.available) {
      return {
        success: false,
        error: 'Username already taken'
      };
    }

    console.log('✅ Username available');

    // Create Firebase Auth user
    console.log('🔄 Creating Firebase Auth user...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Firebase Auth user created:', user.uid);

    try {
      // Update display name
      console.log('🔄 Updating display name...');
      await updateProfile(user, { displayName: name });
      console.log('✅ Display name updated');

      // Send email verification
      console.log('🔄 Sending verification email...');
      await sendEmailVerification(user);
      console.log('✅ Verification email sent');

      // Create username document
      console.log('🔄 Creating username document...');
      const usernameResult = await createUsernameDocument(cleanUsername, user.uid);
      
      if (!usernameResult.success) {
        throw new Error('Failed to create username document');
      }
      
      console.log('✅ Username document created');

      // Create user profile
      console.log('🔄 Creating user profile...');
      const profileResult = await createUserProfile(user.uid, {
        name,
        email,
        username: cleanUsername,
        phoneNumber: '',
        gender
      });

      if (!profileResult.success) {
        throw new Error('Failed to create user profile');
      }
      
      console.log('✅ User profile created');

      // Save to AsyncStorage
      await AsyncStorage.setItem('userId', user.uid);
      await AsyncStorage.setItem('userEmail', email);
      
      console.log('✅ Registration complete!');

      return {
        success: true,
        user: user,
        message: 'Registration successful! Please verify your email.'
      };

    } catch (error) {
      // Rollback: Delete the Firebase Auth user
      console.error('❌ Registration error, rolling back...');
      
      try {
        await deleteUser(user);
        console.log('✅ Rollback complete');
      } catch (deleteError) {
        console.error('❌ Rollback failed:', deleteError);
      }

      throw error;
    }

  } catch (error) {
    console.error('❌ Registration error:', error);

    let errorMessage = 'Registration failed';

    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email already registered';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Check your connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// Sign in with email
export const signInWithEmail = async (email, password) => {
  try {
    console.log('🔄 Signing in...');
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('✅ Signed in:', user.email);

    // Save to AsyncStorage
    await AsyncStorage.setItem('userId', user.uid);
    await AsyncStorage.setItem('userEmail', user.email);

    return {
      success: true,
      user: user
    };
  } catch (error) {
    console.error('❌ Sign in error:', error);

    let errorMessage = 'Login failed';

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email';
    } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorMessage = 'Incorrect email or password';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'Account has been disabled';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Check your connection.';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// Sign out
export const signOut = async () => {
  try {
    const uid = auth.currentUser?.uid;
    if (uid) {
      await removePushToken(uid).catch(() => {});
    }
    await firebaseSignOut(auth);
    
    // Clear AsyncStorage
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('currentUser');

    console.log('✅ Signed out');

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send password reset email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);

    return {
      success: true,
      message: 'Password reset email sent'
    };
  } catch (error) {
    console.error('Reset password error:', error);

    let errorMessage = 'Failed to send reset email';

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// Delete account
export const deleteAccount = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return {
        success: false,
        error: 'No user logged in'
      };
    }

    const userId = user.uid;

    // Get username before deleting
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const username = userSnap.exists() ? userSnap.data().username : null;

    // Delete username document
    if (username) {
      const usernameRef = doc(db, 'usernames', username);
      await deleteDoc(usernameRef);
    }

    // Delete user profile
    await deleteDoc(userRef);

    // Delete from Firebase Auth
    await deleteUser(user);

    // Clear AsyncStorage
    await AsyncStorage.clear();

    return { success: true };
  } catch (error) {
    console.error('Delete account error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  getCurrentUser,
  getCurrentUserId,
  checkUsernameAvailability,
  registerWithEmail,
  signInWithEmail,
  signOut,
  resetPassword,
  deleteAccount
};