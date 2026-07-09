import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/Screen';
import { HealthGauge } from '../components/HealthGauge';
import { colors, fontSizes, radius, spacing } from '../theme';
import { useApp } from '../lib/store';

const components: { key: keyof ReturnType<typeof useApp>['healthScore']; label: string; weight: string; tip: string }[] = [
  { key: 'savingsRatio', label: 'Savings ratio', weight: '30%', tip: 'How much of your income you keep each month.' },
  { key: 'expenseControl', label: 'Expense control', weight: '25%', tip: 'Whether spending is growing faster than usual.' },
  { key: 'emergencyFund', label: 'Emergency fund', weight: '20%', tip: 'Coverage against ~3 months of expenses.' },
  { key: 'debtManagement', label: 'Debt management', weight: '15%', tip: 'How manageable your current debt load is.' },
  { key: 'goalProgress', label: 'Goal progress', weight: '10%', tip: 'Average completion across your active goals.' },
];

export default function HealthScoreScreen() {
  const router = useRouter();
  const { healthScore } = useApp();

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Health Score</Text>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.gaugeWrap}>
          <HealthGauge score={healthScore.total} size={160} />
        </View>
        <Text style={styles.summary}>
          {healthScore.total >= 75
            ? "You're in great shape. Keep the momentum on savings and goals."
            : healthScore.total >= 50
            ? 'Solid foundation — a few tweaks could meaningfully improve your score.'
            : 'There are clear opportunities to strengthen your finances this month.'}
        </Text>

        <View style={styles.breakdown}>
          {components.map((c) => {
            const value = healthScore[c.key] as number;
            return (
              <View key={c.key} style={styles.row}>
                <View style={styles.rowHeader}>
                  <Text style={styles.rowLabel}>{c.label}</Text>
                  <Text style={styles.rowWeight}>weight {c.weight}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${value}%`, backgroundColor: barColor(value) }]} />
                </View>
                <View style={styles.rowFooter}>
                  <Text style={styles.rowTip}>{c.tip}</Text>
                  <Text style={styles.rowValue}>{value}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

function barColor(v: number) {
  if (v >= 75) return colors.success;
  if (v >= 50) return colors.warning;
  return colors.danger;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: { color: colors.textPrimary, fontSize: fontSizes.md, fontWeight: '800' },
  close: { color: colors.textSecondary, fontSize: 20 },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, alignItems: 'center' },
  gaugeWrap: { marginVertical: spacing.lg },
  summary: { color: colors.textSecondary, fontSize: fontSizes.base, textAlign: 'center', lineHeight: 21, marginBottom: spacing.xxl },
  breakdown: { width: '100%', gap: spacing.lg },
  row: { backgroundColor: colors.bgCard, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  rowLabel: { color: colors.textPrimary, fontSize: fontSizes.base, fontWeight: '700' },
  rowWeight: { color: colors.textMuted, fontSize: 11.5 },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  rowFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  rowTip: { color: colors.textMuted, fontSize: 12, flex: 1, marginRight: 8, lineHeight: 16 },
  rowValue: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
});
