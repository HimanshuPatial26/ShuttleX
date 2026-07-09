import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fontSizes, radius, spacing } from '../theme';

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
      <Text style={[styles.sectionTitle, dark && styles.sectionTitleDark]}>{title}</Text>
      {action ? (
        <Pressable onPress={onPressAction} hitSlop={8}>
          <Text style={[styles.sectionAction, dark && styles.sectionActionDark]}>{action}</Text>
        </Pressable>
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
    <Pressable style={styles.quickAction} onPress={onPress}>
      <View style={styles.quickActionIcon}>
        <Text style={styles.quickActionIconText}>{icon}</Text>
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'dark',
  disabled,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'dark' | 'accent' | 'outline' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        variant === 'dark' && styles.btnDark,
        variant === 'accent' && styles.btnAccent,
        variant === 'outline' && styles.btnOutline,
        variant === 'danger' && styles.btnDanger,
        disabled && styles.btnDisabled,
        pressed && !disabled && { opacity: 0.85 },
        style,
      ]}
    >
      <Text
        style={[
          styles.btnLabel,
          variant === 'outline' && styles.btnLabelOutline,
        ]}
      >
        {label}
      </Text>
    </Pressable>
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
    color: colors.inkPrimary,
  },
  sectionTitleDark: {
    color: colors.textPrimary,
  },
  sectionAction: {
    fontSize: fontSizes.sm,
    color: colors.inkSecondary,
    fontWeight: '600',
  },
  sectionActionDark: {
    color: colors.textSecondary,
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
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionIconText: { fontSize: 20 },
  quickActionLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
  btn: {
    paddingVertical: 15,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDark: { backgroundColor: colors.inkPrimary },
  btnAccent: { backgroundColor: colors.accent },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.border },
  btnDanger: { backgroundColor: colors.danger },
  btnDisabled: { opacity: 0.4 },
  btnLabel: { color: colors.white, fontSize: fontSizes.base, fontWeight: '700' },
  btnLabelOutline: { color: colors.textPrimary },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(14,18,32,0.06)',
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.inkSecondary },
  card: {
    backgroundColor: colors.sheetElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
});
