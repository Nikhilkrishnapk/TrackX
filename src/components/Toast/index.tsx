import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'info';

export interface ToastOptions {
  type?: ToastType;
  title: string;
  message?: string;
  // Optional inline action, e.g. "Undo".
  actionLabel?: string;
  onAction?: () => void;
  // Milliseconds before auto-dismiss.
  duration?: number;
}

interface ToastApi {
  show: (options: ToastOptions) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

type ActiveToast = ToastOptions & { id: number };

const DEFAULT_DURATION = 3000;
const ACTION_DURATION = 5000;
const HIDDEN_OFFSET = -160;

const THEMES: Record<ToastType, { gradient: string[]; accent: string }> = {
  success: { gradient: ['#3C8D6A', '#2E6B4F', '#12372A'], accent: '#2E6B4F' },
  error: { gradient: ['#C4213A', '#3A1230', '#1A0E24'], accent: '#C4213A' },
  info: { gradient: ['#3A1230', '#1A0E24'], accent: '#3A1230' },
};

function ToastIcon({ type }: { type: ToastType }) {
  const common = { stroke: '#FFFFFF', strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      {type === 'success' && <Path d="M5 12.5l4.5 4.5L19 7.5" {...common} />}
      {type === 'error' && <Path d="M7 7l10 10M17 7L7 17" {...common} />}
      {type === 'info' && <Path d="M12 11v6M12 7.5v.01" {...common} />}
    </Svg>
  );
}

const ToastContext = createContext<ToastApi | null>(null);

// Wrap the app once (App.tsx); call useToast() anywhere below it.
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ActiveToast | null>(null);
  const nextId = useRef(0);

  const show = useCallback((options: ToastOptions) => {
    nextId.current += 1;
    setToast({ ...options, id: nextId.current });
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (title, message) => show({ type: 'success', title, message }),
      error: (title, message) => show({ type: 'error', title, message }),
      info: (title, message) => show({ type: 'info', title, message }),
    }),
    [show],
  );

  // Only clear if the toast that finished hiding is still the current one.
  const handleHidden = useCallback((id: number) => {
    setToast(current => (current?.id === id ? null : current));
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast ? <ToastCard key={toast.id} toast={toast} onHidden={handleHidden} /> : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return api;
}

function ToastCard({ toast, onHidden }: { toast: ActiveToast; onHidden: (id: number) => void }) {
  const insets = useSafeAreaInsets();
  const type = toast.type ?? 'info';
  const theme = THEMES[type];
  const duration = toast.duration ?? (toast.actionLabel ? ACTION_DURATION : DEFAULT_DURATION);

  const translateY = useRef(new Animated.Value(HIDDEN_OFFSET)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const progress = useRef(new Animated.Value(1)).current;
  const hiding = useRef(false);

  const hide = useCallback(() => {
    if (hiding.current) {
      return;
    }
    hiding.current = true;
    Animated.parallel([
      Animated.timing(translateY, { toValue: HIDDEN_OFFSET, duration: 220, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onHidden(toast.id));
  }, [translateY, opacity, onHidden, toast.id]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, friction: 8, tension: 70, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 7, useNativeDriver: true }),
    ]).start();

    // Countdown bar; width can't use the native driver.
    const countdown = Animated.timing(progress, { toValue: 0, duration, useNativeDriver: false });
    countdown.start();
    const timer = setTimeout(hide, duration);
    return () => {
      clearTimeout(timer);
      countdown.stop();
    };
  }, [translateY, opacity, scale, progress, duration, hide]);

  // Swipe up to dismiss.
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
        onPanResponderMove: (_, g) => translateY.setValue(Math.min(g.dy, 0)),
        onPanResponderRelease: (_, g) => {
          if (g.dy < -30 || g.vy < -0.5) {
            hide();
          } else {
            Animated.spring(translateY, { toValue: 0, friction: 7, useNativeDriver: true }).start();
          }
        },
      }),
    [translateY, hide],
  );

  const handleAction = () => {
    toast.onAction?.();
    hide();
  };

  return (
    <View pointerEvents="box-none" style={[styles.host, { top: insets.top + 8 }]}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.card, { opacity, transform: [{ translateY }, { scale }] }]}
      >
        <Pressable style={styles.row} onPress={hide} accessibilityRole="alert">
          <LinearGradient
            colors={theme.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconBadge}
          >
            <ToastIcon type={type} />
          </LinearGradient>

          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {toast.title}
            </Text>
            {toast.message ? (
              <Text style={styles.message} numberOfLines={2}>
                {toast.message}
              </Text>
            ) : null}
          </View>

          {toast.actionLabel ? (
            <TouchableOpacity
              onPress={handleAction}
              activeOpacity={0.8}
              style={[styles.actionButton, { borderColor: theme.accent }]}
            >
              <Text style={[styles.actionText, { color: theme.accent }]}>
                {toast.actionLabel.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ) : null}
        </Pressable>

        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                backgroundColor: theme.accent,
                width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 1000,
    elevation: 1000,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#1A0E24',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: width * 0.038,
    color: '#1E1B2E',
  },
  message: {
    marginTop: 2,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: width * 0.032,
    color: '#654F54',
  },
  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  actionText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#F1E8F3',
  },
  progressBar: {
    height: '100%',
  },
});
