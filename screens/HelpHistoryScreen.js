import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserData } from '../services/storageService';

const demoHistory = [
  {
    id: 'h1',
    type: 'helped',
    name: 'Rahim',
    description: 'পথ হারিয়ে গিয়েছিলেন, সঠিক পথ দেখিয়েছেন',
    score: '+10',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    mode: 'internet',
    duration: '15 min'
  },
  {
    id: 'h2',
    type: 'received',
    name: 'Karim',
    description: 'গাড়ি নষ্ট, সাহায্য পেয়েছেন',
    score: '0',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    mode: 'bluetooth',
    duration: '25 min'
  },
  {
    id: 'h3',
    type: 'helped',
    name: 'Nasrin',
    description: 'অসুস্থ ছিলেন, সাহায্য করেছেন',
    score: '+10',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    mode: 'internet',
    duration: '30 min'
  },
  {
    id: 'h4',
    type: 'helped',
    name: 'Jamal',
    description: 'ব্যাগ চুরি, police station নিয়ে গেছেন',
    score: '+10',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    mode: 'internet',
    duration: '45 min'
  },
  {
    id: 'h5',
    type: 'received',
    name: 'Fatema',
    description: 'রাতে একা ছিলেন, সাথে ছিলেন',
    score: '0',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    mode: 'bluetooth',
    duration: '20 min'
  },
];

const HelpHistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, helped, received
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getUserData();
    setUserData(data);
    await new Promise(resolve => setTimeout(resolve, 600));
    setHistory(demoHistory);
    setLoading(false);
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const totalHelped = history.filter(h => h.type === 'helped').length;
  const totalReceived = history.filter(h => h.type === 'received').length;
  const totalScore = history
    .filter(h => h.type === 'helped')
    .reduce((sum, h) => sum + parseInt(h.score), 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'আজ';
    if (diffDays === 1) return 'গতকাল';
    if (diffDays < 7) return `${diffDays} দিন আগে`;
    return date.toLocaleDateString('en-BD');
  };

  const HistoryCard = ({ item }) => (
    <View style={[
      styles.historyCard,
      item.type === 'helped' ? styles.helpedCard : styles.receivedCard
    ]}>
      <View style={styles.cardLeft}>
        <View style={[
          styles.typeIcon,
          { backgroundColor: item.type === 'helped' ? '#E8F5E9' : '#E3F2FD' }
        ]}>
          <Text style={styles.typeIconText}>
            {item.type === 'helped' ? '🤝' : '🆘'}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={[
            styles.cardScore,
            { color: item.type === 'helped' ? '#34C759' : '#007AFF' }
          ]}>
            {item.type === 'helped' ? item.score + ' pts' : 'Received'}
          </Text>
        </View>

        <Text style={styles.cardDescription}>{item.description}</Text>

        <View style={styles.cardMeta}>
          <Text style={styles.metaText}>
            {item.mode === 'bluetooth' ? '📡' : '🌐'} {item.mode}
          </Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>⏱️ {item.duration}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>📅 {formatDate(item.date)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help History</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{totalHelped}</Text>
          <Text style={styles.summaryLabel}>🤝 Helped</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{totalReceived}</Text>
          <Text style={styles.summaryLabel}>🆘 Received</Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryHighlight]}>
          <Text style={[styles.summaryNumber, { color: '#FF3B30' }]}>{totalScore}</Text>
          <Text style={styles.summaryLabel}>⭐ Points</Text>
        </View>
      </View>

      {/* Filter */}
      <View style={styles.filterRow}>
        {['all', 'helped', 'received'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'All' : f === 'helped' ? '🤝 Helped' : '🆘 Received'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3B30" />
          <Text style={styles.loadingText}>History লোড হচ্ছে...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <HistoryCard item={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>কোনো history নেই</Text>
              <Text style={styles.emptyText}>
                এখনো কোনো help session complete হয়নি।
              </Text>
            </View>
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  summaryRow: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  summaryHighlight: {
    borderWidth: 2,
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  summaryNumber: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  summaryLabel: { fontSize: 11, color: '#666', textAlign: 'center' },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 10,
    marginBottom: 5,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterButtonActive: { backgroundColor: '#FF3B30', borderColor: '#FF3B30' },
  filterText: { fontSize: 13, color: '#666', fontWeight: '600' },
  filterTextActive: { color: '#FFFFFF' },
  listContent: { padding: 15, paddingBottom: 30 },
  historyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  helpedCard: { borderLeftWidth: 4, borderLeftColor: '#34C759' },
  receivedCard: { borderLeftWidth: 4, borderLeftColor: '#007AFF' },
  cardLeft: { marginRight: 12, justifyContent: 'center' },
  typeIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIconText: { fontSize: 22 },
  cardContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  cardScore: { fontSize: 14, fontWeight: '700' },
  cardDescription: { fontSize: 13, color: '#555', lineHeight: 18, marginBottom: 8 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  metaText: { fontSize: 11, color: '#999' },
  metaDot: { fontSize: 10, color: '#ccc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  loadingText: { marginTop: 10, fontSize: 14, color: '#666' },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 60, marginBottom: 15 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22 },
});

export default HelpHistoryScreen;