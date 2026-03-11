// screens/EditProfileScreen.js
// Fixed Image Upload Issue

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { getCurrentUserId } from '../services/firebaseAuthService';
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
  const [newImageUri, setNewImageUri] = useState(null);
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
          'Gallery access permission লাগবে profile picture upload করতে।'
        );
      }
    }
  };

  const loadUserProfile = async () => {
    const userId = getCurrentUserId();
    const result = await getUserProfile(userId);

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
      // Request permission first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Gallery access permission লাগবে।'
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setNewImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Pick image error:', error);
      Alert.alert('Error', 'Failed to pick image। আবার try করুন।');
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Picture',
      'Profile picture remove করবেন?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setNewImageUri(null);
            setProfileImage('');
          }
        }
      ]
    );
  };

  const validatePhone = (phone) => {
    if (!phone) return true; // Optional field
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  };

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Name দিন');
      return;
    }

    if (phoneNumber && !validatePhone(phoneNumber)) {
      Alert.alert('Error', 'Valid phone number দিন (10-11 digits)');
      return;
    }

    if (!gender) {
      Alert.alert('Error', 'Gender select করুন');
      return;
    }

    setSaving(true);

    try {
      const userId = getCurrentUserId();
      let imageUrl = profileImage;

      // Upload new image if selected
      if (newImageUri) {
        setUploading(true);
        const uploadResult = await uploadProfileImage(userId, newImageUri);
        setUploading(false);

        if (uploadResult.success) {
          imageUrl = uploadResult.url;
        } else {
          Alert.alert('Warning', 'Image upload failed, but profile will be updated');
        }
      }

      // Delete old image if removed
      if (!newImageUri && !profileImage && userData.profileImage) {
        await deleteProfileImage(userId, userData.profileImage);
      }

      // Update profile
      const updates = {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        gender: gender,
        profileImage: imageUrl
      };

      const result = await updateUserProfile(userId, updates);

      if (result.success) {
        Alert.alert(
          'Success',
          'Profile updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Profile Picture */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            {(newImageUri || profileImage) ? (
              <Image
                source={{ uri: newImageUri || profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>
                  {name ? name[0].toUpperCase() : '?'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.imageButtons}>
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={pickImage}
              disabled={uploading}
            >
              <Text style={styles.changeImageButtonText}>
                {uploading ? 'Uploading...' : '📷 Change Picture'}
              </Text>
            </TouchableOpacity>

            {(newImageUri || profileImage) && (
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeImage}
                disabled={uploading}
              >
                <Text style={styles.removeImageButtonText}>🗑️ Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          {uploading && (
            <ActivityIndicator size="small" color="#FF3B30" style={{ marginTop: 10 }} />
          )}
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          {/* Username (Read-only) */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>👤 Username (Cannot change)</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>@{userData?.username}</Text>
            </View>
          </View>

          {/* Name */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>✏️ Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>📞 Phone Number (Optional)</Text>
            <View style={styles.phoneInputContainer}>
              <Text style={styles.countryCode}>+880</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="1234567890"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={11}
              />
            </View>
            <Text style={styles.helperText}>
              ⚠️ Phone number সব users দেখতে পারবে (emergency contact)
            </Text>
          </View>

          {/* Gender */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>⚧ Gender</Text>
            <View style={styles.genderContainer}>
              {['Male', 'Female', 'Other'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderButton, gender === g && styles.genderButtonActive]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.genderButtonText, gender === g && styles.genderButtonTextActive]}>
                    {g === 'Male' ? '👨' : g === 'Female' ? '👩' : '⚧'} {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Email (Read-only) */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>📧 Email (Cannot change)</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>{userData?.email}</Text>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving || uploading}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>💾 Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyTitle}>🔒 Privacy Notice</Text>
          <Text style={styles.privacyText}>
            Name, phone number, এবং profile picture সব authenticated users দেখতে পারবে emergency help এর জন্য।
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 30 },
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
  imageSection: { alignItems: 'center', paddingVertical: 30 },
  imageContainer: { marginBottom: 20 },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FF3B30',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FF3B30',
  },
  imagePlaceholderText: { fontSize: 48, color: '#999', fontWeight: 'bold' },
  imageButtons: { flexDirection: 'row', gap: 10 },
  changeImageButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  changeImageButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  removeImageButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  removeImageButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  formSection: { paddingHorizontal: 20 },
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
  readOnlyInput: {
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#F5F5F5',
  },
  readOnlyText: { fontSize: 16, color: '#666' },
  phoneInputContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  countryCode: {
    padding: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#F5F5F5',
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
  },
  phoneInput: { flex: 1, padding: 15, fontSize: 16, color: '#000' },
  helperText: { fontSize: 12, color: '#FF9500', marginTop: 5, fontStyle: 'italic' },
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
  saveButton: {
    backgroundColor: '#FF3B30',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: { backgroundColor: '#FFB3AE', elevation: 0 },
  saveButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  privacyNotice: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  privacyTitle: { fontSize: 14, fontWeight: 'bold', color: '#1976D2', marginBottom: 5 },
  privacyText: { fontSize: 12, color: '#666', lineHeight: 18 },
});

export default EditProfileScreen;