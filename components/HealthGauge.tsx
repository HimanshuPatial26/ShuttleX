import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme';
import { AnimatedNumber } from './anim/AnimatedNumber';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function gradientFor(score: number): [string, string] {
  if (score >= 75) return [colors.teal, colors.success];
  if (score >= 50) return [colors.accent, colors.violet];
  return [colors.pink, colors.warning];
}

export function HealthGauge({ score, size = 132, animate = true }: { score: number; size?: number; animate?: boolean }) {
  const compact = size < 100;
  const stroke = compact ? 7 : 12;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = Math.max(0, Math.min(100, score)) / 100;
  const [g0, g1] = gradientFor(score);
  const scoreFontSize = Math.round(size * 0.29);

  const sweep = useSharedValue(animate ? 0 : progress);

  useEffect(() => {
    sweep.value = withTiming(progress, { duration: 1100, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - sweep.value),
  }));

  const gid = React.useId().replace(/:/g, '');

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Defs>
          <LinearGradient id={`g-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={g0} />
            <Stop offset="100%" stopColor={g1} />
          </LinearGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#g-${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          fill="none"
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        {animate ? (
          <AnimatedNumber value={score} style={[styles.score, { fontSize: scoreFontSize }]} />
        ) : (
          <Text style={[styles.score, { fontSize: scoreFontSize }]}>{score}</Text>
        )}
        {!compact && <Text style={styles.label}>Health Score</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontWeight: '800',
    color: colors.textPrimary,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
