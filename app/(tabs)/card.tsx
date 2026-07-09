import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { Sheet } from '../../components/Sheet';
import { GradientCard } from '../../components/GradientCard';
import { LiquidBackground, Entrance, AnimatedPressable } from '../../components/anim';
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
      <LiquidBackground variant="teal" />
      <View style={styles.hero}>
        <Entrance from="top">
          <Text style={styles.title}>Your card</Text>
        </Entrance>
        <Entrance from="scale" delay={80}>
          <View style={styles.cardWrap}>
            <GradientCard cardholder={profile.name || 'Debit'} />
          </View>
        </Entrance>
      </View>

      <Sheet>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <View style={styles.balanceBlock}>
            <Text style={styles.balanceLabel}>Available balance</Text>
            <Text style={styles.balance}>{formatMoney(primaryBalance.amount, profile.currency)}</Text>
          </View>

          <Entrance from="bottom" delay={160}>
            <View style={styles.infoCard}>
              <View style={styles.infoHeaderRow}>
                <Text style={styles.infoTitle}>Card info</Text>
                <AnimatedPressable onPress={() => setRevealed((r) => !r)} style={styles.revealBtn}>
                  <Ionicons name={revealed ? 'eye-off-outline' : 'eye-outline'} size={16} color={colors.inkSecondary} />
                  <Text style={styles.revealText}>{revealed ? 'Hide' : 'Reveal'}</Text>
                </AnimatedPressable>
              </View>

              <InfoRow label="Card number" value={revealed ? '5231 7252 1769 8152' : '•••• •••• •••• 8152'} />
              <InfoRow label="CVC" value={revealed ? '678' : '•••'} />
              <InfoRow label="Expiry date" value="08/29" />
            </View>
          </Entrance>

          <View style={styles.actionsGrid}>
            {[
              { icon: 'lock-closed-outline', label: 'Freeze card' },
              { icon: 'key-outline', label: 'Change PIN' },
              { icon: 'options-outline', label: 'Spend limits' },
              { icon: 'reload-outline', label: 'Replace card' },
            ].map((a, i) => (
              <Entrance key={a.label} index={i} delay={220} style={styles.actionTileWrap}>
                <ActionTile icon={a.icon} label={a.label} />
              </Entrance>
            ))}
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
    <AnimatedPressable style={styles.actionTile}>
      <View style={styles.actionTileIcon}>
        <Ionicons name={icon} size={20} color={colors.inkPrimary} />
      </View>
      <Text style={styles.actionTileLabel}>{label}</Text>
    </AnimatedPressable>
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
    borderWidth: 1,
    borderColor: colors.border,
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
    borderTopColor: 'rgba(255,255,255,0.09)',
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
  actionTileWrap: {
    width: '47%',
  },
  actionTile: {
    width: '100%',
    backgroundColor: colors.sheetElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionTileIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTileLabel: { fontSize: 13, fontWeight: '600', color: colors.inkPrimary },
});
