import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserData, clearUserData, updateUserData } from '../services/storageService';
import { sendLocalNotification } from '../services/notificationService';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    vibration: true,
    locationAlways: false,
    showOnMap: true,
    autoAccept: false,
  });

  const toggleSetting = async (key) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));

    if (key === 'notifications' && newValue) {
      await sendLocalNotification(
        '🔔 Notifications Enabled',
        'Zero Trap এর notifications চালু হয়েছে!'
      );
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Data',
      'সব local data মুছে ফেলা হবে। নিশ্চিত?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearUserData();
            Alert.alert('Success', 'Data cleared!', [
              { text: 'OK', onPress: () => navigation.replace('Login') }
            ]);
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Delete Account',
      'এই action permanent! আপনার সব data মুছে যাবে।',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'সত্যিই delete করবেন? এটি undo করা যাবে না!',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Delete',
                  style: 'destructive',
                  onPress: async () => {
                    await clearUserData();
                    Alert.alert('Deleted', 'Account সফলভাবে delete হয়েছে', [
                      { text: 'OK', onPress: () => navigation.replace('Login') }
                    ]);
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const SettingRow = ({ icon, title, subtitle, value, onToggle }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E5EA', true: '#FF3B30' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Notifications</Text>

          <SettingRow
            icon="📳"
            title="Push Notifications"
            subtitle="Help request alerts পাবেন"
            value={settings.notifications}
            onToggle={() => toggleSetting('notifications')}
          />
          <SettingRow
            icon="🔊"
            title="Sound"
            subtitle="Notification sound"
            value={settings.sound}
            onToggle={() => toggleSetting('sound')}
          />
          <SettingRow
            icon="📳"
            title="Vibration"
            subtitle="Vibrate on notification"
            value={settings.vibration}
            onToggle={() => toggleSetting('vibration')}
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Location</Text>

          <SettingRow
            icon="🗺️"
            title="Always Track Location"
            subtitle="Background এ location track করবে"
            value={settings.locationAlways}
            onToggle={() => toggleSetting('locationAlways')}
          />
          <SettingRow
            icon="👁️"
            title="Show on Map"
            subtitle="আপনাকে map এ দেখাবে"
            value={settings.showOnMap}
            onToggle={() => toggleSetting('showOnMap')}
          />
        </View>

        {/* Help Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤝 Help Settings</Text>

          <SettingRow
            icon="✅"
            title="Auto Accept Help"
            subtitle="Automatically help request accept করবে"
            value={settings.autoAccept}
            onToggle={() => toggleSetting('autoAccept')}
          />
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 Legal</Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Text style={styles.actionIcon}>🔒</Text>
            <Text style={styles.actionText}>Privacy Policy</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('TermsConditions')}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>Terms & Conditions</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Data & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗄️ Data & Privacy</Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleClearData}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
            <Text style={styles.actionText}>Clear Local Data</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRow, styles.deleteRow]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.actionIcon}>❌</Text>
            <Text style={[styles.actionText, styles.deleteText]}>
              Delete Account Permanently
            </Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Zero Trap v1.0.0</Text>
          <Text style={styles.appInfoSubtext}>Made with ❤️ for Bangladesh</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
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
  backButton: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF3B30',
    padding: 15,
    paddingBottom: 8,
    backgroundColor: '#FFF5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5E5',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 22,
    marginRight: 12,
    width: 30,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  actionIcon: {
    fontSize: 22,
    marginRight: 12,
    width: 30,
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  actionArrow: {
    fontSize: 16,
    color: '#999',
  },
  deleteRow: {
    backgroundColor: '#FFF5F5',
  },
  deleteText: {
    color: '#FF3B30',
  },
  appInfo: {
    alignItems: 'center',
    padding: 30,
  },
  appInfoText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 12,
    color: '#ccc',
  },
});

export default SettingsScreen;