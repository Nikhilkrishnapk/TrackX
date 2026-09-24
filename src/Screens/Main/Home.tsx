import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { CommonStyles } from '../../utils/commonStyles';
import Greeting from '../../components/Greeting';
import TotalBalanceCard from '../../components/TotalBalanceCard';
import AnalyticsCard from '../../components/Analytics card';

const { height, width } = Dimensions.get('window');

const Home = () => {

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
          <Greeting/>

          {/* net balance card */}
          <TotalBalanceCard/>

          {/* analytics card that shows chart and scale of the current expense */}
          <AnalyticsCard/>

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
    // paddingBottom: 30,
  },


});

export default Home;
