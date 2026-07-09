import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/Screen';
import { TransactionRow } from '../components/TransactionRow';
import { colors, fontSizes, radius, spacing } from '../theme';
import { useApp } from '../lib/store';
import { relativeDay } from '../lib/financeEngine';
import type { Category } from '../lib/types';

const categories: (Category | 'All')[] = [
  'All',
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Housing',
  'Healthcare',
  'Travel',
  'Investments',
  'Subscriptions',
  'Income',
];

export default function Transactions() {
  const router = useRouter();
  const { transactions, profile } = useApp();
  const [filter, setFilter] = useState<(typeof categories)[number]>('All');

  const filtered = useMemo(
    () => (filter === 'All' ? transactions : transactions.filter((t) => t.category === filter)),
    [transactions, filter]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof transactions>();
    filtered.forEach((t) => {
      const key = relativeDay(t.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return [...map.entries()];
  }, [filtered]);

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ gap: 8, paddingHorizontal: spacing.xl }}>
        {categories.map((c) => (
          <Pressable key={c} onPress={() => setFilter(c)} style={[styles.chip, filter === c && styles.chipActive]}>
            <Text style={[styles.chipText, filter === c && styles.chipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}>
        {grouped.map(([day, txs]) => (
          <View key={day}>
            <Text style={styles.dayLabel}>{day}</Text>
            {txs.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} currency={profile.currency} />
            ))}
          </View>
        ))}
        {grouped.length === 0 && <Text style={styles.empty}>No transactions in this category.</Text>}
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
  filterRow: { flexGrow: 0 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textSecondary, fontSize: 12.5, fontWeight: '600' },
  chipTextActive: { color: colors.white },
  dayLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
    marginBottom: 4,
  },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxl },
});
