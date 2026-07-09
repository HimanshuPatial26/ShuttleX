import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { Sheet } from '../../components/Sheet';
import { HealthGauge } from '../../components/HealthGauge';
import { CurrencyPill, QuickAction, SectionHeader } from '../../components/UI';
import { RecommendationCard } from '../../components/RecommendationCard';
import { TransactionRow } from '../../components/TransactionRow';
import { colors, fontSizes, spacing } from '../../theme';
import { useApp } from '../../lib/store';
import { formatMoney, monthlySpend, relativeDay, spendByCategory } from '../../lib/financeEngine';
import { walletBalances } from '../../lib/mockData';

export default function Home() {
  const router = useRouter();
  const { profile, transactions, recommendations, goals, respondToRecommendation, healthScore } = useApp();

  const firstName = profile.name.split(' ')[0] || 'there';
  const primaryBalance = walletBalances.find((w) => w.code === profile.currency) ?? walletBalances[0];
  const recent = transactions.slice(0, 6);
  const pendingRecs = recommendations.filter((r) => r.status === 'pending').slice(0, 2);
  const spend30 = monthlySpend(transactions, 30);
  const yesterdaySpend = transactions
    .filter((t) => t.amount < 0 && relativeDay(t.date) === 'Yesterday')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const onTrack = healthScore.expenseControl >= 50;
  const topCategory = spendByCategory(transactions, 30)[0];
  const topGoal = goals[0];

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <Screen edges={['top', 'left', 'right']}>
      <View style={styles.hero}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
          <Pressable style={styles.bellBtn} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow} contentContainerStyle={{ gap: 10 }}>
          {walletBalances.map((w) => (
            <CurrencyPill key={w.code} flag={w.flag} code={w.code} amount={w.amount.toLocaleString()} />
          ))}
        </ScrollView>

        <View style={styles.balanceRow}>
          <View>
            <Text style={styles.balanceLabel}>Total balance</Text>
            <Text style={styles.balance}>{formatMoney(primaryBalance.amount, profile.currency)}</Text>
          </View>
          <Pressable onPress={() => router.push('/health-score')}>
            <HealthGauge score={healthScore.total} size={78} />
          </Pressable>
        </View>

        <View style={styles.actionsRow}>
          <QuickAction icon="＋" label="Add" onPress={() => {}} />
          <QuickAction icon="↗" label="Send" onPress={() => {}} />
          <QuickAction icon="⇄" label="Convert" onPress={() => {}} />
          <QuickAction icon="⋯" label="More" onPress={() => router.push('/(tabs)/more')} />
        </View>
      </View>

      <Sheet>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <View style={styles.briefingCard}>
            <View style={styles.briefingHeader}>
              <Text style={styles.briefingIcon}>☀️</Text>
              <Text style={styles.briefingTitle}>Daily briefing</Text>
            </View>
            <Text style={styles.briefingText}>
              You spent {formatMoney(yesterdaySpend, profile.currency)} yesterday
              {topCategory ? `, mostly on ${topCategory.category}` : ''}. Your{' '}
              {topGoal ? `"${topGoal.name}"` : 'travel'} goal is{' '}
              {topGoal ? Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100) : 0}% funded. Overall you're{' '}
              {onTrack ? 'tracking within budget this month.' : 'spending faster than usual this month — worth a look.'}
            </Text>
          </View>

          {pendingRecs.length > 0 && (
            <>
              <SectionHeader title="Recommended for you" action="See all" onPressAction={() => router.push('/recommendations')} />
              {pendingRecs.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  rec={rec}
                  onApprove={() => respondToRecommendation(rec.id, 'approved')}
                  onReject={() => respondToRecommendation(rec.id, 'rejected')}
                />
              ))}
            </>
          )}

          <SectionHeader title="Transactions" action="View all" onPressAction={() => router.push('/transactions')} />
          <View>
            {recent.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} currency={profile.currency} />
            ))}
          </View>
        </ScrollView>
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { color: colors.textSecondary, fontSize: fontSizes.sm },
  name: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '800' },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  pillRow: { marginTop: spacing.lg, flexGrow: 0 },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  balanceLabel: { color: colors.textSecondary, fontSize: fontSizes.sm, marginBottom: 4 },
  balance: { color: colors.textPrimary, fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  actionsRow: { flexDirection: 'row', marginTop: spacing.xl, marginBottom: spacing.lg, gap: 8 },
  briefingCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    backgroundColor: colors.inkPrimary,
    borderRadius: 20,
    padding: spacing.lg,
  },
  briefingHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  briefingIcon: { fontSize: 16 },
  briefingTitle: { color: colors.white, fontSize: fontSizes.sm, fontWeight: '700' },
  briefingText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 19 },
});
