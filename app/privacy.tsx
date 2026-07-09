import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { PrimaryButton } from '../components/UI';
import { colors, fontSizes, radius, spacing } from '../theme';
import { useApp } from '../lib/store';

export default function Privacy() {
  const router = useRouter();
  const { profile, updateProfile } = useApp();
  const [bankConnected, setBankConnected] = useState(true);

  const notify = (title: string, msg: string) => {
    if (Platform.OS === 'web') {
      // eslint-disable-next-line no-alert
      window.alert(`${title}\n\n${msg}`);
    } else {
      Alert.alert(title, msg);
    }
  };

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacy & data</Text>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="finger-print-outline" size={18} color={colors.textPrimary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.rowLabel}>Biometric unlock</Text>
              <Text style={styles.rowDesc}>Required to open the app and approve financial actions.</Text>
            </View>
            <Switch
              value={profile.biometricEnabled}
              onValueChange={(v) => updateProfile({ biometricEnabled: v })}
              trackColor={{ true: colors.accent, false: colors.bgElevated }}
              thumbColor={colors.white}
            />
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Ionicons name="link-outline" size={18} color={colors.textPrimary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.rowLabel}>Bank connection</Text>
              <Text style={styles.rowDesc}>Revoke consent for Open Banking access at any time.</Text>
            </View>
            <Switch
              value={bankConnected}
              onValueChange={setBankConnected}
              trackColor={{ true: colors.accent, false: colors.bgElevated }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Your data</Text>
        <View style={styles.card}>
          <ActionRow
            icon="eye-outline"
            label="View all data collected about me"
            onPress={() => notify('Your data', 'Profile, transactions, goals, and conversation history are available for export below.')}
          />
          <ActionRow
            icon="download-outline"
            label="Export data (CSV / JSON)"
            onPress={() => notify('Export started', 'Your data export will be ready shortly (demo only).')}
          />
          <ActionRow
            icon="trash-outline"
            label="Delete my financial data"
            danger
            last
            onPress={() =>
              notify('Delete requested', 'In a production build this would permanently erase your financial data after confirmation.')
            }
          />
        </View>

        <Text style={styles.footerNote}>
          FinPilot encrypts data in transit (TLS 1.2+) and at rest (AES-256). Bank credentials are never stored on
          this device — only short-lived session tokens.
        </Text>
      </ScrollView>
    </Screen>
  );
}

function ActionRow({
  icon,
  label,
  onPress,
  danger,
  last,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
}) {
  return (
    <Pressable style={[styles.actionRow, last && { borderBottomWidth: 0 }]} onPress={onPress}>
      <Ionicons name={icon} size={18} color={danger ? colors.danger : colors.textPrimary} />
      <Text style={[styles.actionLabel, danger && { color: colors.danger }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </Pressable>
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
    marginBottom: spacing.lg,
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
    marginBottom: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionLabel: { color: colors.textPrimary, fontSize: fontSizes.base, fontWeight: '600', flex: 1 },
  footerNote: { color: colors.textMuted, fontSize: 12, lineHeight: 17 },
});
