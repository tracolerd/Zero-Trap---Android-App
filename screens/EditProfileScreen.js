// screens/EditProfileScreen.js
// Cloud-Synced Edit Profile with Image Upload

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { getCurrentUser } from '../services/firebaseAuthService';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  deleteProfileImage
} from '../services/firestoreService';

const EditProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [imageChanged, setImageChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadUserProfile();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera roll permission দরকার profile picture update করতে।'
        );
      }
    }
  };

  const loadUserProfile = async () => {
    const user = getCurrentUser();
    
    if (!user) {
      navigation.replace('Login');
      return;
    }

    const result = await getUserProfile(user.uid);
    
    if (result.success) {
      const data = result.data;
      setUserData(data);
      setName(data.name || '');
      setPhoneNumber(data.phoneNumber || '');
      setGender(data.gender || '');
      setProfileImage(data.profileImage || '');
    }
    
    setLoading(false);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        setImageChanged(true);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Profile Picture',
      'আপনি কি নিশ্চিত profile picture মুছতে চান?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setProfileImage('');
            setImageChanged(true);
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'নাম দিন');
      return;
    }

    if (!gender) {
      Alert.alert('Error', 'Gender select করুন');
      return;
    }

    // Validate phone number (optional but if provided, must be valid)
    if (phoneNumber.trim()) {
      const phoneRegex = /^[0-9]{10,11}$/;
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      if (!phoneRegex.test(cleanPhone)) {
        Alert.alert(
          'Invalid Phone Number',
          'সঠিক phone number দিন (10-11 digits)'
        );
        return;
      }
    }

    setSaving(true);

    const user = getCurrentUser();
    
    try {
      // Upload image if changed
      let imageUrl = profileImage;
      
      if (imageChanged) {
        if (profileImage && profileImage.startsWith('file://')) {
          // New image selected
          setUploading(true);
          const uploadResult = await uploadProfileImage(user.uid, profileImage);
          setUploading(false);
          
          if (uploadResult.success) {
            imageUrl = uploadResult.url;
          } else {
            throw new Error('Image upload failed');
          }
        } else if (!profileImage && userData.profileImage) {
          // Image removed
          await deleteProfileImage(user.uid, userData.profileImage);
          imageUrl = '';
        }
      }

      // Update profile
      const updates = {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        gender: gender,
        profileImage: imageUrl
      };

      const result = await updateUserProfile(user.uid, updates);

      if (result.success) {
        Alert.alert(
          '✅ সফল!',
          'Profile update হয়েছে!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('Save profile error:', error);
      Alert.alert('Error', 'Profile update failed। আবার try করুন।');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving || uploading}
        >
          <Text style={[styles.saveButton, (saving || uploading) && styles.saveButtonDisabled]}>
            {saving || uploading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Picture */}
        <View style={styles.profilePictureSection}>
          <TouchableOpacity onPress={pickImage}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profilePicture}
              />
            ) : (
              <View style={styles.profilePicturePlaceholder}>
                <Text style={styles.profilePicturePlaceholderText}>
                  {name ? name[0].toUpperCase() : '+'}
                </Text>
              </View>
            )}
            <View style={styles.cameraButton}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </TouchableOpacity>

          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator color="#FFFFFF" size="large" />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          )}

          {profileImage && (
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={removeImage}
            >
              <Text style={styles.removeImageText}>Remove Picture</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.imageHint}>
            Tap to change profile picture
          </Text>
        </View>

        {/* Name */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>👤 Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="আপনার নাম লিখুন"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>📱 Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>🇧🇩 +880</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="1XXXXXXXXX"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>
          <Text style={styles.phoneHint}>
            ⚠️ Emergency situations এ অন্যরা আপনার number দেখতে পারবে
          </Text>
        </View>

        {/* Gender */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>⚧ Gender *</Text>
          <View style={styles.genderContainer}>
            {['Male', 'Female', 'Other'].map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genderButton,
                  gender === g && styles.genderButtonActive
                ]}
                onPress={() => setGender(g)}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === g && styles.genderButtonTextActive
                  ]}
                >
                  {g === 'Male' ? '👨 Male' : g === 'Female' ? '👩 Female' : '⚧ Other'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyTitle}>🔒 Privacy & Safety</Text>
          <Text style={styles.privacyText}>
            • আপনার profile public হবে emergency help এর জন্য{'\n'}
            • Phone number শুধু active help requests এ দেখা যাবে{'\n'}
            • যেকোনো অপব্যবহার report/block করতে পারবেন{'\n'}
            • Account যেকোনো সময় delete করতে পারবেন
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButtonLarge, (saving || uploading) && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving || uploading}
        >
          {saving || uploading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonLargeText}>💾 Save Changes</Text>
          )}
        </TouchableOpacity>

        {/* Cloud Sync Info */}
        <View style={styles.cloudInfo}>
          <Text style={styles.cloudInfoText}>
            ☁️ সব changes cloud এ automatically save হবে
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: { marginTop: 10, fontSize: 14, color: '#666' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: { fontSize: 16, color: '#FF3B30', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  saveButton: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },
  saveButtonDisabled: { color: '#999' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  profilePictureSection: { alignItems: 'center', marginBottom: 30 },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FF3B30',
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  profilePicturePlaceholderText: {
    fontSize: 48,
    color: '#999',
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cameraIcon: { fontSize: 20 },
  uploadingOverlay: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: { color: '#FFFFFF', fontSize: 12, marginTop: 8 },
  removeImageButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FFE5E5',
    borderRadius: 15,
  },
  removeImageText: { fontSize: 12, color: '#FF3B30', fontWeight: '600' },
  imageHint: { fontSize: 12, color: '#999', marginTop: 8 },
  inputWrapper: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#000',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
  },
  countryCodeText: { fontSize: 15, color: '#333', fontWeight: '600' },
  phoneInput: { flex: 1, padding: 15, fontSize: 16, color: '#000' },
  phoneHint: { fontSize: 11, color: '#FF9500', marginTop: 5, fontStyle: 'italic' },
  genderContainer: { flexDirection: 'row', gap: 10 },
  genderButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  genderButtonActive: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  genderButtonText: { fontSize: 14, color: '#666', fontWeight: '600' },
  genderButtonTextActive: { color: '#FFFFFF' },
  privacyNotice: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  privacyTitle: { fontSize: 14, fontWeight: 'bold', color: '#1976D2', marginBottom: 8 },
  privacyText: { fontSize: 12, color: '#666', lineHeight: 20 },
  saveButtonLarge: {
    backgroundColor: '#FF3B30',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: { backgroundColor: '#FFB3AE', elevation: 0 },
  saveButtonLargeText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  cloudInfo: { alignItems: 'center', paddingVertical: 10 },
  cloudInfoText: { fontSize: 11, color: '#4CAF50', fontStyle: 'italic' },
});

export default EditProfileScreen;