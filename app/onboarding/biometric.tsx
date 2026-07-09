import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { Screen } from '../../components/Screen';
import { OnboardingHeader } from '../../components/OnboardingChrome';
import { PrimaryButton } from '../../components/UI';
import { colors, fontSizes, spacing } from '../../theme';
import { useApp } from '../../lib/store';

export default function BiometricSetup() {
  const router = useRouter();
  const { updateProfile } = useApp();
  const [status, setStatus] = useState<'idle' | 'checking' | 'enabled' | 'unavailable'>('idle');

  const enableBiometric = async () => {
    setStatus('checking');
    try {
      if (Platform.OS === 'web') {
        await new Promise((r) => setTimeout(r, 700));
        setStatus('enabled');
        updateProfile({ biometricEnabled: true });
        return;
      }
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        setStatus('unavailable');
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric unlock for FinPilot',
      });
      if (result.success) {
        setStatus('enabled');
        updateProfile({ biometricEnabled: true });
      } else {
        setStatus('idle');
      }
    } catch {
      setStatus('unavailable');
    }
  };

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <OnboardingHeader step={3} total={5} />
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>🔒</Text>
        </View>
        <Text style={styles.title}>Secure your account</Text>
        <Text style={styles.subtitle}>
          Face ID / fingerprint unlock protects your dashboard and is required before approving any financial action.
          No raw credentials are ever stored on this device.
        </Text>

        {status === 'enabled' && (
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>✓ Biometric unlock enabled</Text>
          </View>
        )}
        {status === 'unavailable' && (
          <View style={[styles.statusPill, styles.statusPillWarn]}>
            <Text style={[styles.statusText, styles.statusTextWarn]}>
              No biometric hardware found — you can use a PIN instead.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {status === 'enabled' ? (
          <PrimaryButton label="Continue" variant="accent" onPress={() => router.push('/onboarding/connect')} />
        ) : (
          <>
            <PrimaryButton
              label={status === 'checking' ? 'Checking…' : 'Enable Face ID / Fingerprint'}
              variant="accent"
              disabled={status === 'checking'}
              onPress={enableBiometric}
            />
            <PrimaryButton
              label="Set up a PIN instead"
              variant="outline"
              onPress={() => router.push('/onboarding/connect')}
            />
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.xl, alignItems: 'center', paddingTop: spacing.xxxl },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  icon: { fontSize: 38 },
  title: { color: colors.textPrimary, fontSize: fontSizes.xl, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  subtitle: { color: colors.textSecondary, fontSize: fontSizes.base, lineHeight: 21, textAlign: 'center' },
  statusPill: {
    marginTop: spacing.xxl,
    backgroundColor: colors.successSoft,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  statusPillWarn: { backgroundColor: colors.warningSoft },
  statusText: { color: colors.success, fontWeight: '700', fontSize: fontSizes.sm },
  statusTextWarn: { color: colors.warning },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: spacing.md },
});
