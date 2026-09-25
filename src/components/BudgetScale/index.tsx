import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {CommonStyles} from '../../utils/commonStyles';

const {width} = Dimensions.get('window');

interface ExpenseLimitCardProps {
  scaleColor: string;
  title: string;
  value: number;
  totalExpense: number;
  icon: React.ReactNode;
  remainingDays: number;
  dailySafeAmount: number;
}

const BudgetScale = ({
  scaleColor,
  title,
  value,
  totalExpense,
  icon,
  remainingDays,
  dailySafeAmount,
}: ExpenseLimitCardProps) => {
  const percentage =
    totalExpense > 0
      ? (value / totalExpense) * 100
      : 0;

  // Prevent the progress bar from exceeding 100%
  const progress = Math.min(Math.max(percentage, 0), 100);

  return (
    <View style={styles.container}>
      {/* Top section */}
      <View style={styles.topContainer}>
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: `${scaleColor}18`,
            },
          ]}>
          {icon}
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text
            style={styles.title}
            numberOfLines={1}>
            {title}
          </Text>

          <Text style={styles.limitText}>
            {Math.round(percentage)}% of total
          </Text>
        </View>

        {/* Amount */}
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>
            ${value.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progress,
            {
              width: `${progress}%`,
              backgroundColor: scaleColor,
            },
          ]}
        />
      </View>

      {/* Bottom section */}
      <View style={styles.bottomContainer}>
        <View style={styles.remainingContainer}>
          <Text
            style={[
              styles.remainingText,
              {
                color: scaleColor,
              },
            ]}>
            ${value.toFixed(2)} spent
          </Text>
        </View>

        <Text style={styles.dailySafeText}>
          Daily safe: ${dailySafeAmount.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: CommonStyles.borderRadius,
    padding: width * 0.045,
    marginTop: width * 0.025,
  },

  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.045,
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleContainer: {
    flex: 1,
    marginLeft: width * 0.035,
  },

  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: width * 0.041,
    color: '#201B20',
  },

  limitText: {
    marginTop: 2,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.032,
    color: '#654F54',
  },

  amountContainer: {
    alignItems: 'flex-end',
  },

  amount: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: width * 0.052,
    color: '#201B20',
  },

  progressBackground: {
    width: '100%',
    height: 8,
    borderRadius: 10,
    backgroundColor: '#F1E8F3',
    marginTop: width * 0.04,
    overflow: 'hidden',
  },

  progress: {
    height: '100%',
    borderRadius: 10,
  },

  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: width * 0.035,
  },

  remainingContainer: {
    flex: 1,
  },

  remainingText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.032,
  },

  dailySafeText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.032,
    color: '#654F54',
  },
});

export default BudgetScale;