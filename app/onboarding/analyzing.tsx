import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
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
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: messages.length * 700,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

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
    }, messages.length * 700 + 400);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const widthInterpolate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.spinnerWrap}>
          <Text style={styles.spinnerGlyph}>✳︎</Text>
        </View>
        <Text style={styles.title}>Analyzing your finances…</Text>
        <Text style={styles.message}>{messages[step]}</Text>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: widthInterpolate }]} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  spinnerWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  spinnerGlyph: { fontSize: 36, color: colors.accent },
  title: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '800', marginBottom: 10 },
  message: { color: colors.textSecondary, fontSize: fontSizes.base, marginBottom: spacing.xxl, textAlign: 'center' },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.bgCard,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: radius.pill },
});
