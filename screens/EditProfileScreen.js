import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { updateUserData } from '../services/storageService';

const EditProfileScreen = ({ navigation, route }) => {
  const currentData = route.params?.userData || {};

  const [name, setName] = useState(currentData.name || '');
  const [email, setEmail] = useState(currentData.email || '');
  const [gender, setGender] = useState(currentData.gender || '');
  const [profileImage, setProfileImage] = useState(currentData.profileImage || null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery access permission দিন');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'আপনার নাম দিন');
      return;
    }

    if (!gender) {
      Alert.alert('Error', 'Gender সিলেক্ট করুন');
      return;
    }

    // Validate email if provided and if register method is phone
    if (email.trim() && currentData.registerMethod === 'phone') {
      if (!email.toLowerCase().endsWith('@gmail.com')) {
        Alert.alert('Error', 'শুধুমাত্র Gmail (@gmail.com) allowed');
        return;
      }
    }

    setLoading(true);

    try {
      const result = await updateUserData({
        name: name.trim(),
        email: email.trim(),
        gender,
        profileImage
      });

      setLoading(false);

      if (result.success) {
        Alert.alert('✅ Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            {loading
              ? <ActivityIndicator size="small" color="#FF3B30" />
              : <Text style={styles.saveTopButton}>Save</Text>
            }
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Profile Image */}
          <TouchableOpacity style={styles.imageContainer} onPress={handlePickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>
                  {name ? name[0].toUpperCase() : '📷'}
                </Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Tap to change photo</Text>

          {/* Name */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>👤 নাম *</Text>
            <TextInput
              style={styles.input}
              placeholder="আপনার পুরো নাম"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email (only if registered with phone) */}
          {currentData.registerMethod === 'phone' && (
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>📧 Gmail (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="your@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={styles.inputHint}>শুধুমাত্র @gmail.com supported</Text>
            </View>
          )}

          {/* Phone/Email display (readonly) */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>
              {currentData.registerMethod === 'gmail' ? '📧 Gmail' : '📱 Phone'}
            </Text>
            <View style={styles.readonlyInput}>
              <Text style={styles.readonlyText}>
                {currentData.registerMethod === 'gmail'
                  ? currentData.email
                  : currentData.phoneNumber}
              </Text>
              <Text style={styles.readonlyBadge}>🔒 Fixed</Text>
            </View>
            <Text style={styles.inputHint}>Login identifier পরিবর্তন করা যাবে না</Text>
          </View>

          {/* Gender */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>⚧ Gender *</Text>
            <View style={styles.genderContainer}>
              {['Male', 'Female', 'Other'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderButton, gender === g && styles.genderButtonActive]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                    {g === 'Male' ? '👨 Male' : g === 'Female' ? '👩 Female' : '🧑 Other'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.saveButtonText}>Save Changes ✅</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: { fontSize: 16, color: '#FF3B30', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  saveTopButton: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  scrollContent: { padding: 25, paddingBottom: 40 },
  imageContainer: { alignSelf: 'center', marginBottom: 8, position: 'relative' },
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
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFB3AE',
  },
  imagePlaceholderText: { fontSize: 46, color: '#FFFFFF', fontWeight: 'bold' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editBadgeText: { fontSize: 16 },
  changePhotoText: { textAlign: 'center', fontSize: 12, color: '#999', marginBottom: 25 },
  inputWrapper: { marginBottom: 18 },
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
  inputHint: { fontSize: 11, color: '#999', marginTop: 5, marginLeft: 4 },
  readonlyInput: {
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readonlyText: { fontSize: 15, color: '#666' },
  readonlyBadge: { fontSize: 12, color: '#999' },
  genderContainer: { flexDirection: 'row', gap: 10 },
  genderButton: {
    flex: 1,
    paddingVertical: 13,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  genderButtonActive: { borderColor: '#FF3B30', backgroundColor: '#FFE5E5' },
  genderText: { fontSize: 13, color: '#666', fontWeight: '600' },
  genderTextActive: { color: '#FF3B30' },
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
  buttonDisabled: { backgroundColor: '#FFB3AE', elevation: 0 },
  saveButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },
});

export default EditProfileScreen;