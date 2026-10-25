import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CommonStyles} from '../../utils/commonStyles';
import {formatCurrency} from '../../utils/money';

const {width} = Dimensions.get('window');

const EXCEEDED_COLOR = '#C4213A';

interface ExpenseLimitCardProps {
  scaleColor: string;
  title: string;
  // amounts in paise
  spentMinor: number;
  limitMinor: number;
  icon: React.ReactNode;
  remainingDays: number;
  onPress?: () => void;
}

const BudgetScale = ({
  scaleColor,
  title,
  spentMinor,
  limitMinor,
  icon,
  remainingDays,
  onPress,
}: ExpenseLimitCardProps) => {
  const percentage = limitMinor > 0 ? (spentMinor / limitMinor) * 100 : 0;
  const remainingMinor = limitMinor - spentMinor;
  const isExceeded = remainingMinor < 0;
  const dailySafeMinor =
    !isExceeded && remainingDays > 0 ? Math.floor(remainingMinor / remainingDays) : 0;
  const barColor = isExceeded ? EXCEEDED_COLOR : scaleColor;

  // Prevent the progress bar from exceeding 100%
  const progress = Math.min(Math.max(percentage, 0), 100);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={!onPress}
      onPress={onPress}
      style={styles.container}>
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
            {Math.round(percentage)}% of {formatCurrency(limitMinor)}
          </Text>
        </View>

        {/* Amount */}
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>
            {formatCurrency(spentMinor)}
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
              backgroundColor: barColor,
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
                color: barColor,
              },
            ]}>
            {isExceeded
              ? `Over by ${formatCurrency(-remainingMinor)}`
              : `${formatCurrency(remainingMinor)} left`}
          </Text>
        </View>

        <Text style={styles.dailySafeText}>
          Daily safe: {formatCurrency(dailySafeMinor)}
        </Text>
      </View>
    </TouchableOpacity>
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