import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { CommonStyles } from '../../utils/commonStyles';

const { width } = Dimensions.get('window');

type Filter = 'all' | 'expense' | 'income';

const TABS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'expense', label: 'Expense' },
  { key: 'income', label: 'Income' },
];

const Activity = () => {
  const [filter, setFilter] = useState<Filter>('all');

  const transactions= [
    {
      id: '1',
      title: 'Whole Foods Market',
      category: 'Groceries',
      emoji: '🥦',
      time: '2:15 PM',
      amount: 68.4,
      type: 'expense',
      icon: 'basket-outline',
      tileColor: '#E9DDF7',
      iconColor: '#5B4B73',
    },
    {
      id: '2',
      title: 'Uber Ride',
      category: 'Transport',
      emoji: '🚘',
      time: '9:30 AM',
      amount: 18.25,
      type: 'expense',
      icon: 'car-outline',
      tileColor: '#F8D9D6',
      iconColor: '#5A1A1A',
    },
    {
      id: '3',
      title: 'Upwork Payout',
      category: 'Freelance',
      emoji: '💻',
      time: '4:00 PM',
      amount: 850,
      type: 'income',
      icon: 'laptop-outline',
      tileColor: '#93F5C3',
      iconColor: '#12372A',
    },
    {
      id: '4',
      title: 'Olive Garden',
      category: 'Dining',
      emoji: '🍝',
      time: '7:45 PM',
      amount: 54.1,
      type: 'expense',
      icon: 'restaurant-outline',
      tileColor: '#E9DDF7',
      iconColor: '#1E1B2E',
    },
    {
      id: '5',
      title: 'Zara Autumn Coat',
      category: 'Shopping',
      emoji: '🛍️',
      time: '1:10 PM',
      amount: 129,
      type: 'expense',
      icon: 'shirt-outline',
      tileColor: '#F4B5B5',
      iconColor: '#8A1C2B',
    },
    {
      id: '6',
      title: 'Monthly Salary',
      category: 'Salary income',
      emoji: '🏦',
      time: '9:00 AM',
      amount: 3200,
      type: 'income',
      icon: 'business-outline',
      tileColor: '#93F5C3',
      iconColor: '#12372A',
    },
    {
      id: '7',
      title: 'Electric & Gas Utility',
      category: 'Bills',
      emoji: '⚡',
      time: '11:15 AM',
      amount: 112.5,
      type: 'expense',
      icon: 'flash-outline',
      tileColor: '#E9DDF7',
      iconColor: '#5B4B73',
    },
  ];

  const filtered =
    filter === 'all'
      ? transactions
      : transactions.filter(t => t.type === filter);

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
            <Text style={styles.headerDescription}>Review Your Cashflow</Text>
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
          <View style={styles.card}>
            {filtered.map(item => {
              const isIncome = item.type === 'income';
              return (
                <View key={item.id} style={styles.row}>
                  <View
                    style={[
                      styles.iconTile,
                      { backgroundColor: item.tileColor },
                    ]}
                  >
                    {/* <Ionicons
                      name={item.icon}
                      size={24}
                      color={item.iconColor}
                    /> */}
                  </View>

                  <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.subtitle} numberOfLines={1}>
                      {item.category} {item.emoji}  •  {item.time}
                    </Text>
                  </View>

                  <View style={styles.right}>
                    <Text
                      style={[styles.amount, isIncome && styles.amountIncome]}
                    >
                      {isIncome ? '+' : '-'}${item.amount.toFixed(2)}
                    </Text>
                    <View
                      style={[
                        styles.badge,
                        isIncome ? styles.badgeIncome : styles.badgeExpense,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          isIncome
                            ? styles.badgeTextIncome
                            : styles.badgeTextExpense,
                        ]}
                      >
                        {isIncome ? 'Income' : 'Expense'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
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
    fontSize: 19,
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

export default Activity;