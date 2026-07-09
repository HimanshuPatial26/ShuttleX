import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { Sheet } from '../../components/Sheet';
import { GradientCard } from '../../components/GradientCard';
import { colors, fontSizes, radius, spacing } from '../../theme';
import { useApp } from '../../lib/store';
import { formatMoney } from '../../lib/financeEngine';
import { walletBalances } from '../../lib/mockData';

export default function Card() {
  const { profile } = useApp();
  const [revealed, setRevealed] = useState(false);
  const primaryBalance = walletBalances.find((w) => w.code === profile.currency) ?? walletBalances[0];

  return (
    <Screen edges={['top', 'left', 'right']}>
      <View style={styles.hero}>
        <Text style={styles.title}>Your card</Text>
        <View style={styles.cardWrap}>
          <GradientCard cardholder={profile.name || 'Debit'} />
        </View>
      </View>

      <Sheet>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <View style={styles.balanceBlock}>
            <Text style={styles.balanceLabel}>Available balance</Text>
            <Text style={styles.balance}>{formatMoney(primaryBalance.amount, profile.currency)}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeaderRow}>
              <Text style={styles.infoTitle}>Card info</Text>
              <Pressable onPress={() => setRevealed((r) => !r)} style={styles.revealBtn}>
                <Ionicons name={revealed ? 'eye-off-outline' : 'eye-outline'} size={16} color={colors.inkSecondary} />
                <Text style={styles.revealText}>{revealed ? 'Hide' : 'Reveal'}</Text>
              </Pressable>
            </View>

            <InfoRow label="Card number" value={revealed ? '5231 7252 1769 8152' : '•••• •••• •••• 8152'} />
            <InfoRow label="CVC" value={revealed ? '678' : '•••'} />
            <InfoRow label="Expiry date" value="08/29" />
          </View>

          <View style={styles.actionsGrid}>
            <ActionTile icon="lock-closed-outline" label="Freeze card" />
            <ActionTile icon="key-outline" label="Change PIN" />
            <ActionTile icon="options-outline" label="Spend limits" />
            <ActionTile icon="reload-outline" label="Replace card" />
          </View>
        </ScrollView>
      </Sheet>
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function ActionTile({ icon, label }: { icon: any; label: string }) {
  return (
    <Pressable style={styles.actionTile}>
      <View style={styles.actionTileIcon}>
        <Ionicons name={icon} size={20} color={colors.inkPrimary} />
      </View>
      <Text style={styles.actionTileLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  title: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '800', marginBottom: spacing.lg },
  cardWrap: { shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 12 } },
  balanceBlock: { alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  balanceLabel: { color: colors.inkMuted, fontSize: fontSizes.sm, marginBottom: 4 },
  balance: { color: colors.inkPrimary, fontSize: 32, fontWeight: '800' },
  infoCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.sheetElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  infoHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  infoTitle: { fontSize: fontSizes.base, fontWeight: '700', color: colors.inkPrimary },
  revealBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  revealText: { fontSize: 12.5, color: colors.inkSecondary, fontWeight: '600' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(14,18,32,0.06)',
  },
  infoLabel: { color: colors.inkMuted, fontSize: 13.5 },
  infoValue: { color: colors.inkPrimary, fontSize: 13.5, fontWeight: '600', letterSpacing: 0.5 },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  actionTile: {
    width: '47%',
    backgroundColor: colors.sheetElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: 10,
  },
  actionTileIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(14,18,32,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTileLabel: { fontSize: 13, fontWeight: '600', color: colors.inkPrimary },
});
