// screens/AllUsersScreen.js
// View All Registered Users (Sorted by Registration Date)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { subscribeToAllUsers } from '../services/firestoreService';
import { getCurrentUserId } from '../services/firebaseAuthService';

const AllUsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    // Subscribe to all users (real-time)
    const unsubscribe = subscribeToAllUsers((result) => {
      if (result.success) {
        setUsers(result.data);
        setFilteredUsers(result.data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Real-time subscription will auto-update
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleUserPress = (user) => {
    navigation.navigate('UserProfile', { userId: user.id });
  };

  const renderUserItem = ({ item, index }) => {
    const isCurrentUser = item.id === currentUserId;
    
    return (
      <TouchableOpacity
        style={[
          styles.userCard,
          isCurrentUser && styles.currentUserCard
        ]}
        onPress={() => handleUserPress(item)}
      >
        <View style={styles.userRank}>
          <Text style={styles.rankNumber}>#{index + 1}</Text>
          <Text style={styles.rankLabel}>User</Text>
        </View>

        <View style={styles.userImageContainer}>
          {item.profileImage ? (
            <Image
              source={{ uri: item.profileImage }}
              style={styles.userImage}
            />
          ) : (
            <View style={styles.userImagePlaceholder}>
              <Text style={styles.userImagePlaceholderText}>
                {item.name ? item.name[0].toUpperCase() : '?'}
              </Text>
            </View>
          )}
          
          {item.isOnline && (
            <View style={styles.onlineBadge} />
          )}
        </View>

        <View style={styles.userInfo}>
          <View style={styles.userNameRow}>
            <Text style={styles.userName} numberOfLines={1}>
              {item.name}
              {isCurrentUser && (
                <Text style={styles.youBadge}> (You)</Text>
              )}
            </Text>
          </View>
          
          <Text style={styles.userUsername}>@{item.username}</Text>
          
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.helpingScore || 0}</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.totalHelped || 0}</Text>
              <Text style={styles.statLabel}>Helped</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {item.gender === 'Male' ? '👨' : item.gender === 'Female' ? '👩' : '⚧'}
              </Text>
              <Text style={styles.statLabel}>{item.gender}</Text>
            </View>
          </View>

          <Text style={styles.joinedDate}>
            Joined: {new Date(item.registeredAt).toLocaleDateString('en-GB')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleUserPress(item)}
        >
          <Text style={styles.viewButtonText}>View →</Text>
        </TouchableOpacity>
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

      {/* Stats */}
      <View style={styles.statsBar}>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{users.length}</Text>
          <Text style={styles.statCardLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>
            {users.filter(u => u.isOnline).length}
          </Text>
          <Text style={styles.statCardLabel}>Online Now</Text>
        </View>
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
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FF3B30']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No users found' : 'No users yet'}
            </Text>
          </View>
        }
      />

      {/* Info Footer */}
      <View style={styles.infoFooter}>
        <Text style={styles.infoText}>
          👆 Users sorted by registration date (oldest first)
        </Text>
      </View>
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
  loadingText: { marginTop: 10, fontSize: 14, color: '#666' },
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
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  statsBar: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  statCardValue: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  statCardLabel: { fontSize: 12, color: '#FFFFFF', marginTop: 3 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  clearIcon: { fontSize: 20, color: '#999', paddingHorizontal: 10 },
  listContent: { paddingHorizontal: 15, paddingBottom: 20 },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentUserCard: {
    borderWidth: 2,
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  userRank: {
    width: 50,
    alignItems: 'center',
    marginRight: 10,
  },
  rankNumber: { fontSize: 20, fontWeight: 'bold', color: '#FF3B30' },
  rankLabel: { fontSize: 10, color: '#999', marginTop: 2 },
  userImageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  userImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImagePlaceholderText: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: { flex: 1 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  youBadge: { fontSize: 12, color: '#FF3B30', fontWeight: 'normal' },
  userUsername: { fontSize: 13, color: '#666', marginBottom: 8 },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statItem: { alignItems: 'center', marginRight: 8 },
  statValue: { fontSize: 14, fontWeight: 'bold', color: '#FF3B30' },
  statLabel: { fontSize: 10, color: '#999' },
  statDivider: { width: 1, height: 20, backgroundColor: '#E5E5EA', marginRight: 8 },
  joinedDate: { fontSize: 11, color: '#999', fontStyle: 'italic' },
  viewButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: { fontSize: 60, marginBottom: 15 },
  emptyText: { fontSize: 16, color: '#999' },
  infoFooter: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2196F3',
  },
  infoText: { fontSize: 12, color: '#1976D2', fontStyle: 'italic' },
});

export default AllUsersScreen;