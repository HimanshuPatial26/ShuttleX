import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Screen } from '../../components/Screen';
import { LiquidBackground, Orb3D } from '../../components/anim';
import { colors, fontSizes, radius, spacing } from '../../theme';
import { useApp } from '../../lib/store';

const messages = [
  'Importing your transactions…',
  'Categorizing spending patterns…',
  'Detecting recurring subscriptions…',
  'Calculating your Financial Health Score…',
  'Preparing personalized recommendations…',
];

export default function Analyzing() {
  const router = useRouter();
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const progress = useSharedValue(0);
  const spin = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: messages.length * 700, easing: Easing.linear });
    spin.value = withRepeat(withTiming(1, { duration: 6000, easing: Easing.linear }), -1, false);

    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= messages.length - 1) {
          clearInterval(interval);
          return s;
        }
        return s + 1;
      });
    }, 700);

    const timeout = setTimeout(() => {
      completeOnboarding({});
      router.replace('/(tabs)');
    }, messages.length * 700 + 500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const barStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));
  const ringStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value * 360}deg` }] }));

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <LiquidBackground variant="violet" />
      <View style={styles.content}>
        <View style={styles.orbStage}>
          <Animated.View style={[styles.ring, ringStyle]}>
            <View style={[styles.ringDot, { top: -5 }]} />
            <View style={[styles.ringDot, { bottom: -5 }]} />
          </Animated.View>
          <Orb3D
            size={130}
            colorLight="#C9B8FF"
            colorMid={colors.violet}
            colorDark="#5A3AB0"
            glyph={<Text style={styles.orbGlyph}>✳︎</Text>}
          />
        </View>

        <Text style={styles.title}>Analyzing your finances…</Text>
        <Text style={styles.message}>{messages[step]}</Text>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFillWrap, barStyle]}>
            <LinearGradient
              colors={colors.gradientAccent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  orbStage: { width: 180, height: 180, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xxl },
  ring: {
    position: 'absolute',
    width: 172,
    height: 172,
    borderRadius: 86,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  ringDot: {
    position: 'absolute',
    alignSelf: 'center',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.teal,
  },
  orbGlyph: { fontSize: 40, color: 'rgba(255,255,255,0.92)', fontWeight: '300' },
  title: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '800', marginBottom: 10 },
  message: { color: colors.textSecondary, fontSize: fontSizes.base, marginBottom: spacing.xxl, textAlign: 'center' },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  progressFillWrap: { height: '100%', borderRadius: radius.pill, overflow: 'hidden' },
});
