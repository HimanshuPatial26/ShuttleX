import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../components/Screen';
import { Sheet } from '../../components/Sheet';
import { ProgressRing } from '../../components/ProgressRing';
import { SectionHeader } from '../../components/UI';
import { LiquidBackground, Entrance, AnimatedPressable, GlassCard } from '../../components/anim';
import { colors, fontSizes, radius, spacing } from '../../theme';
import { useApp } from '../../lib/store';
import { formatMoney, goalMonthsRemaining, goalProgressPct } from '../../lib/financeEngine';

export default function Goals() {
  const router = useRouter();
  const { goals, profile } = useApp();

  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);

  return (
    <Screen edges={['top', 'left', 'right']}>
      <LiquidBackground variant="sunset" />
      <View style={styles.hero}>
        <Entrance from="top">
          <View style={styles.headerRow}>
            <Text style={styles.title}>Goals</Text>
            <AnimatedPressable style={styles.addBtnWrap} onPress={() => router.push('/goal/new')}>
              <LinearGradient
                colors={colors.gradientAccent}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.addBtn}
              >
                <Ionicons name="add" size={22} color={colors.white} />
              </LinearGradient>
            </AnimatedPressable>
          </View>
          <Text style={styles.summary}>
            {formatMoney(totalSaved, profile.currency)} saved of {formatMoney(totalTarget, profile.currency)} across{' '}
            {goals.length} goals
          </Text>
        </Entrance>
      </View>

      <Sheet>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32, paddingTop: 4 }}>
          <SectionHeader title="Active goals" />
          <View style={styles.list}>
            {goals.map((goal, i) => {
              const pct = goalProgressPct(goal);
              const months = goalMonthsRemaining(goal);
              return (
                <Entrance key={goal.id} index={i} delay={80}>
                  <AnimatedPressable onPress={() => router.push(`/goal/${goal.id}`)}>
                    <GlassCard style={styles.goalCard} intensity={18}>
                      <View style={styles.goalRow}>
                        <ProgressRing progress={pct} color={goal.color} size={58} delay={i * 120}>
                          <Text style={styles.ringText}>{Math.round(pct * 100)}%</Text>
                        </ProgressRing>
                        <View style={styles.goalInfo}>
                          <Text style={styles.goalName}>{goal.name}</Text>
                          <Text style={styles.goalAmounts}>
                            {formatMoney(goal.currentAmount, profile.currency)} of{' '}
                            {formatMoney(goal.targetAmount, profile.currency)}
                          </Text>
                          <Text style={styles.goalMeta}>
                            {Number.isFinite(months) ? `~${months} months left` : 'Set a monthly contribution'} ·{' '}
                            {formatMoney(goal.monthlyContribution, profile.currency)}/mo
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.inkMuted} />
                      </View>
                    </GlassCard>
                  </AnimatedPressable>
                </Entrance>
              );
            })}
          </View>
        </ScrollView>
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '800' },
  addBtnWrap: { borderRadius: 19, overflow: 'hidden' },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: { color: colors.textSecondary, fontSize: fontSizes.sm, marginTop: 8 },
  list: { paddingHorizontal: spacing.xl, gap: 12 },
  goalCard: { marginBottom: 0 },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  ringText: { fontSize: 11, fontWeight: '700', color: colors.inkPrimary },
  goalInfo: { flex: 1 },
  goalName: { fontSize: fontSizes.base, fontWeight: '700', color: colors.inkPrimary, marginBottom: 3 },
  goalAmounts: { fontSize: 12.5, color: colors.inkSecondary, marginBottom: 2 },
  goalMeta: { fontSize: 11.5, color: colors.inkMuted },
});
