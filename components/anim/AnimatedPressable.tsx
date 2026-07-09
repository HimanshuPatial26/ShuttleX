import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

/**
 * Pressable that springs down slightly and dims on press — the tactile feel
 * behind every interactive glass surface.
 */
export function AnimatedPressable({
  children,
  style,
  onPress,
  scaleTo = 0.96,
  disabled,
  ...rest
}: Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle>; scaleTo?: number }) {
  const pressed = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 - pressed.value * (1 - scaleTo), { damping: 15, stiffness: 320 }) }],
    opacity: withTiming(disabled ? 0.4 : 1 - pressed.value * 0.12, { duration: 90 }),
  }));

  return (
    <AnimatedPressableBase
      {...rest}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      style={[style, animStyle]}
    >
      {children as React.ReactNode}
    </AnimatedPressableBase>
  );
}
