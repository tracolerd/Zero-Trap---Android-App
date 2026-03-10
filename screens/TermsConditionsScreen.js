// screens/TermsConditionsScreen.js
// Complete Terms and Conditions Screen

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

const TermsConditionsScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
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
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By downloading, installing, or using Zero Trap ("the App"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the App.
        </Text>

        {/* Service Description */}
        <Text style={styles.sectionTitle}>2. Description of Service</Text>
        <Text style={styles.paragraph}>
          Zero Trap is an emergency assistance mobile application that:
        </Text>
        <Text style={styles.bulletPoint}>• Connects users who need help with nearby helpers</Text>
        <Text style={styles.bulletPoint}>• Provides real-time location tracking during emergencies</Text>
        <Text style={styles.bulletPoint}>• Enables communication between users</Text>
        <Text style={styles.bulletPoint}>• Operates via Internet (GPS) or Bluetooth mode</Text>

        {/* Eligibility */}
        <Text style={styles.sectionTitle}>3. Eligibility</Text>
        
        <Text style={styles.subTitle}>Age Requirement</Text>
        <Text style={styles.bulletPoint}>• You must be at least 13 years old</Text>
        <Text style={styles.bulletPoint}>• Users under 18 should use with parental guidance</Text>
        <Text style={styles.bulletPoint}>• One account per person</Text>

        <Text style={styles.subTitle}>Account Requirement</Text>
        <Text style={styles.bulletPoint}>• Valid Gmail address required</Text>
        <Text style={styles.bulletPoint}>• Unique username required</Text>
        <Text style={styles.bulletPoint}>• Accurate information must be provided</Text>

        {/* User Responsibilities */}
        <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
        
        <Text style={styles.subTitle}>Acceptable Use</Text>
        <Text style={styles.paragraph}>You agree to:</Text>
        <Text style={styles.bulletPoint}>• Use the App only for lawful emergency assistance</Text>
        <Text style={styles.bulletPoint}>• Provide accurate location and contact information</Text>
        <Text style={styles.bulletPoint}>• Respond promptly if you accept a help request</Text>
        <Text style={styles.bulletPoint}>• Treat other users with respect</Text>

        <Text style={styles.subTitle}>Prohibited Conduct</Text>
        <Text style={styles.paragraph}>You must NOT:</Text>
        <Text style={styles.bulletPoint}>• Use the App for non-emergency purposes</Text>
        <Text style={styles.bulletPoint}>• Harass, abuse, or threaten other users</Text>
        <Text style={styles.bulletPoint}>• Create fake emergency requests</Text>
        <Text style={styles.bulletPoint}>• Share false or misleading information</Text>
        <Text style={styles.bulletPoint}>• Use automated systems or bots</Text>
        <Text style={styles.bulletPoint}>• Attempt to hack or interfere with the App</Text>

        {/* Public Information */}
        <Text style={styles.sectionTitle}>5. Public Information</Text>
        
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ Important Notice</Text>
          <Text style={styles.warningText}>
            By using Zero Trap, your name, username, and phone number are PUBLIC and visible to all authenticated users.
          </Text>
        </View>

        <Text style={styles.paragraph}>
          Public information is necessary for quick emergency response and trustworthy helper identification.
        </Text>

        {/* Emergency Services */}
        <Text style={styles.sectionTitle}>6. Emergency Services</Text>
        
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>🚨 Not a Replacement</Text>
          <Text style={styles.alertText}>
            Zero Trap is NOT a replacement for emergency services (911, 999, police, ambulance, or fire services).
          </Text>
        </View>

        <Text style={styles.subTitle}>When to Use</Text>
        <Text style={styles.bulletPoint}>• Non-life-threatening emergencies</Text>
        <Text style={styles.bulletPoint}>• Situations requiring immediate local help</Text>
        <Text style={styles.bulletPoint}>• When official emergency services are not needed</Text>

        <Text style={styles.subTitle}>Life-Threatening Emergencies</Text>
        <Text style={styles.paragraph}>
          For life-threatening emergencies, call official emergency services FIRST, then use Zero Trap as supplementary assistance.
        </Text>

        {/* Location Tracking */}
        <Text style={styles.sectionTitle}>7. Location Tracking</Text>
        
        <Text style={styles.paragraph}>By using emergency mode, you consent to:</Text>
        <Text style={styles.bulletPoint}>• Real-time GPS location tracking</Text>
        <Text style={styles.bulletPoint}>• Sharing your location with nearby users</Text>
        <Text style={styles.bulletPoint}>• Background location access (when app is closed)</Text>
        
        <Text style={styles.subTitle}>Battery Usage</Text>
        <Text style={styles.paragraph}>
          Location tracking may increase battery consumption and use mobile data. You can disable emergency mode anytime.
        </Text>

        {/* Helping Score */}
        <Text style={styles.sectionTitle}>8. Helping Score System</Text>
        
        <Text style={styles.paragraph}>
          • You earn 10 points for each person helped{'\n'}
          • Score is visible to all users{'\n'}
          • Score has NO monetary value{'\n'}
          • Cannot be exchanged for money or goods
        </Text>

        {/* Report & Block */}
        <Text style={styles.sectionTitle}>9. Report and Block System</Text>
        
        <Text style={styles.subTitle}>You can report users for:</Text>
        <Text style={styles.bulletPoint}>• Harassment or abuse</Text>
        <Text style={styles.bulletPoint}>• Fake emergency requests</Text>
        <Text style={styles.bulletPoint}>• Inappropriate behavior</Text>
        <Text style={styles.bulletPoint}>• Misuse of personal information</Text>

        <Text style={styles.paragraph}>
          We will review all reports within 48 hours and take appropriate action.
        </Text>

        {/* Liability */}
        <Text style={styles.sectionTitle}>10. Liability and Disclaimers</Text>
        
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>⚖️ No Guarantee</Text>
          <Text style={styles.disclaimerText}>
            We do NOT guarantee that help will be available, response time of helpers, quality of assistance, or continuous app availability.
          </Text>
        </View>

        <Text style={styles.paragraph}>
          Use of Zero Trap is at your own risk. We are not responsible for actions of other users or damages from app use.
        </Text>

        {/* Termination */}
        <Text style={styles.sectionTitle}>11. Termination</Text>
        
        <Text style={styles.subTitle}>By You</Text>
        <Text style={styles.paragraph}>
          You can delete your account anytime in Settings. All data will be permanently deleted and cannot be recovered.
        </Text>

        <Text style={styles.subTitle}>By Us</Text>
        <Text style={styles.paragraph}>We may terminate your account if you:</Text>
        <Text style={styles.bulletPoint}>• Violate these Terms</Text>
        <Text style={styles.bulletPoint}>• Engage in abusive behavior</Text>
        <Text style={styles.bulletPoint}>• Create fake emergencies</Text>

        {/* Privacy */}
        <Text style={styles.sectionTitle}>12. Privacy</Text>
        
        <Text style={styles.paragraph}>
          Your privacy is governed by our Privacy Policy. By using Zero Trap, you consent to our Privacy Policy.
        </Text>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          <Text style={styles.linkButtonText}>📄 Read Privacy Policy</Text>
        </TouchableOpacity>

        {/* Changes to Terms */}
        <Text style={styles.sectionTitle}>13. Changes to Terms</Text>
        
        <Text style={styles.paragraph}>
          We may update these Terms from time to time. We will notify you of material changes via email or in-app notification. Continued use means acceptance.
        </Text>

        {/* Governing Law */}
        <Text style={styles.sectionTitle}>14. Governing Law</Text>
        
        <Text style={styles.paragraph}>
          These Terms are governed by the laws of Bangladesh. Disputes will be resolved through negotiation, mediation, or arbitration.
        </Text>

        {/* Contact */}
        <Text style={styles.sectionTitle}>15. Contact Information</Text>
        
        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>📧 Get in Touch</Text>
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={styles.contactLink}>Email: support@zerotrap.com</Text>
          </TouchableOpacity>
          <Text style={styles.contactText}>Developer: Md. Tasrif Hossain</Text>
          <Text style={styles.contactText}>Location: Dhaka, Bangladesh</Text>
        </View>

        {/* Acknowledgment */}
        <Text style={styles.sectionTitle}>16. Acknowledgment</Text>
        
        <Text style={styles.paragraph}>
          By using Zero Trap, you acknowledge that you have read and understood these Terms and agree to be bound by them.
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Effective Date: March 11, 2026</Text>
          <Text style={styles.footerText}>Version: 1.0.0</Text>
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
  disclaimerBox: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    marginVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#666',
  },
  disclaimerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  linkButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  linkButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  contactBox: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 12,
    marginVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
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
    color: '#2E7D32',
    marginBottom: 4,
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

export default TermsConditionsScreen;