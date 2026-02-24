import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserData } from '../services/storageService';

const { width } = Dimensions.get('window');

const LoadingDot = ({ delay }) => {
  const dotAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dotAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 0.3, duration: 400, useNativeDriver: true })
      ])
    ).start();
  }, []);

  return <Animated.View style={[styles.dot, { opacity: dotAnim }]} />;
};

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startAnimations();
    checkLoginStatus();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true })
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
        ])
      ).start();
    });
  };

  const checkLoginStatus = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      const userData = await getUserData();

      if (userData && userData.isLoggedIn === true && userData.name) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    } catch (error) {
      navigation.replace('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }]
          }
        ]}
      >
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.logo}>🚨</Text>
        </Animated.View>

        <Text style={styles.title}>Zero Trap</Text>
        <Text style={styles.subtitle}>Emergency Help Network</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>সাহায্য করুন • সাহায্য পান</Text>
      </Animated.View>

      <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
        <View style={styles.loadingDots}>
          <LoadingDot delay={0} />
          <LoadingDot delay={200} />
          <LoadingDot delay={400} />
        </View>
        <Text style={styles.footer}>Made with ❤️ for Bangladesh</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -width * 0.2,
    right: -width * 0.2,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -width * 0.1,
    left: -width * 0.1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  logo: {
    fontSize: 70,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 20,
    letterSpacing: 1,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 2,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  footer: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  version: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
});

export default SplashScreen;