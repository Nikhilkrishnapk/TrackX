import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import TotalMonthlyEnvelop from '../../components/TotalMonthlyEnvelop';
import BudgetScale from '../../components/BudgetScale';
import FoodAndDinning from '../../assets/images/food-icon.svg';
import BillAndUtilities from '../../assets/images/bill-icon.svg';
import Shopping from '../../assets/images/shopping-icon.svg';
import { colorStyles } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const Budget = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header isBackButton={false} title="Budgets" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* screen container */}
        <View
          style={{
            paddingHorizontal: width * 0.025,
            paddingVertical: width * 0.025,
          }}
        >
          {/* net balance card */}
          <TotalMonthlyEnvelop />

          {/* scale for food and dining */}
          <BudgetScale
           key={1}
           title={'Food and Dinning'}
           value={130}
           totalExpense={400}
           scaleColor={colorStyles.foodAndDinning}
           remainingDays={23}
           dailySafeAmount={92}
           icon={<FoodAndDinning width={30} height={30} />}
           />

           {/* bill and utiltites */}
           <BudgetScale
           key={1}
           title={'Bill and Utilities'}
           value={150}
           totalExpense={400}
           scaleColor={colorStyles.billAndUtilities}
           remainingDays={22}
           dailySafeAmount={91}
           icon={<BillAndUtilities width={30} height={30} />}
           />

          {/* shopping */}
          <BudgetScale
           key={1}
           title={'Shopping'}
           value={180}
           totalExpense={400}
           scaleColor={colorStyles.shopping}
           remainingDays={21}
           dailySafeAmount={93}
           icon={<Shopping width={30} height={30} />}
           />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});

export default Budget;