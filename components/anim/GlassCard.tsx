import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius } from '../../theme';

/**
 * Frosted glass surface: blur + translucent fill + a top-edge highlight sheen
 * and a hairline border, for that "liquid glass" material look.
 */
export function GlassCard({
  children,
  style,
  intensity = 24,
  radius: r = radius.lg,
  highlight = true,
  tint = 'light',
}: {
  children?: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  radius?: number;
  highlight?: boolean;
  tint?: 'light' | 'dark';
}) {
  return (
    <View style={[styles.wrap, { borderRadius: r }, style]}>
      <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.fill, { borderRadius: r }]} />
      {highlight && (
        <LinearGradient
          colors={['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.02)', 'rgba(255,255,255,0)']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.6, y: 0.7 }}
          style={[StyleSheet.absoluteFill, { borderRadius: r }]}
          pointerEvents="none"
        />
      )}
      <View style={[styles.border, { borderRadius: r }]} pointerEvents="none" />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: colors.glass,
  },
  fill: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  content: {
    padding: 16,
  },
});
