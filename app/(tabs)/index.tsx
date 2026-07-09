import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../components/Screen';
import { Sheet } from '../../components/Sheet';
import { HealthGauge } from '../../components/HealthGauge';
import { CurrencyPill, QuickAction, SectionHeader } from '../../components/UI';
import { RecommendationCard } from '../../components/RecommendationCard';
import { TransactionRow } from '../../components/TransactionRow';
import { LiquidBackground, Entrance, AnimatedPressable, AnimatedNumber } from '../../components/anim';
import { colors, fontSizes, spacing } from '../../theme';
import { useApp } from '../../lib/store';
import { formatMoney, monthlySpend, relativeDay, spendByCategory } from '../../lib/financeEngine';
import { walletBalances, currencySymbols } from '../../lib/mockData';

export default function Home() {
  const router = useRouter();
  const { profile, transactions, recommendations, goals, respondToRecommendation, healthScore } = useApp();

  const firstName = profile.name.split(' ')[0] || 'there';
  const primaryBalance = walletBalances.find((w) => w.code === profile.currency) ?? walletBalances[0];
  const recent = transactions.slice(0, 6);
  const pendingRecs = recommendations.filter((r) => r.status === 'pending').slice(0, 2);
  const yesterdaySpend = transactions
    .filter((t) => t.amount < 0 && relativeDay(t.date) === 'Yesterday')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const onTrack = healthScore.expenseControl >= 50;
  const topCategory = spendByCategory(transactions, 30)[0];
  const topGoal = goals[0];
  const symbol = currencySymbols[profile.currency];

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <Screen edges={['top', 'left', 'right']}>
      <LiquidBackground variant="aurora" />

      <View style={styles.hero}>
        <Entrance from="top">
          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.name}>{firstName}</Text>
            </View>
            <AnimatedPressable style={styles.bellBtn} onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
              <View style={styles.bellDot} />
            </AnimatedPressable>
          </View>
        </Entrance>

        <Entrance from="bottom" delay={80}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow} contentContainerStyle={{ gap: 10 }}>
            {walletBalances.map((w) => (
              <CurrencyPill key={w.code} flag={w.flag} code={w.code} amount={w.amount.toLocaleString()} />
            ))}
          </ScrollView>
        </Entrance>

        <Entrance from="bottom" delay={140}>
          <View style={styles.balanceRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.balanceLabel}>Total balance</Text>
              <AnimatedNumber
                value={primaryBalance.amount}
                style={styles.balance}
                format={(n) =>
                  `${symbol}${symbol === 'AED' ? ' ' : ''}${n.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                }
              />
            </View>
            <AnimatedPressable onPress={() => router.push('/health-score')}>
              <HealthGauge score={healthScore.total} size={84} />
            </AnimatedPressable>
          </View>
        </Entrance>

        <Entrance from="bottom" delay={200}>
          <View style={styles.actionsRow}>
            <QuickAction icon="＋" label="Add" onPress={() => {}} />
            <QuickAction icon="↗" label="Send" onPress={() => {}} />
            <QuickAction icon="⇄" label="Convert" onPress={() => {}} />
            <QuickAction icon="⋯" label="More" onPress={() => router.push('/(tabs)/more')} />
          </View>
        </Entrance>
      </View>

      <Sheet>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Entrance from="bottom" delay={260}>
            <LinearGradient
              colors={colors.gradientCardB}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.briefingCard}
            >
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
            </LinearGradient>
          </Entrance>

          {pendingRecs.length > 0 && (
            <>
              <SectionHeader title="Recommended for you" action="See all" onPressAction={() => router.push('/recommendations')} />
              {pendingRecs.map((rec, i) => (
                <Entrance key={rec.id} index={i} delay={320}>
                  <RecommendationCard
                    rec={rec}
                    onApprove={() => respondToRecommendation(rec.id, 'approved')}
                    onReject={() => respondToRecommendation(rec.id, 'rejected')}
                  />
                </Entrance>
              ))}
            </>
          )}

          <SectionHeader title="Transactions" action="View all" onPressAction={() => router.push('/transactions')} />
          <View>
            {recent.map((tx, i) => (
              <Entrance key={tx.id} index={i} delay={360}>
                <TransactionRow tx={tx} currency={profile.currency} />
              </Entrance>
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
    borderWidth: 1,
    borderColor: colors.glassBorder,
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
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  briefingHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  briefingIcon: { fontSize: 16 },
  briefingTitle: { color: colors.white, fontSize: fontSizes.sm, fontWeight: '700' },
  briefingText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 19 },
});
