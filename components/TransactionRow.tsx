import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { formatMoney } from '../lib/financeEngine';
import type { Transaction, UserProfile } from '../lib/types';

export function TransactionRow({
  tx,
  currency,
  onPress,
}: {
  tx: Transaction;
  currency: UserProfile['currency'];
  onPress?: () => void;
}) {
  const isIncome = tx.amount > 0;
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{tx.icon}</Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.merchant} numberOfLines={1}>
          {tx.merchant}
        </Text>
        <Text style={styles.category}>{tx.category}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, isIncome && styles.amountPositive]}>
          {isIncome ? '+' : ''}
          {formatMoney(tx.amount, currency)}
        </Text>
        <Text style={styles.method}>{tx.paymentMethod}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: 'rgba(14,18,32,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 20 },
  middle: { flex: 1 },
  merchant: { fontSize: 15, fontWeight: '600', color: colors.inkPrimary },
  category: { fontSize: 12.5, color: colors.inkMuted, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  amount: { fontSize: 15, fontWeight: '700', color: colors.inkPrimary },
  amountPositive: { color: '#12946B' },
  method: { fontSize: 11.5, color: colors.inkMuted, marginTop: 2 },
});
