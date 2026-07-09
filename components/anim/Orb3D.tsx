import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop, Circle } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/**
 * A pseudo-3D glossy sphere rendered with SVG radial gradients (highlight →
 * body → shaded rim) plus a soft contact shadow. Gently floats up and down.
 */
export function Orb3D({
  size = 120,
  colorLight,
  colorMid,
  colorDark,
  float = true,
  delay = 0,
  style,
  glyph,
}: {
  size?: number;
  colorLight: string;
  colorMid: string;
  colorDark: string;
  float?: boolean;
  delay?: number;
  style?: ViewStyle;
  glyph?: React.ReactNode;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    if (!float) return;
    const start = setTimeout(() => {
      t.value = withRepeat(withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }), -1, true);
    }, delay);
    return () => clearTimeout(start);
  }, [float, delay]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -6 + t.value * 12 }],
  }));

  const id = React.useId().replace(/:/g, '');

  return (
    <Animated.View style={[{ width: size, height: size * 1.14, alignItems: 'center' }, animStyle, style]}>
      <Svg width={size} height={size * 1.14} viewBox={`0 0 ${size} ${size * 1.14}`}>
        <Defs>
          <RadialGradient id={`sphere-${id}`} cx="35%" cy="30%" r="75%">
            <Stop offset="0%" stopColor={colorLight} />
            <Stop offset="45%" stopColor={colorMid} />
            <Stop offset="100%" stopColor={colorDark} />
          </RadialGradient>
          <RadialGradient id={`shadow-${id}`} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="rgba(0,0,0,0.45)" />
            <Stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </RadialGradient>
          <RadialGradient id={`gloss-${id}`} cx="35%" cy="25%" r="35%">
            <Stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </RadialGradient>
        </Defs>

        {/* contact shadow */}
        <Ellipse cx={size / 2} cy={size * 1.06} rx={size * 0.34} ry={size * 0.06} fill={`url(#shadow-${id})`} />
        {/* sphere body */}
        <Circle cx={size / 2} cy={size / 2} r={size * 0.44} fill={`url(#sphere-${id})`} />
        {/* top gloss highlight */}
        <Circle cx={size / 2} cy={size / 2} r={size * 0.44} fill={`url(#gloss-${id})`} />
      </Svg>
      {glyph != null && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: size, alignItems: 'center', justifyContent: 'center' }}>
          {glyph}
        </View>
      )}
    </Animated.View>
  );
}
