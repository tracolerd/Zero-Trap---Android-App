import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TermsConditionsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Terms and Conditions</Text>
        <Text style={styles.date}>Last Updated: February 16, 2026</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By downloading, installing, or using Zero Trap ("the App"), you agree to be bound by 
          these Terms and Conditions. If you do not agree, please do not use the App.
        </Text>

        <Text style={styles.sectionTitle}>2. Description of Service</Text>
        <Text style={styles.text}>
          Zero Trap is an emergency help network that connects people who need help with nearby 
          volunteers willing to assist. The App operates in two modes:
        </Text>
        <Text style={styles.bulletPoint}>• Bluetooth Mode: Offline, within 100-meter range</Text>
        <Text style={styles.bulletPoint}>• Internet Mode: Online, unlimited range with real-time tracking</Text>

        <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
        <Text style={styles.text}>You agree to:</Text>
        <Text style={styles.bulletPoint}>• Provide accurate and current information</Text>
        <Text style={styles.bulletPoint}>• Use the App only for legitimate emergency or help purposes</Text>
        <Text style={styles.bulletPoint}>• Not misuse the App for pranks or false alarms</Text>
        <Text style={styles.bulletPoint}>• Respect other users' privacy and safety</Text>
        <Text style={styles.bulletPoint}>• Comply with all applicable laws and regulations</Text>

        <Text style={styles.sectionTitle}>4. Emergency Services Disclaimer</Text>
        <Text style={styles.text}>
          IMPORTANT: Zero Trap is NOT a substitute for official emergency services (999, police, 
          fire, ambulance). For life-threatening emergencies, always call official emergency numbers first.
        </Text>

        <Text style={styles.sectionTitle}>5. No Guarantee of Help</Text>
        <Text style={styles.text}>
          We do not guarantee that help will be available when you request it. The App connects 
          you with volunteers, and their availability depends on many factors beyond our control.
        </Text>

        <Text style={styles.sectionTitle}>6. Safety and Liability</Text>
        <Text style={styles.text}>
          Zero Trap is not liable for:
        </Text>
        <Text style={styles.bulletPoint}>• Actions or inactions of users (helpers or help seekers)</Text>
        <Text style={styles.bulletPoint}>• Injuries, damages, or losses incurred while using the App</Text>
        <Text style={styles.bulletPoint}>• Accuracy of user-provided information</Text>
        <Text style={styles.bulletPoint}>• Technical failures or service interruptions</Text>
        <Text style={styles.bulletPoint}>• Any interactions between users outside the App</Text>

        <Text style={styles.sectionTitle}>7. User Conduct</Text>
        <Text style={styles.text}>You must NOT:</Text>
        <Text style={styles.bulletPoint}>• Use the App for illegal activities</Text>
        <Text style={styles.bulletPoint}>• Harass, threaten, or abuse other users</Text>
        <Text style={styles.bulletPoint}>• Share false or misleading information</Text>
        <Text style={styles.bulletPoint}>• Attempt to hack or disrupt the App</Text>
        <Text style={styles.bulletPoint}>• Use automated systems or bots</Text>

        <Text style={styles.sectionTitle}>8. Account Termination</Text>
        <Text style={styles.text}>
          We reserve the right to suspend or terminate your account if you violate these terms 
          or engage in abusive behavior.
        </Text>

        <Text style={styles.sectionTitle}>9. Location Data Usage</Text>
        <Text style={styles.text}>
          By using the App, you consent to the collection and sharing of your location data 
          during active help sessions. See our Privacy Policy for details.
        </Text>

        <Text style={styles.sectionTitle}>10. Helping Score</Text>
        <Text style={styles.text}>
          The helping score is a gamification feature. It does not guarantee any rewards or 
          represent any contractual obligation.
        </Text>

        <Text style={styles.sectionTitle}>11. Changes to Terms</Text>
        <Text style={styles.text}>
          We may modify these terms at any time. Continued use of the App after changes 
          constitutes acceptance of the new terms.
        </Text>

        <Text style={styles.sectionTitle}>12. Governing Law</Text>
        <Text style={styles.text}>
          These terms are governed by the laws of Bangladesh. Any disputes shall be subject 
          to the jurisdiction of courts in Dhaka, Bangladesh.
        </Text>

        <Text style={styles.sectionTitle}>13. Contact Information</Text>
        <Text style={styles.text}>
          For questions about these Terms and Conditions:
        </Text>
        <Text style={styles.bulletPoint}>• Email: scrollfaiyaz@gmail.com</Text>
        <Text style={styles.bulletPoint}>• Developer: Faiyaz</Text>
        <Text style={styles.bulletPoint}>• Institution: East West University, Dhaka</Text>

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

export default TermsConditionsScreen;