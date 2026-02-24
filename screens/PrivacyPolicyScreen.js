import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Privacy Policy for Zero Trap</Text>
        <Text style={styles.date}>Last Updated: February 16, 2026</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          Welcome to Zero Trap ("we," "our," or "us"). This Privacy Policy explains how we collect, 
          use, disclose, and safeguard your information when you use our mobile application (the "App"). 
          Please read this privacy policy carefully.
        </Text>

        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.text}>
          We collect information that you provide directly to us:
        </Text>
        <Text style={styles.bulletPoint}>• Personal Information: Name, phone number, email address, gender</Text>
        <Text style={styles.bulletPoint}>• Profile Information: Profile picture (optional)</Text>
        <Text style={styles.bulletPoint}>• Location Data: GPS coordinates when seeking or providing help</Text>
        <Text style={styles.bulletPoint}>• Usage Data: App interactions, help requests, and responses</Text>

        <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use the collected information for:
        </Text>
        <Text style={styles.bulletPoint}>• Facilitating emergency help requests</Text>
        <Text style={styles.bulletPoint}>• Connecting help seekers with helpers</Text>
        <Text style={styles.bulletPoint}>• Real-time location tracking during active help sessions</Text>
        <Text style={styles.bulletPoint}>• Calculating helping scores and statistics</Text>
        <Text style={styles.bulletPoint}>• Improving app functionality and user experience</Text>

        <Text style={styles.sectionTitle}>4. Location Data</Text>
        <Text style={styles.text}>
          Our App requires location access to function properly. Location data is:
        </Text>
        <Text style={styles.bulletPoint}>• Only collected during active help sessions</Text>
        <Text style={styles.bulletPoint}>• Shared only with helpers who accept your request</Text>
        <Text style={styles.bulletPoint}>• Deleted after the help session is completed</Text>
        <Text style={styles.bulletPoint}>• Never sold to third parties</Text>

        <Text style={styles.sectionTitle}>5. Data Sharing</Text>
        <Text style={styles.text}>
          We share your information only in these circumstances:
        </Text>
        <Text style={styles.bulletPoint}>• With helpers who accept your help request (name, phone, location)</Text>
        <Text style={styles.bulletPoint}>• When required by law or legal process</Text>
        <Text style={styles.bulletPoint}>• To protect rights, property, or safety</Text>

        <Text style={styles.sectionTitle}>6. Data Security</Text>
        <Text style={styles.text}>
          We implement security measures including encryption, secure servers, and access controls 
          to protect your data. However, no method of transmission over the internet is 100% secure.
        </Text>

        <Text style={styles.sectionTitle}>7. Your Rights</Text>
        <Text style={styles.text}>You have the right to:</Text>
        <Text style={styles.bulletPoint}>• Access your personal information</Text>
        <Text style={styles.bulletPoint}>• Update or correct your information</Text>
        <Text style={styles.bulletPoint}>• Delete your account and associated data</Text>
        <Text style={styles.bulletPoint}>• Opt-out of location tracking (app will not function)</Text>

        <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
        <Text style={styles.text}>
          Our App is not intended for children under 13. We do not knowingly collect information 
          from children under 13.
        </Text>

        <Text style={styles.sectionTitle}>9. Changes to Privacy Policy</Text>
        <Text style={styles.text}>
          We may update this policy from time to time. We will notify you of any changes by 
          posting the new policy in the App.
        </Text>

        <Text style={styles.sectionTitle}>10. Contact Us</Text>
        <Text style={styles.text}>
          For questions about this Privacy Policy, contact us at:
        </Text>
        <Text style={styles.bulletPoint}>• Email: scrollfaiyaz@gmail.com</Text>
        <Text style={styles.bulletPoint}>• Developer: Faiyaz</Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Zero Trap - Emergency Help Network</Text>
          <Text style={styles.footerSubtext}>Made with ❤️ for Bangladesh</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
  },
});

export default PrivacyPolicyScreen;