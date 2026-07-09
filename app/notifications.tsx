import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/Screen';
import { colors, fontSizes, radius, spacing } from '../theme';
import { useApp } from '../lib/store';
import type { NotificationPrefs } from '../lib/types';

const toggleItems: { key: keyof NotificationPrefs; label: string; desc: string }[] = [
  { key: 'dailyBriefing', label: 'Daily briefing', desc: 'Morning summary of spend, bills due, and goal progress.' },
  { key: 'anomalyAlerts', label: 'Anomaly alerts', desc: 'Duplicate charges or unusual spending detected.' },
  { key: 'billDue', label: 'Bill due reminders', desc: 'Heads up before a recurring bill is charged.' },
  { key: 'goalMilestone', label: 'Goal milestones', desc: '25/50/75/100% funded notifications.' },
  { key: 'subscriptionDetected', label: 'Subscription detected', desc: 'New recurring charge identified.' },
  { key: 'recommendationReady', label: 'Recommendation ready', desc: 'A new AI recommendation is available for review.' },
];

export default function Notifications() {
  const router = useRouter();
  const { notificationPrefs, updateNotificationPrefs } = useApp();

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {toggleItems.map((item, i) => (
            <View key={item.key} style={[styles.row, i === toggleItems.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowDesc}>{item.desc}</Text>
              </View>
              <Switch
                value={notificationPrefs[item.key] as boolean}
                onValueChange={(v) => updateNotificationPrefs({ [item.key]: v } as Partial<NotificationPrefs>)}
                trackColor={{ true: colors.accent, false: colors.bgCard }}
                thumbColor={colors.white}
              />
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Quiet hours</Text>
        <View style={styles.quietCard}>
          <View style={styles.quietRow}>
            <Text style={styles.quietLabel}>From</Text>
            <Text style={styles.quietValue}>{notificationPrefs.quietHoursStart}</Text>
          </View>
          <View style={[styles.quietRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.quietLabel}>To</Text>
            <Text style={styles.quietValue}>{notificationPrefs.quietHoursEnd}</Text>
          </View>
        </View>
        <Text style={styles.note}>
          FinPilot won't send non-critical notifications during quiet hours to help avoid notification fatigue.
        </Text>
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
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: { color: colors.textPrimary, fontSize: fontSizes.base, fontWeight: '600', marginBottom: 3 },
  rowDesc: { color: colors.textMuted, fontSize: 12, lineHeight: 16 },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  quietCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  quietRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quietLabel: { color: colors.textSecondary, fontSize: fontSizes.base },
  quietValue: { color: colors.textPrimary, fontSize: fontSizes.base, fontWeight: '700' },
  note: { color: colors.textMuted, fontSize: 12, lineHeight: 17, marginTop: spacing.md },
});
