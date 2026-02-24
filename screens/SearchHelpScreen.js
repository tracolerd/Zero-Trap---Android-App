import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Animated,
  SectionList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserData } from '../services/storageService';
import { sendHelpRequestNotification } from '../services/notificationService';

// Demo help requests data
const generateDemoRequests = () => [
  {
    id: 'demo_001',
    seekerName: 'Rahim',
    phoneNumber: '+8801712345678',
    mode: 'internet',
    location: { latitude: 23.8103, longitude: 90.4125 },
    status: 'active',
    distance: '0.5 km',
    timeAgo: '2 min ago',
    message: 'সাহায্য দরকার! পথ হারিয়ে গেছি।',
    isBot: true,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: 'demo_002',
    seekerName: 'Karim',
    phoneNumber: '+8801898765432',
    mode: 'internet',
    location: { latitude: 23.8203, longitude: 90.4225 },
    status: 'active',
    distance: '1.2 km',
    timeAgo: '5 min ago',
    message: 'গাড়ি নষ্ট হয়ে গেছে। সাহায্য লাগবে।',
    isBot: true,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: 'demo_003',
    seekerName: 'Nasrin',
    phoneNumber: '+8801611223344',
    mode: 'internet',
    location: { latitude: 23.7903, longitude: 90.4025 },
    status: 'active',
    distance: '2.3 km',
    timeAgo: '8 min ago',
    message: 'অসুস্থ হয়ে পড়েছি। কেউ সাহায্য করুন।',
    isBot: true,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  },
  {
    id: 'demo_004',
    seekerName: 'Jamal',
    phoneNumber: '+8801755667788',
    mode: 'internet',
    location: { latitude: 23.8303, longitude: 90.4325 },
    status: 'active',
    distance: '3.1 km',
    timeAgo: '12 min ago',
    message: 'ব্যাগ চুরি হয়ে গেছে। সাহায্য দরকার।',
    isBot: true,
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  },
  {
    id: 'demo_005',
    seekerName: 'Fatema',
    phoneNumber: '+8801933445566',
    mode: 'internet',
    location: { latitude: 23.8003, longitude: 90.4225 },
    status: 'active',
    distance: '4.5 km',
    timeAgo: '15 min ago',
    message: 'একা আছি, ভয় লাগছে। সাথে থাকুন।',
    isBot: true,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
];

const SearchHelpScreen = ({ navigation, route }) => {
  const { mode } = route.params || { mode: 'internet' };
  const [realRequests, setRealRequests] = useState([]);
  const [demoRequests, setDemoRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const data = await getUserData();
    setUserData(data);
    await loadRequests();
  };

  const loadRequests = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Real requests (empty for now - will be populated from Firestore)
    setRealRequests([]);

    // Demo requests
    setDemoRequests(generateDemoRequests());

    setLoading(false);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    fadeAnim.setValue(0);
    await loadRequests();
    setRefreshing(false);
  };

  const handleAcceptHelp = (request) => {
    if (request.isBot) {
      Alert.alert(
        '🤖 Demo Request',
        'এটি একটি demo request। Real users এর জন্য এখনো কোনো request নেই।\n\nDemo chat দেখতে চান?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Demo Chat দেখুন',
            onPress: async () => {
              await sendHelpRequestNotification(request.seekerName);
              navigation.navigate('HelpChat', {
                requestId: request.id,
                seekerName: request.seekerName,
                seekerPhone: request.phoneNumber,
                isHelper: true,
                helperName: userData?.name || 'Helper',
                mode: mode,
                isDemo: true
              });
            }
          }
        ]
      );
    } else {
      // Real request
      Alert.alert(
        '🤝 Help Request',
        `${request.seekerName} কে সাহায্য করবেন?\n\nদূরত্ব: ${request.distance}\n\nবার্তা: "${request.message}"`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Accept ✅',
            onPress: async () => {
              await sendHelpRequestNotification(request.seekerName);
              navigation.navigate('HelpChat', {
                requestId: request.id,
                seekerName: request.seekerName,
                seekerPhone: request.phoneNumber,
                isHelper: true,
                helperName: userData?.name || 'Helper',
                mode: mode,
                isDemo: false
              });
            }
          }
        ]
      );
    }
  };

  const getUrgencyColor = (timeAgo) => {
    const minutes = parseInt(timeAgo);
    if (minutes <= 3) return '#FF3B30';
    if (minutes <= 10) return '#FF9500';
    return '#34C759';
  };

  const getUrgencyLabel = (timeAgo) => {
    const minutes = parseInt(timeAgo);
    if (minutes <= 3) return '🔴 Urgent';
    if (minutes <= 10) return '🟡 Recent';
    return '🟢 Normal';
  };

  const RequestCard = ({ item, index }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true
      }).start();
    }, []);

    return (
      <Animated.View style={[
        styles.requestCard,
        item.isBot && styles.botCard,
        {
          opacity: cardAnim,
          transform: [{
            translateY: cardAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0]
            })
          }]
        }
      ]}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.seekerInfo}>
            <View style={[styles.seekerAvatar, item.isBot && styles.botAvatar]}>
              <Text style={styles.seekerAvatarText}>
                {item.isBot ? '🤖' : item.seekerName[0].toUpperCase()}
              </Text>
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.seekerName}>{item.seekerName}</Text>
                {item.isBot && (
                  <View style={styles.botBadge}>
                    <Text style={styles.botBadgeText}>BOT</Text>
                  </View>
                )}
              </View>
              <Text style={styles.seekerPhone}>{item.phoneNumber}</Text>
            </View>
          </View>
          <View style={[
            styles.urgencyBadge,
            { backgroundColor: getUrgencyColor(item.timeAgo) + '20' }
          ]}>
            <Text style={[
              styles.urgencyText,
              { color: getUrgencyColor(item.timeAgo) }
            ]}>
              {getUrgencyLabel(item.timeAgo)}
            </Text>
          </View>
        </View>

        {/* Message */}
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>💬 "{item.message}"</Text>
        </View>

        {/* Card Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.cardMeta}>
            <Text style={styles.metaText}>📍 {item.distance}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>⏰ {item.timeAgo}</Text>
          </View>

          <TouchableOpacity
            style={[styles.acceptButton, item.isBot && styles.demoButton]}
            onPress={() => handleAcceptHelp(item)}
          >
            <Text style={styles.acceptButtonText}>
              {item.isBot ? 'Demo Chat →' : 'সাহায্য করুন →'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const sections = [
    {
      title: 'Real Help Requests',
      data: realRequests,
      isReal: true
    },
    {
      title: 'Demo Interface (For Testing)',
      data: demoRequests,
      isReal: false
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'bluetooth' ? '📡 Bluetooth Search' : '🌐 Search Help'}
        </Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{realRequests.length + demoRequests.length}</Text>
        </View>
      </View>

      {/* Mode Info */}
      <View style={[
        styles.modeInfo,
        { backgroundColor: mode === 'bluetooth' ? '#E3F2FD' : '#E8F5E9' }
      ]}>
        <Text style={[
          styles.modeInfoText,
          { color: mode === 'bluetooth' ? '#1976D2' : '#2E7D32' }
        ]}>
          {mode === 'bluetooth'
            ? '📡 Bluetooth mode: ১০০ মিটার রেঞ্জে active requests দেখাচ্ছে'
            : '🌐 Internet mode: সব active help requests দেখাচ্ছে'}
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3B30" />
          <Text style={styles.loadingText}>Help requests খুঁজছি...</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item, index }) => <RequestCard item={item} index={index} />}
          renderSectionHeader={({ section }) => (
            <View style={[
              styles.sectionHeader,
              !section.isReal && styles.demoSectionHeader
            ]}>
              <Text style={[
                styles.sectionTitle,
                !section.isReal && styles.demoSectionTitle
              ]}>
                {section.title}
              </Text>
              {!section.isReal && (
                <Text style={styles.sectionSubtitle}>
                  🤖 Test করার জন্য demo data
                </Text>
              )}
            </View>
          )}
          renderSectionFooter={({ section }) => {
            if (section.isReal && section.data.length === 0) {
              return (
                <View style={styles.emptyRealSection}>
                  <Text style={styles.emptyRealIcon}>🔍</Text>
                  <Text style={styles.emptyRealText}>
                    এখনো কোনো real help request নেই
                  </Text>
                  <Text style={styles.emptyRealSubtext}>
                    নতুন request আসলে এখানে দেখাবে
                  </Text>
                </View>
              );
            }
            return null;
          }}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF3B30']}
            />
          }
        />
      )}
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
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#000' },
  countBadge: {
    backgroundColor: '#FF3B30',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  modeInfo: { padding: 12, marginHorizontal: 15, marginTop: 12, borderRadius: 10 },
  modeInfoText: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666' },
  listContent: { paddingBottom: 30 },
  sectionHeader: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  demoSectionHeader: { backgroundColor: '#FFF9E6' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 3 },
  demoSectionTitle: { color: '#FF9500' },
  sectionSubtitle: { fontSize: 12, color: '#FF9500', fontStyle: 'italic' },
  emptyRealSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  emptyRealIcon: { fontSize: 40, marginBottom: 10 },
  emptyRealText: { fontSize: 15, fontWeight: '600', color: '#666', marginBottom: 5 },
  emptyRealSubtext: { fontSize: 13, color: '#999', textAlign: 'center' },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  botCard: {
    borderWidth: 2,
    borderColor: '#FFE5B4',
    backgroundColor: '#FFFBF0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seekerInfo: { flexDirection: 'row', alignItems: 'center' },
  seekerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  botAvatar: { backgroundColor: '#FF9500' },
  seekerAvatarText: { fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' },
  seekerName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  botBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  botBadgeText: { fontSize: 9, color: '#FFFFFF', fontWeight: 'bold' },
  seekerPhone: { fontSize: 12, color: '#999', marginTop: 2 },
  urgencyBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  urgencyText: { fontSize: 12, fontWeight: '700' },
  messageBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF3B30',
  },
  messageText: { fontSize: 14, color: '#333', fontStyle: 'italic', lineHeight: 20 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: '#666' },
  metaDot: { fontSize: 12, color: '#999' },
  acceptButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  demoButton: { backgroundColor: '#FF9500' },
  acceptButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
});

export default SearchHelpScreen;