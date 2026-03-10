// screens/PrivacyPolicyScreen.js
// Complete Privacy Policy Screen

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicyScreen = ({ navigation }) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:support@zerotrap.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
      >
        {/* Last Updated */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>📅 Last Updated: March 11, 2026</Text>
          <Text style={styles.infoText}>📄 Version: 1.0.0</Text>
        </View>

        {/* Introduction */}
        <Text style={styles.sectionTitle}>Introduction</Text>
        <Text style={styles.paragraph}>
          Zero Trap is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
        </Text>

        {/* Information We Collect */}
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        
        <Text style={styles.subTitle}>Personal Information</Text>
        <Text style={styles.bulletPoint}>• Name: Your full name for identification</Text>
        <Text style={styles.bulletPoint}>• Email Address: Gmail for authentication</Text>
        <Text style={styles.bulletPoint}>• Username: Unique username for search</Text>
        <Text style={styles.bulletPoint}>• Phone Number: (Optional) For emergency contact</Text>
        <Text style={styles.bulletPoint}>• Gender: For profile information</Text>
        <Text style={styles.bulletPoint}>• Profile Picture: (Optional) Your uploaded image</Text>

        <Text style={styles.subTitle}>Location Data</Text>
        <Text style={styles.bulletPoint}>• Real-time Location: GPS coordinates during emergency</Text>
        <Text style={styles.bulletPoint}>• Location History: Temporary during help requests</Text>
        <Text style={styles.bulletPoint}>• Note: Tracking stops when emergency mode is disabled</Text>

        <Text style={styles.subTitle}>Usage Data</Text>
        <Text style={styles.bulletPoint}>• Help Requests: Records of help sought or provided</Text>
        <Text style={styles.bulletPoint}>• Chat Messages: Messages during assistance</Text>
        <Text style={styles.bulletPoint}>• Online Status: Real-time availability</Text>
        <Text style={styles.bulletPoint}>• Helping Score: Points earned by helping</Text>

        {/* How We Use Information */}
        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        
        <Text style={styles.subTitle}>Emergency Assistance</Text>
        <Text style={styles.bulletPoint}>• Connect you with nearby helpers</Text>
        <Text style={styles.bulletPoint}>• Display your location to authorized helpers</Text>
        <Text style={styles.bulletPoint}>• Facilitate real-time communication</Text>

        <Text style={styles.subTitle}>Account Management</Text>
        <Text style={styles.bulletPoint}>• Create and maintain your account</Text>
        <Text style={styles.bulletPoint}>• Authenticate your identity</Text>
        <Text style={styles.bulletPoint}>• Send verification emails</Text>

        <Text style={styles.subTitle}>Safety Features</Text>
        <Text style={styles.bulletPoint}>• Track help requests and completions</Text>
        <Text style={styles.bulletPoint}>• Maintain helping scores and statistics</Text>
        <Text style={styles.bulletPoint}>• Enable report and block functionality</Text>

        <Text style={styles.subTitle}>Notifications</Text>
        <Text style={styles.bulletPoint}>• Send emergency alerts to nearby users</Text>
        <Text style={styles.bulletPoint}>• Notify you of incoming help requests</Text>
        <Text style={styles.bulletPoint}>• Send chat messages</Text>

        {/* Public Information */}
        <Text style={styles.sectionTitle}>3. Public Information</Text>
        
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ Publicly Visible Information</Text>
          <Text style={styles.warningText}>
            The following information is PUBLIC to all authenticated users:
          </Text>
        </View>

        <Text style={styles.bulletPoint}>• Name</Text>
        <Text style={styles.bulletPoint}>• Username</Text>
        <Text style={styles.bulletPoint}>• Phone Number (if provided)</Text>
        <Text style={styles.bulletPoint}>• Gender</Text>
        <Text style={styles.bulletPoint}>• Profile Picture</Text>
        <Text style={styles.bulletPoint}>• Helping Score</Text>
        <Text style={styles.bulletPoint}>• Total People Helped</Text>
        <Text style={styles.bulletPoint}>• Online Status</Text>

        <View style={styles.reasonBox}>
          <Text style={styles.reasonTitle}>🎯 Why Public?</Text>
          <Text style={styles.reasonText}>
            This information is essential for emergency help coordination. Users need to see and contact nearby helpers quickly during emergencies.
          </Text>
        </View>

        {/* Information Sharing */}
        <Text style={styles.sectionTitle}>4. Information Sharing</Text>
        
        <View style={styles.emphasisBox}>
          <Text style={styles.emphasisText}>
            ✅ We DO NOT sell your personal information to third parties.
          </Text>
        </View>

        <Text style={styles.paragraph}>We may share your information only in these circumstances:</Text>
        <Text style={styles.bulletPoint}>• With Other Users: Public profile visible to authenticated users</Text>
        <Text style={styles.bulletPoint}>• Emergency Services: If legally required or to prevent harm</Text>
        <Text style={styles.bulletPoint}>• Service Providers: Firebase (Google) for hosting</Text>
        <Text style={styles.bulletPoint}>• Legal Requirements: When required by law</Text>

        {/* Data Storage */}
        <Text style={styles.sectionTitle}>5. Data Storage and Security</Text>
        
        <Text style={styles.subTitle}>Storage</Text>
        <Text style={styles.bulletPoint}>• All data stored on Firebase Cloud Firestore (Google Cloud)</Text>
        <Text style={styles.bulletPoint}>• Profile images on Firebase Storage</Text>
        <Text style={styles.bulletPoint}>• Data encrypted in transit and at rest</Text>

        <Text style={styles.subTitle}>Security Measures</Text>
        <Text style={styles.bulletPoint}>• Email verification required</Text>
        <Text style={styles.bulletPoint}>• Secure authentication via Firebase Auth</Text>
        <Text style={styles.bulletPoint}>• Regular security audits</Text>
        <Text style={styles.bulletPoint}>• Access control via security rules</Text>

        <Text style={styles.subTitle}>Data Retention</Text>
        <Text style={styles.bulletPoint}>• Account data: Until account deletion</Text>
        <Text style={styles.bulletPoint}>• Help requests: 30 days after completion</Text>
        <Text style={styles.bulletPoint}>• Chat messages: 90 days</Text>
        <Text style={styles.bulletPoint}>• Location data: Deleted when emergency ends</Text>

        {/* Your Rights */}
        <Text style={styles.sectionTitle}>6. Your Rights</Text>
        
        <Text style={styles.paragraph}>You have the right to:</Text>
        <Text style={styles.bulletPoint}>• Access: View all your personal data</Text>
        <Text style={styles.bulletPoint}>• Correction: Edit your profile information</Text>
        <Text style={styles.bulletPoint}>• Deletion: Delete your account permanently</Text>
        <Text style={styles.bulletPoint}>• Data Export: Request a copy of your data</Text>
        <Text style={styles.bulletPoint}>• Opt-out: Disable location tracking, notifications</Text>

        <Text style={styles.subTitle}>How to Exercise Your Rights</Text>
        <View style={styles.instructionBox}>
          <Text style={styles.instructionText}>• Edit Profile: Settings → Edit Profile</Text>
          <Text style={styles.instructionText}>• Delete Account: Settings → Delete Account</Text>
          <Text style={styles.instructionText}>• Export Data: Contact support</Text>
          <Text style={styles.instructionText}>• Disable Features: Settings → Preferences</Text>
        </View>

        {/* Location Tracking */}
        <Text style={styles.sectionTitle}>7. Location Tracking</Text>
        
        <Text style={styles.subTitle}>When We Track</Text>
        <Text style={styles.bulletPoint}>• Only when emergency mode is active</Text>
        <Text style={styles.bulletPoint}>• When you create a help request</Text>
        <Text style={styles.bulletPoint}>• When you're helping someone</Text>

        <Text style={styles.subTitle}>How to Control</Text>
        <Text style={styles.bulletPoint}>• Disable emergency mode to stop tracking</Text>
        <Text style={styles.bulletPoint}>• Location data deleted when session ends</Text>
        <Text style={styles.bulletPoint}>• Revoke location permissions anytime</Text>

        {/* Children's Privacy */}
        <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
        
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>🔞 Age Restriction</Text>
          <Text style={styles.alertText}>
            Zero Trap is not intended for children under 13. We do not knowingly collect information from children under 13.
          </Text>
        </View>

        {/* Third-Party Services */}
        <Text style={styles.sectionTitle}>9. Third-Party Services</Text>
        
        <Text style={styles.paragraph}>We use these third-party services:</Text>

        <View style={styles.serviceBox}>
          <Text style={styles.serviceTitle}>🔐 Firebase (Google)</Text>
          <Text style={styles.serviceText}>Purpose: Authentication, Data Storage, Hosting</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://firebase.google.com/support/privacy')}>
            <Text style={styles.serviceLink}>Privacy Policy →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.serviceBox}>
          <Text style={styles.serviceTitle}>📱 Expo</Text>
          <Text style={styles.serviceText}>Purpose: Push Notifications</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://expo.dev/privacy')}>
            <Text style={styles.serviceLink}>Privacy Policy →</Text>
          </TouchableOpacity>
        </View>

        {/* Report & Block */}
        <Text style={styles.sectionTitle}>10. Report and Block</Text>
        
        <Text style={styles.paragraph}>If you experience harassment or abuse:</Text>
        <Text style={styles.bulletPoint}>• Report: Report the user (reviewed by admin)</Text>
        <Text style={styles.bulletPoint}>• Block: Block the user (cannot contact you)</Text>
        <Text style={styles.bulletPoint}>• Contact: Email us at support@zerotrap.com</Text>

        {/* Changes to Policy */}
        <Text style={styles.sectionTitle}>11. Changes to Privacy Policy</Text>
        
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you of changes by posting the new Privacy Policy in the app and sending an email notification.
        </Text>

        {/* International Users */}
        <Text style={styles.sectionTitle}>12. International Users</Text>
        
        <Text style={styles.paragraph}>
          Your information may be transferred to and stored in countries outside Bangladesh, including the United States (Google Cloud servers). By using Zero Trap, you consent to this transfer.
        </Text>

        {/* Contact */}
        <Text style={styles.sectionTitle}>13. Contact Us</Text>
        
        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>📧 Get in Touch</Text>
          <Text style={styles.contactSubtitle}>If you have questions about this Privacy Policy:</Text>
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={styles.contactLink}>Email: support@zerotrap.com</Text>
          </TouchableOpacity>
          <Text style={styles.contactText}>Developer: Md. Tasrif Hossain</Text>
          <Text style={styles.contactText}>Address: Dhaka, Bangladesh</Text>
        </View>

        {/* Consent */}
        <Text style={styles.sectionTitle}>14. Consent</Text>
        
        <View style={styles.consentBox}>
          <Text style={styles.consentTitle}>✅ By using Zero Trap, you consent to:</Text>
          <Text style={styles.consentText}>• Collection and use of information as described</Text>
          <Text style={styles.consentText}>• Public visibility of specified profile information</Text>
          <Text style={styles.consentText}>• Location tracking during emergency mode</Text>
          <Text style={styles.consentText}>• Communication via email and push notifications</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Effective Date: March 11, 2026</Text>
          <Text style={styles.footerText}>Version: 1.0.0</Text>
          <Text style={styles.footerText}>Last Reviewed: March 11, 2026</Text>
          <Text style={styles.footerText}>Zero Trap © 2026</Text>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
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
    padding: 20,
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoText: {
    fontSize: 13,
    color: '#1976D2',
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 25,
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginLeft: 10,
    marginBottom: 6,
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 12,
    marginVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 6,
  },
  warningText: {
    fontSize: 13,
    color: '#856404',
    lineHeight: 20,
  },
  reasonBox: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 12,
    marginVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  reasonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
  },
  reasonText: {
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 20,
  },
  emphasisBox: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 12,
    marginVertical: 12,
    alignItems: 'center',
  },
  emphasisText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  alertBox: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    borderRadius: 12,
    marginVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 6,
  },
  alertText: {
    fontSize: 13,
    color: '#C62828',
    lineHeight: 20,
  },
  instructionBox: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    marginVertical: 12,
  },
  instructionText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  serviceBox: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  serviceText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  serviceLink: {
    fontSize: 13,
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
  contactBox: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
    marginVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 6,
  },
  contactSubtitle: {
    fontSize: 13,
    color: '#1976D2',
    marginBottom: 10,
  },
  contactLink: {
    fontSize: 14,
    color: '#1976D2',
    textDecorationLine: 'underline',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 13,
    color: '#1976D2',
    marginBottom: 4,
  },
  consentBox: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 12,
    marginVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  consentTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  consentText: {
    fontSize: 13,
    color: '#2E7D32',
    marginBottom: 6,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});

export default PrivacyPolicyScreen;