import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { Badge, PrimaryButton } from './UI';
import { GlassCard } from './anim';
import type { Recommendation } from '../lib/types';

const typeMeta: Record<Recommendation['type'], { icon: string; label: string; tone: 'neutral' | 'warning' | 'danger' }> = {
  spending: { icon: '📊', label: 'Spending insight', tone: 'neutral' },
  savings: { icon: '💰', label: 'Savings opportunity', tone: 'neutral' },
  goal: { icon: '🎯', label: 'Goal boost', tone: 'neutral' },
  subscription: { icon: '🔁', label: 'Subscription', tone: 'warning' },
  anomaly: { icon: '⚠️', label: 'Anomaly detected', tone: 'danger' },
};

export function RecommendationCard({
  rec,
  onApprove,
  onReject,
}: {
  rec: Recommendation;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const meta = typeMeta[rec.type];
  const resolved = rec.status !== 'pending';

  return (
    <GlassCard style={styles.card} intensity={18}>
      <View style={styles.headerRow}>
        <Text style={styles.icon}>{meta.icon}</Text>
        <Badge text={meta.label} tone={meta.tone} />
        {resolved && (
          <Badge
            text={rec.status === 'approved' ? 'Approved' : 'Dismissed'}
            tone={rec.status === 'approved' ? 'success' : 'neutral'}
          />
        )}
      </View>
      <Text style={styles.title}>{rec.title}</Text>
      <Text style={styles.body}>{rec.explanation}</Text>

      <View style={styles.divider} />

      <Text style={styles.label}>Why</Text>
      <Text style={styles.reasoning}>{rec.reasoning}</Text>

      <Text style={styles.label}>Expected impact</Text>
      <Text style={styles.impact}>{rec.expectedImpact}</Text>

      {!resolved && rec.actionLabel && (
        <View style={styles.actions}>
          <PrimaryButton label="Dismiss" variant="outline" onPress={onReject} style={styles.actionBtn} />
          <PrimaryButton label={`Approve`} variant="accent" onPress={onApprove} style={styles.actionBtn} />
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  icon: { fontSize: 18 },
  title: { fontSize: 16, fontWeight: '700', color: colors.inkPrimary, marginBottom: 6 },
  body: { fontSize: 13.5, color: colors.inkSecondary, lineHeight: 19 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.10)', marginVertical: 12 },
  label: { fontSize: 11, fontWeight: '700', color: colors.inkMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  reasoning: { fontSize: 13.5, color: colors.inkSecondary, lineHeight: 19, marginBottom: 10 },
  impact: { fontSize: 13.5, color: colors.success, lineHeight: 19, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  actionBtn: { flex: 1, paddingVertical: 12 },
});
