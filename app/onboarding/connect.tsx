import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { OnboardingHeader } from '../../components/OnboardingChrome';
import { PrimaryButton } from '../../components/UI';
import { colors, fontSizes, radius, spacing } from '../../theme';

export default function Connect() {
  const router = useRouter();
  const [method, setMethod] = useState<'bank' | 'upload' | null>(null);

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <OnboardingHeader step={4} total={5} />
      <View style={styles.content}>
        <Text style={styles.title}>Connect your finances</Text>
        <Text style={styles.subtitle}>
          FinPilot only ever talks to our secure backend — your bank credentials are never stored on this device.
        </Text>

        <Pressable
          style={[styles.option, method === 'bank' && styles.optionActive]}
          onPress={() => setMethod('bank')}
        >
          <Text style={styles.optionIcon}>🏦</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Connect a bank account</Text>
            <Text style={styles.optionBody}>Secure Open Banking consent flow. Read-only access, revoke anytime.</Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.option, method === 'upload' && styles.optionActive]}
          onPress={() => setMethod('upload')}
        >
          <Text style={styles.optionIcon}>📄</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Upload a statement</Text>
            <Text style={styles.optionBody}>Import a CSV or PDF bank statement to get started instantly.</Text>
          </View>
        </Pressable>

        <View style={styles.demoNote}>
          <Text style={styles.demoNoteText}>
            This is a demo build — either option loads sample transaction data so you can explore FinPilot end to end.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Continue"
          variant="accent"
          disabled={!method}
          onPress={() => router.push('/onboarding/analyzing')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.xl },
  title: { color: colors.textPrimary, fontSize: fontSizes.xl, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.textSecondary, fontSize: fontSizes.base, lineHeight: 21, marginBottom: spacing.xxl },
  option: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  optionActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  optionIcon: { fontSize: 26 },
  optionTitle: { color: colors.textPrimary, fontSize: fontSizes.base, fontWeight: '700', marginBottom: 4 },
  optionBody: { color: colors.textSecondary, fontSize: 12.5, lineHeight: 17 },
  demoNote: { marginTop: spacing.lg, padding: spacing.md, borderRadius: radius.md, backgroundColor: 'rgba(91,141,255,0.08)' },
  demoNoteText: { color: colors.textSecondary, fontSize: 12, lineHeight: 17 },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
});
