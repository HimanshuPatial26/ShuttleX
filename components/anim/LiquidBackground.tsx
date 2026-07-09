import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme';

interface OrbSpec {
  color: string;
  size: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
  duration: number;
  opacity: number;
}

/**
 * A living "liquid glass" backdrop: several large, soft color orbs drift slowly
 * behind a heavy blur so they melt into a smooth animated mesh gradient.
 */
export function LiquidBackground({
  variant = 'aurora',
  intensity = 60,
}: {
  variant?: 'aurora' | 'violet' | 'teal' | 'sunset';
  intensity?: number;
}) {
  const { width, height } = useWindowDimensions();

  const palettes: Record<string, string[]> = {
    aurora: [colors.orbViolet, colors.orbBlue, colors.orbTeal, colors.orbPink],
    violet: [colors.orbViolet, colors.orbBlue, colors.orbViolet, colors.orbPink],
    teal: [colors.orbTeal, colors.orbBlue, colors.orbTeal, colors.orbViolet],
    sunset: [colors.orbPink, colors.orbViolet, colors.orbBlue, colors.orbPink],
  };
  const p = palettes[variant] ?? palettes.aurora;

  const orbs: OrbSpec[] = [
    { color: p[0], size: width * 0.95, startX: -width * 0.3, startY: -height * 0.05, dx: 40, dy: 60, duration: 9000, opacity: 0.55 },
    { color: p[1], size: width * 0.85, startX: width * 0.45, startY: height * 0.02, dx: -50, dy: 40, duration: 11000, opacity: 0.5 },
    { color: p[2], size: width * 0.9, startX: width * 0.1, startY: height * 0.35, dx: 60, dy: -50, duration: 13000, opacity: 0.45 },
    { color: p[3], size: width * 0.7, startX: width * 0.5, startY: height * 0.55, dx: -40, dy: -60, duration: 10000, opacity: 0.4 },
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]} />
      {orbs.map((orb, i) => (
        <Orb key={i} orb={orb} />
      ))}
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(7,10,20,0.28)' }]} />
    </View>
  );
}

function Orb({ orb }: { orb: OrbSpec }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: orb.duration, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb.startX + t.value * orb.dx },
      { translateY: orb.startY + t.value * orb.dy },
      { scale: 1 + t.value * 0.12 },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: orb.size,
          height: orb.size,
          borderRadius: orb.size / 2,
          backgroundColor: orb.color,
          opacity: orb.opacity,
        },
        style,
      ]}
    />
  );
}
