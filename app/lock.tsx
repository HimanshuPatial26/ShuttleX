import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { Screen } from '../components/Screen';
import { PrimaryButton } from '../components/UI';
import { colors, fontSizes, spacing } from '../theme';
import { useApp } from '../lib/store';

export default function Lock() {
  const router = useRouter();
  const { unlock, profile } = useApp();
  const [checking, setChecking] = useState(false);

  const tryUnlock = async () => {
    setChecking(true);
    try {
      if (Platform.OS === 'web') {
        await new Promise((r) => setTimeout(r, 500));
        unlock();
        router.replace('/(tabs)');
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Unlock FinPilot' });
      if (result.success) {
        unlock();
        router.replace('/(tabs)');
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>✳︎</Text>
        </View>
        <Text style={styles.title}>Welcome back{profile.name ? `, ${profile.name.split(' ')[0]}` : ''}</Text>
        <Text style={styles.subtitle}>Unlock with Face ID to continue.</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label={checking ? 'Verifying…' : 'Unlock'} variant="accent" disabled={checking} onPress={tryUnlock} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  icon: { fontSize: 34, color: colors.accent },
  title: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: colors.textSecondary, fontSize: fontSizes.base, textAlign: 'center' },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
});
