import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import WavingHandImoji from '../../assets/images/waving-hand.svg';
import { CommonStyles } from '../../utils/commonStyles';

const { height, width } = Dimensions.get('window');

const Greeting = () => {
  // animation of the hand imoji
  const handPosition = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(handPosition, {
          toValue: -5,
          duration: 500,
          useNativeDriver: true,
        }),

        Animated.timing(handPosition, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [handPosition]);
  return (
    <View>
      <View style={styles.greetingsContainer}>
        <Text style={styles.greetingText}>Good morning, USERNAME</Text>
        <Animated.View
          style={{
            transform: [
              {
                translateY: handPosition,
              },
            ],
          }}
        >
          <WavingHandImoji width={width * 0.08} height={width * 0.08} />
        </Animated.View>
      </View>
      <Text style={styles.greetingCatpion}>
        Here is your financial snapshot today
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    paddingBottom: 30,
  },

  greetingText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: width * CommonStyles.header,
  },

  greetingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingCatpion: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.03,
  },
});

export default Greeting;
