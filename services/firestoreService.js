// services/firestoreService.js
// Complete Firestore Service with Username Support

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  getDocs,
  limit,
  orderBy,
  addDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// USERNAME MANAGEMENT
// ============================================

export const checkUsernameAvailability = async (username) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);

    return querySnapshot.empty; // true if available

  } catch (error) {
    console.error('Check username error:', error);
    return false;
  }
};

export const searchUserByUsername = async (username) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: 'User not found' };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = { id: userDoc.id, ...userDoc.data() };

    return { success: true, data: userData };

  } catch (error) {
    console.error('Search username error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// GET ALL USERS (Sorted by Registration Date)
// ============================================

export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('accountCreatedAt', 'asc')); // Oldest first
    
    const querySnapshot = await getDocs(q);
    const users = [];

    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: users };

  } catch (error) {
    console.error('Get all users error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// SUBSCRIBE TO ALL USERS (Real-time)
// ============================================

export const subscribeToAllUsers = (callback) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('accountCreatedAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const users = [];
    
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    callback({ success: true, data: users });
  }, (error) => {
    callback({ success: false, error: error.message });
  });
};

// ============================================
// USER PROFILE MANAGEMENT
// ============================================

export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Check if username already exists
    const usernameExists = await checkUsernameAvailability(userData.username);
    
    if (!usernameExists) {
      return {
        success: false,
        error: 'Username already taken'
      };
    }

    const profileData = {
      ...userData,
      phoneNumber: userData.phoneNumber || '',
      profileImage: userData.profileImage || '',
      helpingScore: 0,
      totalHelped: 0,
      lastHelped: null,
      isOnline: true,
      lastSeen: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      accountCreatedAt: Date.now() // For sorting
    };

    await setDoc(userRef, profileData);
    
    // Cache locally
    await AsyncStorage.setItem('currentUser', JSON.stringify(profileData));
    
    return { success: true, data: profileData };
  } catch (error) {
    console.error('Create profile error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }

    const userData = { id: userSnap.id, ...userSnap.data() };
    
    // Cache locally
    await AsyncStorage.setItem(`user_${userId}`, JSON.stringify(userData));
    
    return { success: true, data: userData };
  } catch (error) {
    console.error('Get profile error:', error);
    
    // Try local cache
    const cached = await AsyncStorage.getItem(`user_${userId}`);
    if (cached) {
      return { success: true, data: JSON.parse(cached), fromCache: true };
    }
    
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    await updateDoc(userRef, updateData);
    
    // Update local cache
    const current = await AsyncStorage.getItem('currentUser');
    if (current) {
      const userData = JSON.parse(current);
      const updated = { ...userData, ...updates };
      await AsyncStorage.setItem('currentUser', JSON.stringify(updated));
    }
    
    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// PROFILE IMAGE UPLOAD
// ============================================

export const uploadProfileImage = async (userId, imageUri) => {
  try {
    // Convert image URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Create storage reference
    const imageRef = ref(storage, `profile_images/${userId}_${Date.now()}.jpg`);

    // Upload image
    await uploadBytes(imageRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(imageRef);

    // Update user profile
    await updateUserProfile(userId, { profileImage: downloadURL });

    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Upload image error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteProfileImage = async (userId, imageUrl) => {
  try {
    if (!imageUrl) return { success: true };

    // Extract path from URL
    const imageRef = ref(storage, imageUrl);
    
    // Delete from storage
    await deleteObject(imageRef);

    // Update user profile
    await updateUserProfile(userId, { profileImage: '' });

    return { success: true };
  } catch (error) {
    console.error('Delete image error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// REAL-TIME USER PRESENCE
// ============================================

export const setUserOnlineStatus = async (userId, isOnline) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      isOnline,
      lastSeen: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Set online status error:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToUserPresence = (userId, callback) => {
  const userRef = doc(db, 'users', userId);
  
  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ success: true, data: snapshot.data() });
    }
  }, (error) => {
    callback({ success: false, error: error.message });
  });
};

// ============================================
// HELP REQUEST MANAGEMENT
// ============================================

export const createHelpRequest = async (requestData) => {
  try {
    const helpRequestsRef = collection(db, 'helpRequests');
    
    const request = {
      ...requestData,
      status: 'active',
      helpers: [],
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    };

    const docRef = await addDoc(helpRequestsRef, request);

    return { success: true, requestId: docRef.id, data: request };
  } catch (error) {
    console.error('Create help request error:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToNearbyHelpRequests = (userLocation, radius, callback) => {
  const helpRequestsRef = collection(db, 'helpRequests');
  const q = query(
    helpRequestsRef,
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const requests = [];
    
    snapshot.forEach((doc) => {
      const data = { id: doc.id, ...doc.data() };
      
      if (userLocation && data.location) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          data.location.latitude,
          data.location.longitude
        );
        
        if (distance <= radius) {
          requests.push({ ...data, distance });
        }
      } else {
        requests.push(data);
      }
    });

    callback({ success: true, data: requests });
  }, (error) => {
    callback({ success: false, error: error.message });
  });
};

export const acceptHelpRequest = async (requestId, helperId, helperName) => {
  try {
    const requestRef = doc(db, 'helpRequests', requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      return { success: false, error: 'Request not found' };
    }

    const helpers = requestSnap.data().helpers || [];
    
    if (!helpers.find(h => h.id === helperId)) {
      helpers.push({
        id: helperId,
        name: helperName,
        acceptedAt: serverTimestamp()
      });

      await updateDoc(requestRef, { helpers });
    }

    return { success: true };
  } catch (error) {
    console.error('Accept help error:', error);
    return { success: false, error: error.message };
  }
};

export const completeHelpRequest = async (requestId, helperId) => {
  try {
    const requestRef = doc(db, 'helpRequests', requestId);
    
    await updateDoc(requestRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
      completedBy: helperId
    });

    // Update helper's score
    const helperRef = doc(db, 'users', helperId);
    const helperSnap = await getDoc(helperRef);
    
    if (helperSnap.exists()) {
      const currentScore = helperSnap.data().helpingScore || 0;
      const totalHelped = helperSnap.data().totalHelped || 0;
      
      await updateDoc(helperRef, {
        helpingScore: currentScore + 10,
        totalHelped: totalHelped + 1,
        lastHelped: serverTimestamp()
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Complete help error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// REAL-TIME LOCATION TRACKING
// ============================================

export const updateUserLocation = async (userId, location) => {
  try {
    const locationRef = doc(db, 'liveLocations', userId);
    
    await setDoc(locationRef, {
      userId,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy || null,
      heading: location.heading || null,
      speed: location.speed || null,
      timestamp: serverTimestamp(),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Update location error:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToLiveLocations = (callback) => {
  const locationsRef = collection(db, 'liveLocations');
  
  return onSnapshot(locationsRef, (snapshot) => {
    const locations = [];
    
    snapshot.forEach((doc) => {
      locations.push({ id: doc.id, ...doc.data() });
    });

    callback({ success: true, data: locations });
  }, (error) => {
    callback({ success: false, error: error.message });
  });
};

export const removeLiveLocation = async (userId) => {
  try {
    const locationRef = doc(db, 'liveLocations', userId);
    await deleteDoc(locationRef);
    
    return { success: true };
  } catch (error) {
    console.error('Remove location error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// REAL-TIME CHAT
// ============================================

export const sendMessage = async (chatId, senderId, senderName, message) => {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    
    const messageData = {
      senderId,
      senderName,
      message,
      timestamp: serverTimestamp(),
      read: false
    };

    await addDoc(messagesRef, messageData);

    // Update chat metadata
    const chatRef = doc(db, 'chats', chatId);
    await setDoc(chatRef, {
      lastMessage: message,
      lastMessageTime: serverTimestamp(),
      lastSender: senderName
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Send message error:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToChat = (chatId, callback) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messages = [];
    
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    callback({ success: true, data: messages });
  }, (error) => {
    callback({ success: false, error: error.message });
  });
};

// ============================================
// REPORT & BLOCK SYSTEM
// ============================================

export const reportUser = async (reporterId, reportedUserId, reason) => {
  try {
    const reportsRef = collection(db, 'reports');
    
    await addDoc(reportsRef, {
      reporterId,
      reportedUserId,
      reason,
      status: 'pending',
      createdAt: serverTimestamp()
    });

    return { success: true, message: 'Report submitted successfully' };
  } catch (error) {
    console.error('Report user error:', error);
    return { success: false, error: error.message };
  }
};

export const blockUser = async (userId, blockedUserId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }

    const blockedUsers = userSnap.data().blockedUsers || [];
    
    if (!blockedUsers.includes(blockedUserId)) {
      blockedUsers.push(blockedUserId);
      await updateDoc(userRef, { blockedUsers });
    }

    return { success: true };
  } catch (error) {
    console.error('Block user error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getCurrentUserFromCache = async () => {
  try {
    const userData = await AsyncStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
};