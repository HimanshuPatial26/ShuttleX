import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius } from '../theme';

/**
 * The frosted glass panel that slides up from the bottom of most screens.
 */
export function Sheet({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[styles.sheet, style]}>
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.tint} />
      <LinearGradient
        colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.12 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.topBorder} pointerEvents="none" />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.sheet,
  },
  tint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,14,26,0.55)',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  content: {
    flex: 1,
    paddingTop: 22,
  },
});
