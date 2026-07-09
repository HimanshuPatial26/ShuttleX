import { Stack } from 'expo-router';
import { colors } from '../../theme';

export default function GoalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="new" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
