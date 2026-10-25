import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import Logo from '../../assets/images/trackXlogo.svg';

const { width } = Dimensions.get('window');

const LOGO_SIZE = width * 0.8;
const RING_SIZE = width * 0.55;
const MIN_VISIBLE_MS = 1600;
const DOT_COLORS = ['#C4213A', '#3A1230', '#1A0E24'];

type SplashScreenProps = {
  // Becomes true once the app is ready to show (auth state restored).
  ready: boolean;
  onFinish: () => void;
};

// Animated splash shown on top of the app at launch. The native launch
// screen is plain white, so this continues it without a visible jump.
const SplashScreen = ({ ready, onFinish }: SplashScreenProps) => {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const tagline = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const dots = useRef(DOT_COLORS.map(() => new Animated.Value(0))).current;
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Intro + looping animations.
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(tagline, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const ringLoop = Animated.loop(
      Animated.timing(ring, {
        toValue: 1,
        duration: 1600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );
    ringLoop.start();

    const dotsLoop = Animated.loop(
      Animated.stagger(
        150,
        dots.map(dot =>
          Animated.sequence([
            Animated.timing(dot, { toValue: 1, duration: 280, useNativeDriver: true }),
            Animated.timing(dot, { toValue: 0, duration: 280, useNativeDriver: true }),
          ]),
        ),
      ),
    );
    dotsLoop.start();

    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_VISIBLE_MS);
    return () => {
      clearTimeout(timer);
      ringLoop.stop();
      dotsLoop.stop();
    };
  }, [logoScale, logoOpacity, ring, tagline, dots]);

  // Exit once the app is ready and the intro had time to play.
  useEffect(() => {
    if (!ready || !minTimeElapsed) {
      return;
    }
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 380,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, { toValue: 1.15, duration: 380, useNativeDriver: true }),
    ]).start(({ finished }) => finished && onFinish());
  }, [ready, minTimeElapsed, screenOpacity, logoScale, onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <View style={styles.center}>
        {/* soft pulsing ring behind the logo */}
        <Animated.View
          style={[
            styles.ring,
            {
              opacity: ring.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] }),
              transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.4] }) }],
            },
          ]}
        />
        <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
          <Logo width={LOGO_SIZE} height={LOGO_SIZE} />
        </Animated.View>
      </View>

      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: tagline,
            transform: [{ translateY: tagline.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
          },
        ]}
      >
        Every rupee, tracked.
      </Animated.Text>

      <View style={styles.dotsRow}>
        {dots.map((dot, index) => (
          <Animated.View
            key={DOT_COLORS[index]}
            style={[
              styles.dot,
              {
                backgroundColor: DOT_COLORS[index],
                opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
                transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }],
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    elevation: 2000,
  },
  center: {
    width: LOGO_SIZE,
    height: LOGO_SIZE * 0.45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 2,
    borderColor: '#0C50C4',
  },
  tagline: {
    marginTop: 4,
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: width * 0.04,
    color: '#654F54',
    letterSpacing: 0.5,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default SplashScreen;
