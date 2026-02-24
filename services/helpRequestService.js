import { 
    collection, 
    doc, 
    setDoc, 
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    orderBy,
    limit
  } from 'firebase/firestore';
  import { db } from '../firebaseConfig';
  import { calculateDistance } from './locationService';
  
  // Create help request
  export const createHelpRequest = async (requestData) => {
    try {
      const requestId = `help_${Date.now()}`;
      
      await setDoc(doc(db, 'helpRequests', requestId), {
        ...requestData,
        requestId: requestId,
        status: 'active', // active, accepted, completed, cancelled
        createdAt: new Date().toISOString(),
        helpers: [],
        messages: []
      });
      
      return {
        success: true,
        requestId: requestId
      };
    } catch (error) {
      console.error('Error creating help request:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Get active help requests (for searching)
  export const getActiveHelpRequests = async (mode, currentLocation, maxDistance = 100) => {
    try {
      const q = query(
        collection(db, 'helpRequests'),
        where('mode', '==', mode),
        where('status', '==', 'active')
      );
      
      const querySnapshot = await getDocs(q);
      const requests = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Filter by distance for Bluetooth mode
        if (mode === 'bluetooth' && currentLocation) {
          const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            data.location.latitude,
            data.location.longitude
          );
          
          if (distance <= maxDistance) {
            requests.push({
              ...data,
              distance: distance
            });
          }
        } else {
          // Internet mode - show all
          requests.push(data);
        }
      });
      
      return {
        success: true,
        requests: requests
      };
    } catch (error) {
      console.error('Error getting help requests:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Listen to help requests in real-time
  export const subscribeToHelpRequests = (mode, currentLocation, callback, maxDistance = 100) => {
    try {
      const q = query(
        collection(db, 'helpRequests'),
        where('mode', '==', mode),
        where('status', '==', 'active')
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const requests = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Filter by distance for Bluetooth mode
          if (mode === 'bluetooth' && currentLocation) {
            const distance = calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              data.location.latitude,
              data.location.longitude
            );
            
            if (distance <= maxDistance) {
              requests.push({
                ...data,
                distance: distance
              });
            }
          } else {
            requests.push(data);
          }
        });
        
        callback(requests);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to help requests:', error);
      return null;
    }
  };
  
  // Accept help request (helper accepts to help)
  export const acceptHelpRequest = async (requestId, helperData) => {
    try {
      const requestRef = doc(db, 'helpRequests', requestId);
      const requestDoc = await getDoc(requestRef);
      
      if (!requestDoc.exists()) {
        return {
          success: false,
          error: 'Request not found'
        };
      }
      
      const currentHelpers = requestDoc.data().helpers || [];
      
      await updateDoc(requestRef, {
        helpers: [...currentHelpers, helperData],
        status: 'accepted'
      });
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error accepting help request:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Update help request location (real-time tracking)
  export const updateHelpRequestLocation = async (requestId, location) => {
    try {
      await updateDoc(doc(db, 'helpRequests', requestId), {
        location: location,
        lastUpdated: new Date().toISOString()
      });
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error updating location:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Complete help request
  export const completeHelpRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, 'helpRequests', requestId), {
        status: 'completed',
        completedAt: new Date().toISOString()
      });
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error completing help request:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Cancel help request
  export const cancelHelpRequest = async (requestId) => {
    try {
      await deleteDoc(doc(db, 'helpRequests', requestId));
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error cancelling help request:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Add message to help request
  export const addMessageToRequest = async (requestId, message) => {
    try {
      const requestRef = doc(db, 'helpRequests', requestId);
      const requestDoc = await getDoc(requestRef);
      
      if (!requestDoc.exists()) {
        return {
          success: false,
          error: 'Request not found'
        };
      }
      
      const currentMessages = requestDoc.data().messages || [];
      
      await updateDoc(requestRef, {
        messages: [
          ...currentMessages,
          {
            ...message,
            timestamp: new Date().toISOString()
          }
        ]
      });
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error adding message:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };