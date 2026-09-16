import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_DATA_KEY = '@zero_trap_user_v2';

// Normalize phone number - handles all formats
export const normalizePhone = (phone) => {
  if (!phone) return '';
  let p = phone.toString().replace(/[\s\-\(\)\+]/g, '');
  if (p.startsWith('00880')) p = p.slice(5);
  else if (p.startsWith('0880')) p = p.slice(4);
  else if (p.startsWith('880')) p = p.slice(3);
  else if (p.startsWith('0')) p = p.slice(1);
  return '+880' + p;
};

// Save user data
export const saveUserData = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(USER_DATA_KEY, jsonValue);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user data
export const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    return null;
  }
};

// Update user data
export const updateUserData = async (updatedFields) => {
  try {
    const currentData = await getUserData();
    const newData = { ...currentData, ...updatedFields };
    await saveUserData(newData);
    return { success: true, data: newData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Clear user data
export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
    await AsyncStorage.removeItem('@zero_trap_user_data');
    await AsyncStorage.removeItem('@zero_trap_user');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Check if user is logged in
export const isUserLoggedIn = async () => {
  try {
    const userData = await getUserData();
    return userData !== null && userData.isLoggedIn === true;
  } catch (error) {
    return false;
  }
};

// Debug storage
export const debugStorage = async () => {
  try {
    const data = await getUserData();
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('All keys:', allKeys);
    console.log('Current data:', JSON.stringify(data, null, 2));
    return { data, allKeys };
  } catch (error) {
    return null;
  }
};