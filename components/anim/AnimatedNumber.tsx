import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * Counts up from 0 to `value` on mount / whenever value changes.
 */
export function AnimatedNumber({
  value,
  style,
  duration = 900,
  format = (n) => String(Math.round(n)),
}: {
  value: number;
  style?: TextStyle | TextStyle[];
  duration?: number;
  format?: (n: number) => string;
}) {
  const progress = useSharedValue(0);
  const [display, setDisplay] = useState(() => format(0));

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(value, { duration, easing: Easing.out(Easing.cubic) });
  }, [value]);

  useAnimatedReaction(
    () => progress.value,
    (v) => {
      runOnJS(setDisplay)(format(v));
    }
  );

  return <Text style={style}>{display}</Text>;
}
