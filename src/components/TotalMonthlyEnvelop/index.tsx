import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DownArrow from '../../assets/images/down-arrow.svg';
import WalletIcon from '../../assets/images/wallet-icons.svg';
import { CommonStyles } from '../../utils/commonStyles';

const {width} = Dimensions.get('window');

const TotalMonthlyEnvelop = () => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <LinearGradient
      colors={['#C4213A', '#3A1230', '#1A0E24']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>TOTAL MONTHLY ENVELOPE</Text>
        </View>

        {/* Currency */}
        <View style={styles.currencyContainer}>
          <Text style={styles.currencyText}>IND (₹)</Text>
        </View>
      </View>

      {/* ================= BALANCE ================= */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>
          {showBalance ? '₹ 8,450.20' : '- - - - -'}
        </Text>
      </View>

      {/* ================= INCOME / EXPENSE ================= */}
      <View style={styles.summaryContainer}>

        {/* Income */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.incomeIcon}>
                <DownArrow/>
            </View>

            <Text style={styles.summaryTitle}>
              Spend so far
            </Text>
          </View>

          <Text style={styles.summaryAmount}>
            ₹ 4,800.00
          </Text>
        </View>

        {/* Expense */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.expenseIcon}>
                <WalletIcon width={width * 0.043} height={width * 0.043}/>
            </View>

            <Text style={styles.summaryTitle}>
              Remaining
            </Text>
          </View>

          <Text style={[styles.summaryAmount, {color: 'green'}]}>
            ₹ 2,145.80
          </Text>
        </View>

      </View>

      {/* remaning days */}

      <View style={styles.detailsContainer}>
  <View>
    <Text style={styles.detailsTitle}>Monthly Details</Text>
    <Text style={styles.detailsSubtitle}>Remaining Days</Text>
  </View>

  <Text style={styles.detailsArrow}>8</Text>
</View>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // ================= CONTAINER =================

  container: {
    width: '100%',
    borderRadius: CommonStyles.borderRadius,
    padding: CommonStyles.padding,
    overflow: 'hidden',
    marginTop: width * 0.025,
  },

  // ================= HEADER =================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  title: {
    color: CommonStyles.grey,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.038,
  },

  currencyContainer: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },

  currencyText: {
    color: '#E5DCE0',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: width * 0.032,
  },

  // ================= BALANCE =================

  balanceContainer: {
    marginTop: 18,
  },

  balanceText: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: width * 0.075,
  },

  // ================= SUMMARY =================

  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  
  summaryCard: {
    height: 110, // same height for both
    width: width * 0.4,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 20,
    padding: 14,
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  incomeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#61F5C2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  expenseIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E8DDE2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconText: {
    color: '#E8DDE2',
    fontSize: 17,
    fontFamily: 'PlusJakartaSans-Bold',
  },

  summaryTitle: {
    flex: 1,
    color: '#D8CDD3',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: width * 0.029,
  },

  summaryAmount: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: width * 0.043,
    marginTop: 10,
  },

  // ================= ACTIONS =================

  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },

  actionButton: {
    width: width * 0.4,
    height: 58,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.20)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  actionIcon: {
    color: '#FFFFFF',
    fontSize: 23,
  },

  actionText: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: width * 0.031,
    textAlign: 'center',
  },

//   remaining days 
detailsContainer: {
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  detailsTitle: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: width * 0.038,
    color: '#FFFFFF',
  },
  
  detailsSubtitle: {
    marginTop: 4,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.029,
    color: '#CFC4CC',
  },
  
  detailsArrow: {
    fontSize: 28,
    color: '#FFFFFF',
  },
});

export default TotalMonthlyEnvelop;