import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import TransactionRow from '../../components/TransactionRow';
import { CommonStyles } from '../../utils/commonStyles';
import { useAppData } from '../../context/AppDataContext';
import { useTransactionHistory } from '../../hooks/useTransactionHistory';
import { deleteTransaction, restoreTransaction } from '../../services/firebase/transactions';
import { useToast } from '../../components/Toast';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/money';

const { width } = Dimensions.get('window');

type Filter = 'all' | 'expense' | 'income';

const TABS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'expense', label: 'Expense' },
  { key: 'income', label: 'Income' },
];

const Activity = () => {
  const { user } = useAppData();
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>('all');
  const { transactions, loading, error, hasMore, loadMore } = useTransactionHistory(
    user.uid,
    filter === 'all' ? undefined : filter,
  );

  // Delete straight away and offer Undo, instead of an "Are you sure?" dialog.
  const handleDelete = (transaction: Transaction) => {
    // The listener removes the row immediately (local cache);
    // the promise only settles once the server confirms.
    deleteTransaction(user.uid, transaction).catch(e => {
      console.warn('Delete failed', e);
      toast.error('Could not delete transaction', 'Please try again.');
    });

    toast.show({
      type: 'info',
      title: 'Transaction deleted',
      message: `${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amountMinor)} removed from your totals`,
      actionLabel: 'Undo',
      onAction: () => {
        restoreTransaction(user.uid, transaction).catch(e => {
          console.warn('Undo delete failed', e);
          toast.error('Could not restore transaction', 'Please add it again.');
        });
      },
    });
  };

  const renderList = () => {
    if (loading && transactions.length === 0) {
      return <ActivityIndicator style={styles.loader} color="#C4213A" />;
    }
    if (error) {
      return <Text style={styles.message}>{error}</Text>;
    }
    if (transactions.length === 0) {
      return (
        <Text style={styles.message}>
          No {filter === 'all' ? '' : `${filter} `}transactions yet.
        </Text>
      );
    }
    return transactions.map(item => (
      <TransactionRow key={item.id} transaction={item} onLongPress={handleDelete} />
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header isBackButton={false} title="Transactions" />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screenContainer}>
          {/* heading */}
          <View>
            <Text style={styles.headerTitle}>Activity Log</Text>
            <Text style={styles.headerDescription}>
              Review Your Cashflow  •  Long-press to delete
            </Text>
          </View>

          {/* tabs */}
          <View style={styles.segment}>
            {TABS.map(tab => {
              const active = filter === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  activeOpacity={0.8}
                  onPress={() => setFilter(tab.key)}
                  style={[styles.segmentItem, active && styles.segmentActive]}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      active && styles.segmentTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* list */}
          <View style={styles.card}>{renderList()}</View>

          {hasMore && !error ? (
            <TouchableOpacity
              style={styles.loadMore}
              onPress={loadMore}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.loadMoreText}>{loading ? 'Loading…' : 'Load more'}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6FF',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  screenContainer: {
    paddingHorizontal: width * 0.035,
    paddingVertical: width * 0.025,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: width * CommonStyles.header,
  },
  headerDescription: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.03,
    color: 'grey',
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#EEE9F3',
    borderRadius: 30,
    padding: 5,
    marginTop: 16,
    marginBottom: 16,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  segmentText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
    color: '#6B6478',
  },
  segmentTextActive: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#1E1B2E',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
  },
  loader: {
    paddingVertical: 30,
  },
  message: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#7C768A',
    textAlign: 'center',
    paddingVertical: 30,
  },
  loadMore: {
    marginTop: 14,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#EEE9F3',
  },
  loadMoreText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: '#1E1B2E',
  },
});

export default Activity;
