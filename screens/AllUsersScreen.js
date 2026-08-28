// screens/AllUsersScreen.js
// FIXED - Filters out deleted users properly

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { subscribeToAllUsers, getUserProfile } from '../services/firestoreService';
import { getCurrentUserId } from '../services/firebaseAuthService';

const AllUsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    // Subscribe to users with real-time updates
    const unsubscribe = subscribeToAllUsers(async (result) => {
      if (!result.success) {
        console.error('All users subscription error:', result.error);
        setUsers([]);
        setFilteredUsers([]);
        setLoading(false);
        return;
      }

      const validUsers = [];

      for (const user of result.data) {
        if (user.userId === currentUserId) continue;

        if (user.userId && user.username && user.email) {
          const userCheck = await getUserProfile(user.userId);
          if (userCheck.success && userCheck.data) {
            validUsers.push(user);
          } else {
            console.log('⚠️ User deleted but still in cache:', user.username);
          }
        }
      }

      setUsers(validUsers);
      setFilteredUsers(validUsers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  useEffect(() => {
    // Filter users based on search
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter((user) => {
      const name = (user.name || '').toLowerCase();
      const username = (user.username || '').toLowerCase();
      return name.includes(query) || username.includes(query);
    });

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleUserPress = (user) => {
    navigation.navigate('UserProfile', { userId: user.userId });
  };

  const renderUser = ({ item, index }) => {
    const rank = index + 1;
    const isOnline = item.isOnline || false;

    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => handleUserPress(item)}
      >
        {/* Rank Badge */}
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{rank}</Text>
        </View>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          {item.profileImage ? (
            <Image
              source={{ uri: item.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>
                {item.name ? item.name[0].toUpperCase() : '?'}
              </Text>
            </View>
          )}
          {isOnline && <View style={styles.onlineDot} />}
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name || 'Unknown'}</Text>
          <Text style={styles.userUsername}>@{item.username}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>
              🏆 {item.helpingScore || 0} • 🤝 {item.totalHelped || 0}
            </Text>
          </View>
        </View>

        {/* Arrow */}
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Users</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or username..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {users.filter(u => u.isOnline).length}
          </Text>
          <Text style={styles.statLabel}>Online Now</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{filteredUsers.length}</Text>
          <Text style={styles.statLabel}>Search Results</Text>
        </View>
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item, index) => (item.userId ? String(item.userId) : `user-${index}`)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No users found' : 'No users yet'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: { marginTop: 15, fontSize: 16, color: '#666' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: { fontSize: 16, color: '#FF3B30', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    elevation: 2,
  },
  searchIcon: { fontSize: 20, marginRight: 10 },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  clearButton: { fontSize: 20, color: '#999', paddingLeft: 10 },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 10,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#FF3B30' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  listContent: { padding: 15, paddingTop: 5 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  rankBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 12,
  },
  rankText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  imageContainer: { position: 'relative', marginRight: 12 },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: { fontSize: 20, fontWeight: 'bold', color: '#999' },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 2 },
  userUsername: { fontSize: 13, color: '#666', marginBottom: 4 },
  statsRow: { flexDirection: 'row' },
  statText: { fontSize: 12, color: '#999' },
  arrow: { fontSize: 20, color: '#999', marginLeft: 10 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: { fontSize: 60, marginBottom: 15 },
  emptyText: { fontSize: 16, color: '#999' },
});

export default AllUsersScreen;