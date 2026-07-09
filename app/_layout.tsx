import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { AppProvider } from '../lib/store';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="lock" options={{ animation: 'fade' }} />
            <Stack.Screen name="health-score" options={{ presentation: 'modal' }} />
            <Stack.Screen name="subscriptions" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="recommendations" />
            <Stack.Screen name="privacy" />
            <Stack.Screen name="transactions" />
            <Stack.Screen name="goal" />
          </Stack>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
