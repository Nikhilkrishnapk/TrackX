import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CommonStyles } from '../../utils/commonStyles';
import { PieChart } from 'react-native-gifted-charts';
import { EXPENSE_CATEGORIES } from '../../constants/categories';
import { Transaction } from '../../types';
import { startOfMonth } from '../../utils/date';
import { expensesByCategory, transactionsInMonth } from '../../utils/finance';
import { formatCurrency, formatCurrencyShort } from '../../utils/money';

const { width } = Dimensions.get('window');

type AnalyticsCardProps = {
  // Must include at least this month and last month.
  transactions: Transaction[];
};

const AnalyticsCard = ({ transactions }: AnalyticsCardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'thisMonth' | 'lastMonth'
  >('thisMonth');

  const { pieData, totalMinor } = useMemo(() => {
    const month = startOfMonth(new Date(), selectedPeriod === 'thisMonth' ? 0 : -1);
    const byCategory = expensesByCategory(transactionsInMonth(transactions, month));
    const data = EXPENSE_CATEGORIES.filter(c => (byCategory[c.id] ?? 0) > 0).map(c => ({
      value: byCategory[c.id] ?? 0,
      color: c.color,
      text: formatCurrencyShort(byCategory[c.id] ?? 0),
    }));
    return { pieData: data, totalMinor: data.reduce((sum, d) => sum + d.value, 0) };
  }, [transactions, selectedPeriod]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTxtContainer}>
          <Text style={styles.headerTxt}>Expenses{'\n'}Breakdown</Text>

          <Text style={styles.headerDescription}>
            Track where your money flows
          </Text>
        </View>

        {/* Month Toggle */}
        <View style={styles.headerBtnContainer}>
          <View style={styles.monthToggle}>
            {/* This Month */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.monthButton,
                selectedPeriod === 'thisMonth' && styles.activeMonthButton,
              ]}
              onPress={() => setSelectedPeriod('thisMonth')}
            >
              <Text
                style={[
                  styles.monthButtonText,
                  selectedPeriod === 'thisMonth' &&
                    styles.activeMonthButtonText,
                ]}
              >
                This{'\n'}Month
              </Text>
            </TouchableOpacity>

            {/* Last Month */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.monthButton,
                selectedPeriod === 'lastMonth' && styles.activeMonthButton,
              ]}
              onPress={() => setSelectedPeriod('lastMonth')}
            >
              <Text
                style={[
                  styles.monthButtonText,
                  selectedPeriod === 'lastMonth' &&
                    styles.activeMonthButtonText,
                ]}
              >
                Last{'\n'}Month
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* pie chart */}
      {pieData.length === 0 ? (
        <Text style={styles.emptyText}>
          No expenses {selectedPeriod === 'thisMonth' ? 'this month' : 'last month'} yet
        </Text>
      ) : (
        <View style={styles.pieChartContainer}>
          <View style={styles.pieChartInnerContainer}>
          <PieChart
            showText
            textColor="black"
            radius={80}
            textSize={12}
            showTextBackground
            textBackgroundRadius={-1}
            data={pieData}
          />
          </View>

          <View style={styles.pieChartDataIndicatorContainer}>
            {EXPENSE_CATEGORIES.map(category => (
              <View key={category.id} style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <View style={[styles.indicator, { backgroundColor: category.color }]}/>
                <Text>{category.name}</Text>
              </View>
            ))}
            <Text style={styles.totalText}>Total: {formatCurrency(totalMinor)}</Text>
          </View>
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: CommonStyles.borderRadius,
    overflow: 'hidden',
    marginTop: width * 0.025,
    padding: CommonStyles.padding,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTxtContainer: {
    flex: 1,
  },

  headerBtnContainer: {
    width: '48%',
    alignItems: 'flex-end',
  },

  headerTxt: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: width * CommonStyles.header,
    color: '#000000',
  },

  headerDescription: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.03,
    color: '#654F54',
    marginTop: width * 0.015,
  },

  // Outer pill
  monthToggle: {
    width: '100%',
    height: width * 0.15,
    backgroundColor: '#F3E8F5',
    borderRadius: width * 0.08,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Each option
  monthButton: {
    flex: 1,
    height: '100%',
    borderRadius: width * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Selected option
  activeMonthButton: {
    backgroundColor: '#FFFFFF',
  },

  monthButtonText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.032,
    lineHeight: width * 0.042,
    color: '#654F54',
    textAlign: 'center',
  },

  activeMonthButtonText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#201B20',
  },
  pieChartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    flexDirection: 'row',
    gap: 20,
  },

  pieChartDataIndicatorContainer: {
    flex: 1,
    gap: 10,
  },
  pieChartInnerContainer: {
    flex: 1,
  },

  indicator: {
    width: 20,
    height: 20,
    borderRadius: '50%',
  },

  totalText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: width * 0.032,
    color: '#201B20',
    marginTop: 4,
  },

  emptyText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.034,
    color: '#654F54',
    textAlign: 'center',
    paddingVertical: 40,
  },

});

export default AnalyticsCard;
