import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../components/Screen';
import { colors, fontSizes, radius, spacing } from '../../theme';
import { useApp } from '../../lib/store';
import { Badge } from '../../components/UI';
import { LiquidBackground, Entrance, AnimatedPressable } from '../../components/anim';

export default function More() {
  const router = useRouter();
  const { profile, subscriptions, recommendations, resetApp } = useApp();

  const flaggedSubs = subscriptions.filter((s) => s.status === 'flagged').length;
  const pendingRecs = recommendations.filter((r) => r.status === 'pending').length;

  const initials = (profile.name || 'FinPilot User')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const confirmReset = () => {
    if (Platform.OS === 'web') {
      resetApp();
      router.replace('/onboarding/welcome');
      return;
    }
    Alert.alert('Restart demo?', 'This clears your session and returns to onboarding.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Restart',
        style: 'destructive',
        onPress: () => {
          resetApp();
          router.replace('/onboarding/welcome');
        },
      },
    ]);
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <LiquidBackground variant="aurora" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Entrance from="top">
          <Text style={styles.title}>More</Text>
        </Entrance>

        <Entrance from="bottom" delay={80}>
          <View style={styles.profileCard}>
            <LinearGradient
              colors={colors.gradientAccent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{profile.name || 'FinPilot User'}</Text>
              <Text style={styles.profileMeta}>
                {profile.currency} · {profile.country}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
        </Entrance>

        <Section title="Insights & agents" index={0}>
          <MenuRow
            icon="pulse-outline"
            label="Financial Health Score"
            onPress={() => router.push('/health-score')}
          />
          <MenuRow
            icon="bulb-outline"
            label="Recommendations"
            trailing={pendingRecs > 0 ? <Badge text={`${pendingRecs} new`} tone="warning" /> : undefined}
            onPress={() => router.push('/recommendations')}
          />
          <MenuRow
            icon="repeat-outline"
            label="Subscriptions"
            trailing={flaggedSubs > 0 ? <Badge text={`${flaggedSubs} flagged`} tone="danger" /> : undefined}
            onPress={() => router.push('/subscriptions')}
          />
          <MenuRow icon="receipt-outline" label="All transactions" onPress={() => router.push('/transactions')} />
        </Section>

        <Section title="Preferences" index={1}>
          <MenuRow icon="notifications-outline" label="Notifications" onPress={() => router.push('/notifications')} />
          <MenuRow icon="shield-checkmark-outline" label="Privacy & data" onPress={() => router.push('/privacy')} />
          <MenuRow icon="finger-print-outline" label="Security & biometrics" onPress={() => router.push('/privacy')} />
        </Section>

        <Section title="Session" index={2}>
          <MenuRow icon="refresh-outline" label="Restart demo" onPress={confirmReset} destructive />
        </Section>

        <Text style={styles.footerNote}>FinPilot AI · MVP demo build · v2.0</Text>
      </ScrollView>
    </Screen>
  );
}

function Section({ title, children, index = 0 }: { title: string; children: React.ReactNode; index?: number }) {
  return (
    <Entrance from="bottom" delay={140 + index * 70} style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </Entrance>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  trailing,
  destructive,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  destructive?: boolean;
}) {
  return (
    <AnimatedPressable style={styles.menuRow} onPress={onPress} scaleTo={0.98}>
      <View style={styles.menuIconWrap}>
        <Ionicons name={icon} size={18} color={destructive ? colors.danger : colors.textPrimary} />
      </View>
      <Text style={[styles.menuLabel, destructive && { color: colors.danger }]}>{label}</Text>
      {trailing}
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  title: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '800', marginBottom: spacing.lg },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontWeight: '800', fontSize: fontSizes.base },
  profileName: { color: colors.textPrimary, fontSize: fontSizes.base, fontWeight: '700' },
  profileMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  section: { marginBottom: spacing.xl },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  sectionBody: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIconWrap: {
    width: 30,
    alignItems: 'center',
  },
  menuLabel: { color: colors.textPrimary, fontSize: fontSizes.base, fontWeight: '600', flex: 1 },
  footerNote: { color: colors.textMuted, fontSize: 11.5, textAlign: 'center', marginTop: spacing.md },
});
