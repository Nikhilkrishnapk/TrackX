import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import WavingHandImoji from '../../assets/images/waving-hand.svg';
import { CommonStyles } from '../../utils/commonStyles';
import { getGreeting } from '../../utils/date';

const { width } = Dimensions.get('window');

type GreetingProps = {
  name: string;
};

const Greeting = ({ name }: GreetingProps) => {
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
        <Text style={styles.greetingText} numberOfLines={1}>
          {getGreeting()}, {name}
        </Text>
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
    flexShrink: 1,
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
