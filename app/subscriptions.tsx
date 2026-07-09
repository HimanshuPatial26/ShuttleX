import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/Screen';
import { Badge, PrimaryButton } from '../components/UI';
import { colors, fontSizes, radius, spacing } from '../theme';
import { useApp } from '../lib/store';
import { formatMoney } from '../lib/financeEngine';

export default function Subscriptions() {
  const router = useRouter();
  const { subscriptions, profile, flagSubscription, cancelSubscription } = useApp();

  const active = subscriptions.filter((s) => s.status !== 'cancelled');
  const monthlyTotal = active.reduce((s, x) => s + x.amount, 0);
  const flaggedTotal = subscriptions.filter((s) => s.status === 'flagged').reduce((s, x) => s + x.amount, 0);

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscriptions</Text>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Active monthly total</Text>
          <Text style={styles.summaryValue}>{formatMoney(monthlyTotal, profile.currency)}</Text>
        </View>
        {flaggedTotal > 0 && (
          <View style={styles.flagPill}>
            <Text style={styles.flagPillText}>{formatMoney(flaggedTotal, profile.currency)} flagged for review</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {subscriptions.map((sub) => (
          <View key={sub.id} style={[styles.card, sub.status === 'cancelled' && styles.cardCancelled]}>
            <View style={styles.cardTop}>
              <View style={styles.iconWrap}>
                <Text style={styles.icon}>{sub.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.merchant}>{sub.merchant}</Text>
                <Text style={styles.meta}>
                  {formatMoney(sub.amount, profile.currency)} · {sub.frequency}
                </Text>
              </View>
              {sub.status === 'flagged' && <Badge text="Flagged" tone="warning" />}
              {sub.status === 'cancelled' && <Badge text="Cancelled" tone="neutral" />}
              {sub.status === 'active' && sub.lastUsedDaysAgo > 45 && <Badge text="Unused" tone="danger" />}
            </View>

            <Text style={styles.usage}>
              {sub.lastUsedDaysAgo === 0
                ? 'Used today'
                : `Last used ${sub.lastUsedDaysAgo} day${sub.lastUsedDaysAgo === 1 ? '' : 's'} ago`}
            </Text>

            {sub.status === 'active' && (
              <PrimaryButton
                label="Flag for cancellation"
                variant="outline"
                style={styles.actionBtn}
                onPress={() => flagSubscription(sub.id)}
              />
            )}
            {sub.status === 'flagged' && (
              <PrimaryButton
                label="Confirm cancellation"
                variant="danger"
                style={styles.actionBtn}
                onPress={() => cancelSubscription(sub.id)}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
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
  summaryCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  summaryLabel: { color: colors.textMuted, fontSize: 12 },
  summaryValue: { color: colors.textPrimary, fontSize: 26, fontWeight: '800', marginTop: 3 },
  flagPill: { backgroundColor: colors.warningSoft, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7, alignSelf: 'flex-start' },
  flagPillText: { color: colors.warning, fontSize: 12, fontWeight: '700' },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, gap: 12 },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCancelled: { opacity: 0.5 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 18 },
  merchant: { color: colors.textPrimary, fontSize: fontSizes.base, fontWeight: '700' },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  usage: { color: colors.textSecondary, fontSize: 12.5, marginBottom: 10 },
  actionBtn: { paddingVertical: 11 },
});
