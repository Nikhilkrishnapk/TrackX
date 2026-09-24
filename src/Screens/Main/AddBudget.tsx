import React from 'react';
import {  Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { signOutUser } from '../../services/firebase/auth';
import Header from '../../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

const {height, width} = Dimensions.get('window');

const AddBudget = () => {


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <Header isBackButton={false} title="Add Transaction" />
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
        

      </View>
    </ScrollView>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'PlusJakartaSans-Regular',
  },
});

export default AddBudget;
