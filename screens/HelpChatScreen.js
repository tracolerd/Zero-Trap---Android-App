import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserData, updateUserData } from '../services/storageService';
import { sendHelperAcceptedNotification, sendTaskCompleteNotification } from '../services/notificationService';

const HelpChatScreen = ({ navigation, route }) => {
  const {
    requestId,
    seekerName,
    seekerPhone,
    isHelper,
    helperName,
    mode
  } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userData, setUserData] = useState(null);
  const [status, setStatus] = useState('active'); // active, helper_coming, completed
  const flatListRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadUserData();
    initChat();
    startPulse();
  }, []);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
      ])
    ).start();
  };

  const loadUserData = async () => {
    const data = await getUserData();
    setUserData(data);
  };

  const initChat = async () => {
    // Initial system messages
    const initMessages = [
      {
        id: 'sys_1',
        type: 'system',
        text: '🔗 Help session শুরু হয়েছে',
        time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      }
    ];

    if (isHelper) {
      initMessages.push({
        id: 'sys_2',
        type: 'system',
        text: `✅ আপনি ${seekerName} কে সাহায্য করতে রাজি হয়েছেন`,
        time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      });

      // Simulate seeker's welcome message
      setTimeout(() => {
        addMessage({
          id: `msg_${Date.now()}`,
          type: 'received',
          sender: seekerName,
          text: 'আপনাকে অনেক ধন্যবাদ! আমি এখানে আছি। কত সময় লাগবে আসতে?',
          time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        });

        // Send notification to seeker
        sendHelperAcceptedNotification(helperName || 'Helper');
      }, 1500);
    } else {
      initMessages.push({
        id: 'sys_2',
        type: 'system',
        text: '🔍 Helper খোঁজা হচ্ছে...',
        time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      });

      // Simulate helper accepting
      setTimeout(() => {
        addMessage({
          id: `msg_${Date.now()}`,
          type: 'received',
          sender: helperName || 'Helper',
          text: 'আমি সাহায্য করতে আসছি! ৫-১০ মিনিটের মধ্যে পৌঁছাবো।',
          time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        });
        setStatus('helper_coming');
      }, 3000);
    }

    setMessages(initMessages);
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      type: 'sent',
      sender: userData?.name || 'You',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };

    addMessage(newMessage);
    const sentText = inputText.trim();
    setInputText('');

    // Auto reply simulation
    setTimeout(() => {
      const replies = isHelper
        ? [
          'ঠিক আছে, আমি শুনছি।',
          'আর কোনো সমস্যা আছে?',
          'চিন্তা করবেন না, আমি সাহায্য করবো।',
          'কোথায় ঠিক আছেন আপনি?'
        ]
        : [
          'ঠিক আছে, আমি আসছি।',
          'আর একটু সময় লাগবে।',
          'আপনি কি ঠিক আছেন?',
          'আমি প্রায় পৌঁছে গেছি।'
        ];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      addMessage({
        id: `msg_${Date.now() + 1}`,
        type: 'received',
        sender: isHelper ? seekerName : (helperName || 'Helper'),
        text: randomReply,
        time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      });
    }, 1500);
  };

  const handleCall = () => {
    const phoneToCall = isHelper ? seekerPhone : '+8801XXXXXXXXX';
    Alert.alert(
      '📞 Call',
      `${isHelper ? seekerName : helperName} কে call করবেন?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => Linking.openURL(`tel:${phoneToCall}`)
        }
      ]
    );
  };

  const handleLocation = () => {
    navigation.navigate('Map', {
      mode: mode,
      requestId: requestId,
      isHelper: isHelper
    });
  };

  const handleComplete = () => {
    Alert.alert(
      '✅ Complete Help',
      'সাহায্য সম্পূর্ণ হয়েছে?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Complete',
          onPress: async () => {
            // Update helping score
            const currentScore = userData?.helpingScore || 0;
            const newScore = currentScore + 10;

            await updateUserData({
              helpingScore: newScore,
              totalHelped: (userData?.totalHelped || 0) + 1,
              lastHelped: new Date().toISOString()
            });

            await sendTaskCompleteNotification(newScore);

            addMessage({
              id: `sys_complete`,
              type: 'system',
              text: `🎉 সাহায্য সম্পূর্ণ হয়েছে! +10 Helping Score`,
              time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
            });

            setStatus('completed');

            setTimeout(() => {
              Alert.alert(
                '🌟 সাহায্য সম্পূর্ণ!',
                isHelper
                  ? `ধন্যবাদ! আপনার Helping Score +10 বেড়েছে!\nTotal Score: ${newScore}`
                  : 'আপনি সাহায্য পেয়েছেন! Helper কে ধন্যবাদ।',
                [{ text: 'OK', onPress: () => navigation.replace('Home') }]
              );
            }, 500);
          }
        }
      ]
    );
  };

  const renderMessage = ({ item }) => {
    if (item.type === 'system') {
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
          <Text style={styles.systemMessageTime}>{item.time}</Text>
        </View>
      );
    }

    const isSent = item.type === 'sent';

    return (
      <View style={[styles.messageBubble, isSent ? styles.sentBubble : styles.receivedBubble]}>
        {!isSent && (
          <Text style={styles.messageSender}>{item.sender}</Text>
        )}
        <Text style={[styles.messageText, isSent ? styles.sentText : styles.receivedText]}>
          {item.text}
        </Text>
        <Text style={[styles.messageTime, isSent ? styles.sentTime : styles.receivedTime]}>
          {item.time}
        </Text>
      </View>
    );
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active': return '#FF9500';
      case 'helper_coming': return '#34C759';
      case 'completed': return '#007AFF';
      default: return '#999';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active': return '🔍 Helper খোঁজা হচ্ছে...';
      case 'helper_coming': return '🚶 Helper আসছে';
      case 'completed': return '✅ Completed';
      default: return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          Alert.alert(
            'Chat ছেড়ে যাবেন?',
            'আপনি যদি যান, help session continue থাকবে।',
            [
              { text: 'Stay', style: 'cancel' },
              { text: 'Leave', onPress: () => navigation.goBack() }
            ]
          );
        }}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>
              {(isHelper ? seekerName : helperName || 'H')[0].toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.headerName}>
              {isHelper ? seekerName : (helperName || 'Helper')}
            </Text>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Text style={[styles.headerStatus, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
            </Animated.View>
          </View>
        </View>

        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.callButtonText}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLocation}>
          <Text style={styles.actionBtnIcon}>🗺️</Text>
          <Text style={styles.actionBtnText}>Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleCall}>
          <Text style={styles.actionBtnIcon}>📞</Text>
          <Text style={styles.actionBtnText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.completeBtn]}
          onPress={handleComplete}
        >
          <Text style={styles.actionBtnIcon}>✅</Text>
          <Text style={[styles.actionBtnText, styles.completeBtnText]}>Complete</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Message লিখুন..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={200}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerAvatarText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  headerStatus: {
    fontSize: 12,
    marginTop: 1,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 20,
  },
  actionBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  actionBtnIcon: {
    fontSize: 20,
    marginBottom: 3,
  },
  actionBtnText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  completeBtn: {
    backgroundColor: '#E8F5E9',
    borderColor: '#34C759',
  },
  completeBtnText: {
    color: '#34C759',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 10,
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemMessageText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  systemMessageTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 3,
  },
  messageBubble: {
    maxWidth: '78%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  sentBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF3B30',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  messageSender: {
    fontSize: 11,
    color: '#FF3B30',
    fontWeight: '700',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  sentText: {
    color: '#FFFFFF',
  },
  receivedText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  sentTime: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  receivedTime: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    gap: 10,
  },
  messageInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    backgroundColor: '#F8F9FA',
    color: '#000',
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#FFB3AE',
    elevation: 0,
  },
  sendButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
});

export default HelpChatScreen;