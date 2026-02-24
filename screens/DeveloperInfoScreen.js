import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DeveloperInfoScreen = ({ navigation }) => {
  const openURL = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open link');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Developer Info</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Developer Card */}
        <View style={styles.developerCard}>
          {/* তোমার আপলোড করা photo এখানে দেখাবে */}
          <Image 
          source={require('../assets/developer.jpg')} 
          style={styles.developerImage}
          />
          
          <Text style={styles.developerName}>Faiyaz</Text>
          <Text style={styles.developerRole}>Full Stack Developer</Text>
          <Text style={styles.developerEducation}>B.Sc. in Computer Science & Engineering</Text>
          <Text style={styles.developerInstitution}>East West University, Dhaka</Text>
          <Text style={styles.developerCollege}>Dhaka City College (DCC)</Text>
        </View>

        {/* About Project */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Zero Trap</Text>
          <Text style={styles.aboutText}>
            Zero Trap একটি Emergency Help Network যা মানুষদের জরুরি সময়ে একে অপরকে সাহায্য করতে সক্ষম করে। 
            এটি Bluetooth এবং Internet উভয় mode এ কাজ করে, যাতে offline/online যেকোনো সময় সাহায্য পাওয়া যায়।
          </Text>
        </View>

        {/* Tech Stack */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛠️ Tech Stack</Text>
          
          <View style={styles.techItem}>
            <Text style={styles.techIcon}>⚛️</Text>
            <Text style={styles.techText}>React Native + Expo</Text>
          </View>

          <View style={styles.techItem}>
            <Text style={styles.techIcon}>🔥</Text>
            <Text style={styles.techText}>Firebase (Auth + Firestore)</Text>
          </View>

          <View style={styles.techItem}>
            <Text style={styles.techIcon}>📍</Text>
            <Text style={styles.techText}>Google Maps + Location Services</Text>
          </View>

          <View style={styles.techItem}>
            <Text style={styles.techIcon}>📡</Text>
            <Text style={styles.techText}>Bluetooth Low Energy (BLE)</Text>
          </View>

          <View style={styles.techItem}>
            <Text style={styles.techIcon}>🔔</Text>
            <Text style={styles.techText}>Push Notifications</Text>
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect with Developer</Text>
          
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => openURL('https://www.facebook.com/share/17GKmEEseh/?mibextid=wwXIfr')}
          >
            <Text style={styles.socialIcon}>📘</Text>
            <Text style={styles.socialText}>Facebook</Text>
            <Text style={styles.socialArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => openURL('http://linkedin.com/in/nurul-faiyaz-6644a6283')}
          >
            <Text style={styles.socialIcon}>💼</Text>
            <Text style={styles.socialText}>LinkedIn</Text>
            <Text style={styles.socialArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => openURL('https://www.instagram.com/tracolerd?igsh=dmM1M2RoeGswcHp2&utm_source=qr')}
          >
            <Text style={styles.socialIcon}>📸</Text>
            <Text style={styles.socialText}>Instagram (@tracolerd)</Text>
            <Text style={styles.socialArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => openURL('mailto:scrollfaiyaz@gmail.com')}
          >
            <Text style={styles.socialIcon}>📧</Text>
            <Text style={styles.socialText}>Email</Text>
            <Text style={styles.socialArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={styles.versionSection}>
          <Text style={styles.versionTitle}>App Information</Text>
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Version:</Text>
            <Text style={styles.versionValue}>1.0.0</Text>
          </View>
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Build:</Text>
            <Text style={styles.versionValue}>Production</Text>
          </View>
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Platform:</Text>
            <Text style={styles.versionValue}>Android</Text>
          </View>
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Developer:</Text>
            <Text style={styles.versionValue}>Faiyaz</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for Bangladesh</Text>
          <Text style={styles.footerSubtext}>© 2026 Zero Trap. All rights reserved.</Text>
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
  developerCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  developerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FF3B30',
  },
  developerName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  developerRole: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
    marginBottom: 10,
  },
  developerEducation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
    textAlign: 'center',
  },
  developerInstitution: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 3,
  },
  developerCollege: {
    fontSize: 13,
    color: '#999',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  techIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  techText: {
    fontSize: 15,
    color: '#333',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 10,
  },
  socialIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  socialText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  socialArrow: {
    fontSize: 18,
    color: '#999',
  },
  versionSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 16,
  },
  versionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  versionLabel: {
    fontSize: 14,
    color: '#666',
  },
  versionValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    padding: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
  },
});

export default DeveloperInfoScreen;