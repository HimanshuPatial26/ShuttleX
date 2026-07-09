import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { AnimatedPressable } from './anim/AnimatedPressable';
import { colors } from '../theme';

const icons: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }> = {
  index: { on: 'home', off: 'home-outline' },
  card: { on: 'card', off: 'card-outline' },
  assistant: { on: 'sparkles', off: 'sparkles-outline' },
  goals: { on: 'flag', off: 'flag-outline' },
  more: { on: 'grid', off: 'grid-outline' },
};

const labels: Record<string, string> = {
  index: 'Home',
  card: 'Card',
  assistant: 'Assistant',
  goals: 'Goals',
  more: 'More',
};

export function GlassTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
      <View style={styles.bar}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.barTint} />
        <LinearGradient
          colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.barBorder} pointerEvents="none" />

        {state.routes.map((route: { key: string; name: string }, index: number) => {
          const focused = state.index === index;
          const meta = icons[route.name] ?? { on: 'ellipse', off: 'ellipse-outline' };
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <TabItem
              key={route.key}
              focused={focused}
              iconOn={meta.on}
              iconOff={meta.off}
              label={labels[route.name] ?? route.name}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabItem({
  focused,
  iconOn,
  iconOff,
  label,
  onPress,
}: {
  focused: boolean;
  iconOn: keyof typeof Ionicons.glyphMap;
  iconOff: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const f = useSharedValue(focused ? 1 : 0);
  f.value = withSpring(focused ? 1 : 0, { damping: 16, stiffness: 220 });

  const glowStyle = useAnimatedStyle(() => ({
    opacity: f.value,
    transform: [{ scale: 0.6 + f.value * 0.4 }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(focused ? -2 : 0, { duration: 160 }) }],
  }));

  return (
    <AnimatedPressable style={styles.item} onPress={onPress} scaleTo={0.9}>
      <Animated.View style={[styles.glow, glowStyle]}>
        <LinearGradient
          colors={colors.gradientAccent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={iconStyle}>
        <Ionicons name={focused ? iconOn : iconOff} size={22} color={focused ? colors.white : colors.textMuted} />
      </Animated.View>
      <Text style={[styles.label, { color: focused ? colors.accent : colors.textMuted }]}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 12,
    paddingTop: 8,
    alignItems: 'center',
    backgroundColor: colors.bgDeep,
  },
  bar: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 26,
    overflow: 'hidden',
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: colors.glass,
    ...(Platform.OS === 'web' ? { boxShadow: '0 12px 30px rgba(0,0,0,0.4)' } : {}),
  },
  barTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,14,26,0.5)',
  },
  barBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  glow: {
    position: 'absolute',
    top: -2,
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    opacity: 0,
  },
  label: { fontSize: 10.5, fontWeight: '700' },
});
