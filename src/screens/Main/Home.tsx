import React from 'react';
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
import { CommonStyles } from '../../utils/commonStyles';
import Greeting from '../../components/Greeting';
import TotalBalanceCard from '../../components/TotalBalanceCard';
import AnalyticsCard from '../../components/Analytics card';
import TransactionRow from '../../components/TransactionRow';
import { useAppData } from '../../context/AppDataContext';
import type { TabScreenProps } from '../../navigation/types';

const { width } = Dimensions.get('window');

const RECENT_COUNT = 5;

const Home = ({ navigation }: TabScreenProps<'Home'>) => {
  const { user, profile, recentTransactions, loading, error } = useAppData();

  const name = profile?.username || user.displayName || 'there';
  const latest = recentTransactions.slice(0, RECENT_COUNT);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header isBackButton={false} title="Home" />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* screen container */}
        <View
          style={{
            paddingHorizontal: width * 0.025,
            paddingVertical: width * 0.025,
          }}
        >
          {/* greetings */}
          <Greeting name={name} />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {loading ? (
            <ActivityIndicator style={styles.loader} size="large" color="#C4213A" />
          ) : (
            <>
              {/* net balance card (all-time totals) */}
              <TotalBalanceCard
                incomeMinor={profile?.totals.incomeMinor ?? 0}
                expenseMinor={profile?.totals.expenseMinor ?? 0}
                onAddMoney={() => navigation.navigate('AddBudget', { mode: 'income' })}
                onAnalytics={() => navigation.navigate('Budget')}
              />

              {/* analytics card that shows chart and scale of the current expense */}
              <AnalyticsCard transactions={recentTransactions} />

              {/* recent transactions */}
              <View style={styles.recentCard}>
                <View style={styles.recentHeader}>
                  <Text style={styles.recentTitle}>Recent Transactions</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
                    <Text style={styles.seeAll}>See all</Text>
                  </TouchableOpacity>
                </View>

                {latest.length === 0 ? (
                  <Text style={styles.emptyText}>
                    No transactions yet. Tap + to add your first one.
                  </Text>
                ) : (
                  latest.map(t => <TransactionRow key={t.id} transaction={t} />)
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    paddingBottom: 30,
  },

  loader: {
    marginTop: 60,
  },

  errorText: {
    marginTop: 8,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.032,
    color: '#C4213A',
  },

  recentCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: CommonStyles.borderRadius,
    marginTop: width * 0.025,
    paddingHorizontal: CommonStyles.padding,
    paddingVertical: 14,
  },

  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  recentTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: width * 0.042,
    color: '#000000',
  },

  seeAll: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: width * 0.032,
    color: '#C4213A',
  },

  emptyText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.034,
    color: '#654F54',
    paddingVertical: 16,
  },
});

export default Home;
