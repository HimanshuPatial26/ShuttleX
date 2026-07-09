import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

/**
 * Fades + slides its children in on mount. Pass an incrementing `index` to
 * stagger a list of items into view.
 */
export function Entrance({
  children,
  index = 0,
  delay = 0,
  from = 'bottom',
  distance = 18,
  style,
}: {
  children: React.ReactNode;
  index?: number;
  delay?: number;
  from?: 'bottom' | 'top' | 'left' | 'right' | 'scale';
  distance?: number;
  style?: ViewStyle;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(delay + index * 70, withTiming(1, { duration: 460, easing: Easing.out(Easing.cubic) }));
  }, []);

  const animStyle = useAnimatedStyle(() => {
    const inv = 1 - t.value;
    const transform: any[] = [];
    if (from === 'bottom') transform.push({ translateY: inv * distance });
    if (from === 'top') transform.push({ translateY: -inv * distance });
    if (from === 'left') transform.push({ translateX: -inv * distance });
    if (from === 'right') transform.push({ translateX: inv * distance });
    if (from === 'scale') transform.push({ scale: 0.92 + t.value * 0.08 });
    return { opacity: t.value, transform };
  });

  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
}
