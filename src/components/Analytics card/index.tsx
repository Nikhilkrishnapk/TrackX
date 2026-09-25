import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CommonStyles } from '../../utils/commonStyles';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { colorStyles } from '../../constants/colors';

const { width } = Dimensions.get('window');

const AnalyticsCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'thisMonth' | 'lastMonth'
  >('thisMonth');

  //   data for pie chart
  const pieData = [
    { value: 54, color: '#177AD5', text: '₹54' },
    { value: 40, color: '#79D2DE', text: '₹30' },
    { value: 20, color: '#ED6665', text: '₹26' },
  ];

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

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <View style={styles.foodAndDiningIndicator}/>
                <Text>Food and Dinning</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <View style={styles.billAndUtilitiesIndicator}/>
                <Text>Bill and Utilities</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <View style={styles.ShoppingIndicator}/>
                <Text>Shopping</Text>
            </View>
        </View>
      </View>

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

  foodAndDiningIndicator:{
    width: 20,
    height: 20,
    backgroundColor: colorStyles.foodAndDinning,
    borderRadius: '50%',
  },
  billAndUtilitiesIndicator:{
    width: 20,
    height: 20,
    backgroundColor: colorStyles.billAndUtilities,
    borderRadius: '50%',
  },
  ShoppingIndicator:{
    width: 20,
    height: 20,
    backgroundColor: colorStyles.shopping,
    borderRadius: '50%',
  } 

});

export default AnalyticsCard;
