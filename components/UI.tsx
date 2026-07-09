import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontSizes, radius, spacing } from '../theme';
import { AnimatedPressable } from './anim/AnimatedPressable';

export function SectionHeader({
  title,
  action,
  onPressAction,
  dark = false,
}: {
  title: string;
  action?: string;
  onPressAction?: () => void;
  dark?: boolean;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <AnimatedPressable onPress={onPressAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </AnimatedPressable>
      ) : null}
    </View>
  );
}

export function CurrencyPill({ flag, code, amount }: { flag: string; code: string; amount: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillFlag}>{flag}</Text>
      <View>
        <Text style={styles.pillCode}>{code}</Text>
        <Text style={styles.pillAmount}>{amount}</Text>
      </View>
    </View>
  );
}

export function QuickAction({ label, icon, onPress }: { label: string; icon: string; onPress?: () => void }) {
  return (
    <AnimatedPressable style={styles.quickAction} onPress={onPress}>
      <LinearGradient
        colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.04)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.quickActionIcon}
      >
        <Text style={styles.quickActionIconText}>{icon}</Text>
      </LinearGradient>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </AnimatedPressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'accent',
  disabled,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'dark' | 'accent' | 'outline' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const isGradient = variant === 'accent' || variant === 'dark';
  const gradientColors =
    variant === 'accent' ? colors.gradientAccent : (['#1B2236', '#141A2C'] as const);

  return (
    <AnimatedPressable onPress={onPress} disabled={disabled} style={[styles.btnWrap, style]}>
      {isGradient ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.btn, disabled && styles.btnDisabled]}
        >
          <Text style={styles.btnLabel}>{label}</Text>
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.btn,
            variant === 'outline' && styles.btnOutline,
            variant === 'danger' && styles.btnDanger,
            disabled && styles.btnDisabled,
          ]}
        >
          <Text style={[styles.btnLabel, variant === 'outline' && styles.btnLabelOutline]}>{label}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

export function Badge({ text, tone = 'neutral' }: { text: string; tone?: 'neutral' | 'success' | 'warning' | 'danger' }) {
  return (
    <View
      style={[
        styles.badge,
        tone === 'success' && { backgroundColor: colors.successSoft },
        tone === 'warning' && { backgroundColor: colors.warningSoft },
        tone === 'danger' && { backgroundColor: colors.dangerSoft },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          tone === 'success' && { color: colors.success },
          tone === 'warning' && { color: colors.warning },
          tone === 'danger' && { color: colors.danger },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionAction: {
    fontSize: fontSizes.sm,
    color: colors.accent,
    fontWeight: '700',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillFlag: { fontSize: 16 },
  pillCode: { color: colors.textMuted, fontSize: 10, fontWeight: '600' },
  pillAmount: { color: colors.textPrimary, fontSize: 12, fontWeight: '700' },
  quickAction: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  quickActionIcon: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  quickActionIconText: { fontSize: 20, color: colors.white },
  quickActionLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
  btnWrap: {
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  btn: {
    paddingVertical: 15,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1.5, borderColor: colors.borderStrong },
  btnDanger: { backgroundColor: colors.danger },
  btnDisabled: { opacity: 0.4 },
  btnLabel: { color: colors.white, fontSize: fontSizes.base, fontWeight: '700' },
  btnLabelOutline: { color: colors.textPrimary },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
  card: {
    backgroundColor: colors.sheetElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
});
