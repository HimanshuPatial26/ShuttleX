import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { OnboardingHeader } from '../../components/OnboardingChrome';
import { PrimaryButton } from '../../components/UI';
import { colors, fontSizes, radius, spacing } from '../../theme';
import { useApp } from '../../lib/store';
import type { UserProfile } from '../../lib/types';

const currencies: { code: UserProfile['currency']; label: string }[] = [
  { code: 'AED', label: 'AED — UAE Dirham' },
  { code: 'USD', label: 'USD — US Dollar' },
  { code: 'EUR', label: 'EUR — Euro' },
  { code: 'GBP', label: 'GBP — Pound' },
];

const incomeRanges = [
  { label: 'AED 5,000 – 10,000', value: 7500 },
  { label: 'AED 10,000 – 15,000', value: 12500 },
  { label: 'AED 15,000 – 20,000', value: 18000 },
  { label: 'AED 20,000 – 30,000', value: 25000 },
  { label: 'AED 30,000+', value: 35000 },
];

const goalOptions = ['Travel', 'Emergency Fund', 'Vehicle', 'Education', 'Home'];

export default function ProfileSetup() {
  const router = useRouter();
  const { updateProfile } = useApp();
  const [currency, setCurrency] = useState<UserProfile['currency']>('USD');
  const [income, setIncome] = useState(incomeRanges[2]);
  const [goals, setGoals] = useState<string[]>(['Travel']);

  const toggleGoal = (g: string) => {
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <OnboardingHeader step={2} total={5} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Tell us about your finances</Text>
        <Text style={styles.subtitle}>This helps FinPilot personalize every recommendation.</Text>

        <Text style={styles.sectionLabel}>Primary currency</Text>
        <View style={styles.chipWrap}>
          {currencies.map((c) => (
            <Pressable
              key={c.code}
              onPress={() => setCurrency(c.code)}
              style={[styles.chip, currency === c.code && styles.chipActive]}
            >
              <Text style={[styles.chipText, currency === c.code && styles.chipTextActive]}>{c.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Monthly income</Text>
        <View style={styles.chipWrap}>
          {incomeRanges.map((r) => (
            <Pressable
              key={r.label}
              onPress={() => setIncome(r)}
              style={[styles.chip, income.label === r.label && styles.chipActive]}
            >
              <Text style={[styles.chipText, income.label === r.label && styles.chipTextActive]}>{r.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>What are you saving for? (pick any)</Text>
        <View style={styles.chipWrap}>
          {goalOptions.map((g) => (
            <Pressable key={g} onPress={() => toggleGoal(g)} style={[styles.chip, goals.includes(g) && styles.chipActive]}>
              <Text style={[styles.chipText, goals.includes(g) && styles.chipTextActive]}>{g}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Continue"
          variant="accent"
          onPress={() => {
            updateProfile({ currency, monthlyIncome: income.value, incomeRange: income.label });
            router.push('/onboarding/biometric');
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  title: { color: colors.textPrimary, fontSize: fontSizes.xl, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.textSecondary, fontSize: fontSizes.base, lineHeight: 21, marginBottom: spacing.xxl },
  sectionLabel: { color: colors.textSecondary, fontSize: fontSizes.sm, fontWeight: '700', marginBottom: spacing.md, marginTop: spacing.lg },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textSecondary, fontSize: fontSizes.sm, fontWeight: '600' },
  chipTextActive: { color: colors.white },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, paddingTop: spacing.sm },
});
