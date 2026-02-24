// services/firebaseAuthService.js
// Firebase Email Authentication ONLY - Simple & FREE!

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { saveUserData, clearUserData } from './storageService';

// ============================================
// REGISTER with Email (Gmail)
// ============================================

export const registerWithEmail = async (email, password, name, gender) => {
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

    // Create user profile in Firestore
    const userData = {
      userId: user.uid,
      name: name,
      email: email,
      phoneNumber: '', // Optional - can add later in profile
      gender: gender,
      profileImage: '',
      emailVerified: false,
      registerMethod: 'gmail',
      helpingScore: 0,
      totalHelped: 0,
      lastHelped: null,
      registeredAt: new Date().toISOString(),
      isLoggedIn: true
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', user.uid), userData);

    // Save to local storage
    await saveUserData(userData);

    return {
      success: true,
      userData: userData,
      message: '✅ Account তৈরি হয়েছে!\n\n📧 Verification email পাঠানো হয়েছে। Email inbox check করুন।'
    };

  } catch (error) {
    console.error('Register error:', error);

    // User-friendly error messages
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
// LOGIN with Email
// ============================================

export const loginWithEmail = async (email, password) => {
  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      return {
        success: false,
        error: 'User data not found। Support এ contact করুন।'
      };
    }

    const userData = userDoc.data();
    userData.isLoggedIn = true;
    userData.emailVerified = user.emailVerified;

    // Save to local storage
    await saveUserData(userData);

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
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// ============================================
// RESEND Email Verification
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
// SIGN OUT
// ============================================

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    await clearUserData();

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
// DELETE ACCOUNT (Permanent)
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

    // Delete Firestore data
    await deleteDoc(doc(db, 'users', user.uid));

    // Delete Firebase Auth user
    await user.delete();

    // Clear local storage
    await clearUserData();

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
// CHECK EMAIL VERIFICATION STATUS
// ============================================

export const checkEmailVerification = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      return { verified: false };
    }

    // Reload user to get latest status
    await user.reload();

    return {
      verified: user.emailVerified
    };

  } catch (error) {
    console.error('Check verification error:', error);
    return { verified: false };
  }
};

// ============================================
// VALIDATE GMAIL
// ============================================

export const validateGmail = (email) => {
  return email && email.toLowerCase().endsWith('@gmail.com');
};