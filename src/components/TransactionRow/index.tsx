import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCategory } from '../../constants/categories';
import { Transaction } from '../../types';
import { formatTransactionDate } from '../../utils/date';
import { formatCurrency } from '../../utils/money';

type TransactionRowProps = {
  transaction: Transaction;
  onLongPress?: (transaction: Transaction) => void;
};

const TransactionRow = ({ transaction, onLongPress }: TransactionRowProps) => {
  const category = getCategory(transaction.category);
  const isIncome = transaction.type === 'income';
  const categoryName = category?.name ?? 'Other';
  // The note doubles as the title; fall back to the category name.
  const title = transaction.note || categoryName;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={!onLongPress}
      onLongPress={() => onLongPress?.(transaction)}
      style={styles.row}
    >
      <View
        style={[
          styles.iconTile,
          { backgroundColor: `${category?.color ?? '#7C768A'}22` },
        ]}
      >
        <Text style={styles.emoji}>{category?.emoji ?? '💸'}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {categoryName}  •  {formatTransactionDate(transaction.transactionDate)}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, isIncome && styles.amountIncome]}>
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amountMinor)}
        </Text>
        <View
          style={[styles.badge, isIncome ? styles.badgeIncome : styles.badgeExpense]}
        >
          <Text
            style={[
              styles.badgeText,
              isIncome ? styles.badgeTextIncome : styles.badgeTextExpense,
            ]}
          >
            {isIncome ? 'Income' : 'Expense'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#1E1B2E',
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#7C768A',
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 17,
    color: '#1E1B2E',
  },
  amountIncome: {
    color: '#2E6B4F',
  },
  badge: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeExpense: {
    backgroundColor: '#F8D7D5',
  },
  badgeIncome: {
    backgroundColor: '#2E6B4F',
  },
  badgeText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
  },
  badgeTextExpense: {
    color: '#9B1C1C',
  },
  badgeTextIncome: {
    color: '#FFFFFF',
  },
});

export default TransactionRow;
