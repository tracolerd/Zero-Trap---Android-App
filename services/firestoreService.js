// services/firestoreService.js
// COMPLETE - All Firestore operations

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

// ============================================
// USERNAME OPERATIONS
// ============================================

export const checkUsernameAvailability = async (username) => {
  try {
    const cleanUsername = username.toLowerCase().trim();
    
    const usernameRef = doc(db, 'usernames', cleanUsername);
    const usernameSnap = await getDoc(usernameRef);
    
    const isAvailable = !usernameSnap.exists();
    
    console.log(`Username "${cleanUsername}" available:`, isAvailable);
    
    return {
      success: true,
      available: isAvailable
    };
  } catch (error) {
    console.error('Check username error:', error);
    return {
      success: false,
      available: false,
      error: error.message,
      code: error.code
    };
  }
};

export const createUsernameDocument = async (username, userId) => {
  try {
    const cleanUsername = username.toLowerCase().trim();
    
    const usernameRef = doc(db, 'usernames', cleanUsername);
    await setDoc(usernameRef, {
      userId: userId,
      createdAt: new Date().toISOString()
    });
    
    console.log('Username document created:', cleanUsername);
    
    return { success: true };
  } catch (error) {
    console.error('Create username document error:', error);
    return { success: false, error: error.message };
  }
};

export const searchUserByUsername = async (username) => {
  try {
    const cleanUsername = username.toLowerCase().trim();
    
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', cleanUsername), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: 'User not found' };
    }
    
    const userData = querySnapshot.docs[0].data();
    return { success: true, data: userData };
  } catch (error) {
    console.error('Search user error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// USER PROFILE OPERATIONS
// ============================================

export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const profileData = {
      userId: userId,
      name: userData.name || '',
      email: userData.email || '',
      username: userData.username ? userData.username.toLowerCase().trim() : '',
      phoneNumber: userData.phoneNumber || '',
      gender: userData.gender || '',
      profileImage: userData.profileImage || '',
      emailVerified: false,
      
      helpingScore: 0,
      totalHelped: 0,
      lastHelped: null,
      
      isOnline: false,
      lastSeen: null,
      blockedUsers: [],
      
      registeredAt: new Date().toISOString(),
      accountCreatedAt: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(userRef, profileData);
    
    console.log('User profile created:', userId);
    
    return { success: true, data: profileData };
  } catch (error) {
    console.error('Create user profile error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    if (!userId) {
      return { success: false, error: 'User ID required' };
    }
    
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log('User profile not found:', userId);
      return { success: false, error: 'User not found' };
    }
    
    const userData = userSnap.data();
    console.log('User profile loaded:', userData.username);
    
    return { success: true, data: userData };
  } catch (error) {
    console.error('Get user profile error:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(userRef, updateData);
    
    console.log('User profile updated:', userId);
    
    return { success: true };
  } catch (error) {
    console.error('Update user profile error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    
    console.log('User profile deleted:', userId);
    
    return { success: true };
  } catch (error) {
    console.error('Delete user profile error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// ALL USERS OPERATIONS
// ============================================

export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('accountCreatedAt', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    
    console.log('All users loaded:', users.length);
    
    return { success: true, data: users };
  } catch (error) {
    console.error('Get all users error:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToAllUsers = (callback) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('accountCreatedAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      
      console.log('Users updated:', users.length);
      callback({ success: true, data: users });
    }, (error) => {
      console.error('Subscribe to users error:', error);
      callback({ success: false, error: error.message });
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Subscribe to users error:', error);
    return () => {};
  }
};

// ============================================
// PROFILE IMAGE OPERATIONS
// ============================================

export const uploadProfileImage = async (userId, imageUri) => {
  try {
    console.log('Uploading image...');
    
    // Note: Storage requires Blaze plan
    // For now, return placeholder
    console.warn('Storage requires Blaze plan upgrade');
    
    return {
      success: false,
      error: 'Image upload requires Blaze plan. Please upgrade Firebase.'
    };
    
    // Uncomment when upgraded to Blaze:
    /*
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    const filename = `profile_images/${userId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    
    console.log('Image uploaded:', downloadURL);
    
    return { success: true, url: downloadURL };
    */
  } catch (error) {
    console.error('Upload image error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteProfileImage = async (userId, imageUrl) => {
  try {
    console.warn('Delete image requires Blaze plan');
    return { success: false };
    
    // Uncomment when upgraded to Blaze:
    /*
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    
    console.log('Image deleted');
    return { success: true };
    */
  } catch (error) {
    console.error('Delete image error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// ONLINE STATUS OPERATIONS
// ============================================

export const setUserOnlineStatus = async (userId, isOnline) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      isOnline: isOnline,
      lastSeen: new Date().toISOString()
    });
    
    console.log('Online status updated:', isOnline);
    
    return { success: true };
  } catch (error) {
    console.error('Set online status error:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToUserPresence = (userId, callback) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        callback({
          success: true,
          isOnline: userData.isOnline || false,
          lastSeen: userData.lastSeen
        });
      } else {
        callback({
          success: true,
          isOnline: false,
          lastSeen: null
        });
      }
    }, (error) => {
      console.error('Subscribe to presence error:', error);
      callback({ success: false, error: error.message });
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Subscribe to presence error:', error);
    return () => {};
  }
};

// ============================================
// HELP REQUEST OPERATIONS
// ============================================

export const createHelpRequest = async (userId, location, description = '') => {
  try {
    const requestRef = doc(collection(db, 'helpRequests'));
    
    const requestData = {
      requestId: requestRef.id,
      userId: userId,
      location: location,
      description: description,
      status: 'active',
      helpers: [],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour
    };
    
    await setDoc(requestRef, requestData);
    
    console.log('Help request created:', requestRef.id);
    
    return { success: true, requestId: requestRef.id };
  } catch (error) {
    console.error('Create help request error:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToNearbyHelpRequests = (userLocation, callback) => {
  try {
    const requestsRef = collection(db, 'helpRequests');
    const q = query(
      requestsRef,
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push(doc.data());
      });
      
      console.log('Help requests updated:', requests.length);
      callback({ success: true, data: requests });
    }, (error) => {
      console.error('Subscribe to help requests error:', error);
      callback({ success: false, error: error.message });
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Subscribe to help requests error:', error);
    return () => {};
  }
};

// ============================================
// LOCATION OPERATIONS
// ============================================

export const updateUserLocation = async (userId, location) => {
  try {
    const locationRef = doc(db, 'liveLocations', userId);
    
    const locationData = {
      userId: userId,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy || 0,
      heading: location.heading || 0,
      speed: location.speed || 0,
      timestamp: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(locationRef, locationData);
    
    return { success: true };
  } catch (error) {
    console.error('Update location error:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToLiveLocations = (callback) => {
  try {
    const locationsRef = collection(db, 'liveLocations');
    
    const unsubscribe = onSnapshot(locationsRef, (querySnapshot) => {
      const locations = [];
      querySnapshot.forEach((doc) => {
        locations.push({ id: doc.id, ...doc.data() });
      });
      
      callback({ success: true, data: locations });
    }, (error) => {
      console.error('Subscribe to locations error:', error);
      callback({ success: false, error: error.message });
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Subscribe to locations error:', error);
    return () => {};
  }
};

export const removeLiveLocation = async (userId) => {
  try {
    const locationRef = doc(db, 'liveLocations', userId);
    await deleteDoc(locationRef);
    
    console.log('Location removed:', userId);
    
    return { success: true };
  } catch (error) {
    console.error('Remove location error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// CHAT OPERATIONS
// ============================================

export const sendMessage = async (chatId, senderId, senderName, message) => {
  try {
    const messageRef = doc(collection(db, `chats/${chatId}/messages`));
    
    const messageData = {
      messageId: messageRef.id,
      senderId: senderId,
      senderName: senderName,
      message: message,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    await setDoc(messageRef, messageData);
    
    // Update chat metadata
    const chatRef = doc(db, 'chats', chatId);
    await setDoc(chatRef, {
      lastMessage: message,
      lastMessageTime: new Date().toISOString(),
      lastSender: senderId
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error('Send message error:', error);
    return { success: false, error: error.message };
  }
};

export const subscribeToChat = (chatId, callback) => {
  try {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      
      callback({ success: true, data: messages });
    }, (error) => {
      console.error('Subscribe to chat error:', error);
      callback({ success: false, error: error.message });
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Subscribe to chat error:', error);
    return () => {};
  }
};

// ============================================
// REPORT & BLOCK OPERATIONS
// ============================================

export const reportUser = async (reporterId, reportedUserId, reason) => {
  try {
    const reportRef = doc(collection(db, 'reports'));
    
    const reportData = {
      reportId: reportRef.id,
      reporterId: reporterId,
      reportedUserId: reportedUserId,
      reason: reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    await setDoc(reportRef, reportData);
    
    console.log('User reported');
    
    return { success: true };
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
      
      await updateDoc(userRef, {
        blockedUsers: blockedUsers
      });
    }
    
    console.log('User blocked');
    
    return { success: true };
  } catch (error) {
    console.error('Block user error:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// CACHE OPERATIONS
// ============================================

export const getCurrentUserFromCache = async () => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const cachedUser = await AsyncStorage.getItem('currentUser');
    
    if (cachedUser) {
      return { success: true, data: JSON.parse(cachedUser) };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Get cached user error:', error);
    return { success: false };
  }
};

export default {
  checkUsernameAvailability,
  createUsernameDocument,
  searchUserByUsername,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllUsers,
  subscribeToAllUsers,
  uploadProfileImage,
  deleteProfileImage,
  setUserOnlineStatus,
  subscribeToUserPresence,
  createHelpRequest,
  subscribeToNearbyHelpRequests,
  updateUserLocation,
  subscribeToLiveLocations,
  removeLiveLocation,
  sendMessage,
  subscribeToChat,
  reportUser,
  blockUser,
  getCurrentUserFromCache
};