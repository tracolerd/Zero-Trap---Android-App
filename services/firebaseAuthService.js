// services/firebaseAuthService.js
// Authentication Service with Username Support

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  setUserOnlineStatus
} from './firestoreService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// REGISTER with Email + Username
// ============================================

export const registerWithEmail = async (email, password, name, username, gender) => {
  try {
    // Validate Gmail only
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return {
        success: false,
        error: 'শুধুমাত্র Gmail address দিয়ে register করতে পারবেন (@gmail.com)'
      };
    }

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    // Send email verification
    await sendEmailVerification(user);

    // Create Firestore profile with username
    const userData = {
      userId: user.uid,
      username: username.toLowerCase(),
      name: name,
      email: email,
      phoneNumber: '',
      gender: gender,
      profileImage: '',
      emailVerified: false,
      registerMethod: 'gmail',
      helpingScore: 0,
      totalHelped: 0,
      lastHelped: null,
      isOnline: true,
      blockedUsers: [],
      registeredAt: new Date().toISOString(),
      accountCreatedAt: Date.now() // For sorting
    };

    // Save to Firestore
    const result = await createUserProfile(user.uid, userData);

    if (!result.success) {
      // Rollback: Delete auth user if Firestore fails
      await user.delete();
      return {
        success: false,
        error: 'Failed to create profile. Please try again.'
      };
    }

    return {
      success: true,
      userData: result.data,
      message: '✅ Account তৈরি হয়েছে!\n\n📧 Verification email পাঠানো হয়েছে। Inbox check করুন।'
    };

  } catch (error) {
    console.error('Register error:', error);

    let errorMessage = 'Registration failed। আবার try করুন।';

    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'এই Gmail address দিয়ে already একটি account আছে। Login করুন।';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password কমপক্ষে 6 character হতে হবে।';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid Gmail address। সঠিক Gmail দিন।';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// ============================================
// LOGIN with Email + Sync Firestore
// ============================================

export const loginWithEmail = async (email, password) => {
  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user profile from Firestore
    const profileResult = await getUserProfile(user.uid);

    if (!profileResult.success) {
      return {
        success: false,
        error: 'Profile not found। Support এ contact করুন।'
      };
    }

    const userData = profileResult.data;

    // Update online status
    await setUserOnlineStatus(user.uid, true);

    // Update local cache
    await AsyncStorage.setItem('currentUser', JSON.stringify({
      ...userData,
      emailVerified: user.emailVerified
    }));

    return {
      success: true,
      userData: userData,
      emailVerified: user.emailVerified
    };

  } catch (error) {
    console.error('Login error:', error);

    let errorMessage = 'Login failed। আবার try করুন।';

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'এই email দিয়ে কোনো account নেই। Register করুন।';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Password ভুল হয়েছে। আবার try করুন।';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address।';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'অনেকবার ভুল password দিয়েছেন। কিছুক্ষণ পর try করুন।';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error। Internet connection check করুন।';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// ============================================
// AUTH STATE LISTENER
// ============================================

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User signed in
      const profileResult = await getUserProfile(user.uid);
      
      if (profileResult.success) {
        await setUserOnlineStatus(user.uid, true);
        callback({
          isAuthenticated: true,
          user: profileResult.data
        });
      }
    } else {
      // User signed out
      await AsyncStorage.removeItem('currentUser');
      callback({
        isAuthenticated: false,
        user: null
      });
    }
  });
};

// ============================================
// SIGN OUT + Update Status
// ============================================

export const signOut = async () => {
  try {
    const user = auth.currentUser;
    
    if (user) {
      // Set offline before signing out
      await setUserOnlineStatus(user.uid, false);
    }

    await firebaseSignOut(auth);
    await AsyncStorage.removeItem('currentUser');

    return {
      success: true,
      message: 'Signed out successfully'
    };

  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: 'Sign out failed'
    };
  }
};

// ============================================
// PASSWORD RESET
// ============================================

export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);

    return {
      success: true,
      message: '✅ Password reset link পাঠানো হয়েছে!\n\nEmail inbox check করুন।'
    };

  } catch (error) {
    console.error('Password reset error:', error);

    let errorMessage = 'Failed to send reset email।';

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'এই email দিয়ে কোনো account নেই।';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address।';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// ============================================
// EMAIL VERIFICATION
// ============================================

export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      return {
        success: false,
        error: 'No user logged in'
      };
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: 'Email already verified!'
      };
    }

    await sendEmailVerification(user);

    return {
      success: true,
      message: '✅ Verification email পাঠানো হয়েছে! Inbox check করুন।'
    };

  } catch (error) {
    console.error('Resend verification error:', error);
    return {
      success: false,
      error: 'Failed to send verification email।'
    };
  }
};

export const checkEmailVerification = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      return { verified: false };
    }

    // Reload user to get latest status
    await user.reload();

    // Update Firestore if verified
    if (user.emailVerified) {
      await updateUserProfile(user.uid, { emailVerified: true });
    }

    return {
      verified: user.emailVerified
    };

  } catch (error) {
    console.error('Check verification error:', error);
    return { verified: false };
  }
};

// ============================================
// DELETE ACCOUNT
// ============================================

export const deleteAccount = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      return {
        success: false,
        error: 'No user logged in'
      };
    }

    // Delete Firebase Auth user
    await user.delete();

    // Clear local storage
    await AsyncStorage.clear();

    return {
      success: true,
      message: '✅ Account permanently deleted'
    };

  } catch (error) {
    console.error('Delete account error:', error);

    if (error.code === 'auth/requires-recent-login') {
      return {
        success: false,
        error: 'Security purposes এর জন্য logout করে আবার login করুন, তারপর delete করুন।'
      };
    }

    return {
      success: false,
      error: 'Failed to delete account'
    };
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const validateGmail = (email) => {
  return email && email.toLowerCase().endsWith('@gmail.com');
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const getCurrentUserId = () => {
  return auth.currentUser?.uid || null;
};