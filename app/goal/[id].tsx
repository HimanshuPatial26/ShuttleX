import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { ProgressRing } from '../../components/ProgressRing';
import { PrimaryButton } from '../../components/UI';
import { colors, fontSizes, radius, spacing } from '../../theme';
import { useApp } from '../../lib/store';
import { formatMoney, goalMonthsRemaining, goalProgressPct } from '../../lib/financeEngine';

export default function GoalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { goals, profile, updateGoalContribution } = useApp();
  const goal = goals.find((g) => g.id === id);
  const [editing, setEditing] = useState(false);
  const [contribution, setContribution] = useState(goal?.monthlyContribution ?? 0);

  if (!goal) {
    return (
      <Screen edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.center}>
          <Text style={styles.notFound}>Goal not found</Text>
        </View>
      </Screen>
    );
  }

  const pct = goalProgressPct(goal);
  const months = goalMonthsRemaining(goal);
  const milestones = [25, 50, 75, 100];

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>{goal.name}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.ringWrap}>
          <ProgressRing progress={pct} size={168} stroke={14} color={goal.color}>
            <Text style={styles.ringPct}>{Math.round(pct * 100)}%</Text>
            <Text style={styles.ringLabel}>funded</Text>
          </ProgressRing>
        </View>

        <View style={styles.amountsRow}>
          <View>
            <Text style={styles.amountLabel}>Saved</Text>
            <Text style={styles.amountValue}>{formatMoney(goal.currentAmount, profile.currency)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.amountLabel}>Target</Text>
            <Text style={styles.amountValue}>{formatMoney(goal.targetAmount, profile.currency)}</Text>
          </View>
        </View>

        <View style={styles.milestoneRow}>
          {milestones.map((m) => (
            <View key={m} style={styles.milestoneItem}>
              <View style={[styles.milestoneDot, pct * 100 >= m && { backgroundColor: goal.color }]} />
              <Text style={styles.milestoneText}>{m}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Row label="Goal type" value={goal.type} />
          <Row label="Deadline" value={new Date(goal.deadline).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} />
          <Row
            label="Est. time remaining"
            value={Number.isFinite(months) ? `${months} months` : '—'}
          />
        </View>

        <View style={styles.contributionCard}>
          <Text style={styles.contributionLabel}>Monthly contribution</Text>
          {editing ? (
            <View style={styles.stepperRow}>
              <Pressable
                style={styles.stepperBtn}
                onPress={() => setContribution((c) => Math.max(0, c - 50))}
              >
                <Ionicons name="remove" size={18} color={colors.inkPrimary} />
              </Pressable>
              <Text style={styles.stepperValue}>{formatMoney(contribution, profile.currency)}</Text>
              <Pressable style={styles.stepperBtn} onPress={() => setContribution((c) => c + 50)}>
                <Ionicons name="add" size={18} color={colors.inkPrimary} />
              </Pressable>
            </View>
          ) : (
            <Text style={styles.contributionValue}>{formatMoney(goal.monthlyContribution, profile.currency)}/mo</Text>
          )}

          <PrimaryButton
            label={editing ? 'Save contribution' : 'Adjust contribution'}
            variant={editing ? 'accent' : 'outline'}
            style={{ marginTop: spacing.lg }}
            onPress={() => {
              if (editing) updateGoalContribution(goal.id, contribution);
              setEditing((e) => !e);
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { color: colors.textSecondary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: colors.textPrimary, fontSize: fontSizes.base, fontWeight: '700' },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, alignItems: 'center' },
  ringWrap: { marginTop: spacing.lg, marginBottom: spacing.xl },
  ringPct: { fontSize: 32, fontWeight: '800', color: colors.textPrimary },
  ringLabel: { fontSize: 12, color: colors.textSecondary },
  amountsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: spacing.xl },
  amountLabel: { color: colors.textMuted, fontSize: 12 },
  amountValue: { color: colors.textPrimary, fontSize: 20, fontWeight: '700', marginTop: 3 },
  milestoneRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: spacing.xl },
  milestoneItem: { alignItems: 'center', gap: 6 },
  milestoneDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.bgCard },
  milestoneText: { fontSize: 11, color: colors.textMuted },
  infoCard: {
    width: '100%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  rowLabel: { color: colors.textMuted, fontSize: 13 },
  rowValue: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  contributionCard: {
    width: '100%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contributionLabel: { color: colors.textMuted, fontSize: 13, marginBottom: 8 },
  contributionValue: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.sheetElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center' },
});
