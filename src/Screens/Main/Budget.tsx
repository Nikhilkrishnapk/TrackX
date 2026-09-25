import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { signOutUser } from '../../services/firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import TotalMonthlyEnvelop from '../../components/TotalMonthlyEnvelop';

const {width, height} = Dimensions.get('window');

const Budget = () => {

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header isBackButton={false} title="Budgets" />
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* screen container */}
        <View
          style={{
            paddingHorizontal: width * 0.025,
            paddingVertical: width * 0.025,
          }}
        >
        

          {/* net balance card */}
          <TotalMonthlyEnvelop/>

 

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
