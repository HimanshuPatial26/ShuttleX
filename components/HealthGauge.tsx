import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme';

function scoreColor(score: number) {
  if (score >= 75) return colors.success;
  if (score >= 50) return colors.warning;
  return colors.danger;
}

export function HealthGauge({ score, size = 132 }: { score: number; size?: number }) {
  const compact = size < 100;
  const stroke = compact ? 7 : 12;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = Math.max(0, Math.min(100, score)) / 100;
  const dashOffset = circumference * (1 - progress);
  const color = scoreColor(score);
  const scoreFontSize = Math.round(size * 0.29);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          fill="none"
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Text style={[styles.score, { fontSize: scoreFontSize }]}>{score}</Text>
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
    fontWeight: '700',
    color: colors.textPrimary,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
