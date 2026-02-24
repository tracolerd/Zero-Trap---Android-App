import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    query,
    where,
    getDocs 
  } from 'firebase/firestore';
  import { db } from '../firebaseConfig';
  
  // Create new user
  export const createUser = async (userId, userData) => {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...userData,
        createdAt: new Date().toISOString(),
        helpingScore: 0,
        lastHelped: null
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Get user data
  export const getUser = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        return {
          success: true,
          data: userDoc.data()
        };
      } else {
        return {
          success: false,
          error: 'User not found'
        };
      }
    } catch (error) {
      console.error('Error getting user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Update user data
  export const updateUser = async (userId, userData) => {
    try {
      await updateDoc(doc(db, 'users', userId), userData);
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Update helping score
  export const updateHelpingScore = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const currentScore = userDoc.data().helpingScore || 0;
        
        await updateDoc(doc(db, 'users', userId), {
          helpingScore: currentScore + 1,
          lastHelped: new Date().toISOString()
        });
        
        return { success: true };
      }
      
      return {
        success: false,
        error: 'User not found'
      };
    } catch (error) {
      console.error('Error updating score:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Check if user exists by phone
  export const checkUserByPhone = async (phoneNumber) => {
    try {
      const q = query(
        collection(db, 'users'), 
        where('phoneNumber', '==', phoneNumber)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return {
          success: true,
          exists: true,
          data: userDoc.data(),
          userId: userDoc.id
        };
      }
      
      return {
        success: true,
        exists: false
      };
    } catch (error) {
      console.error('Error checking user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };