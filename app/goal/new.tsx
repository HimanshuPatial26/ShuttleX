import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/UI';
import { colors, fontSizes, radius, spacing } from '../../theme';
import { useApp } from '../../lib/store';
import type { GoalType } from '../../lib/types';

const types: { type: GoalType; icon: string; color: string }[] = [
  { type: 'Travel', icon: '✈️', color: '#2FD4C4' },
  { type: 'Emergency Fund', icon: '🛟', color: '#5B8DFF' },
  { type: 'Vehicle', icon: '🚗', color: '#FBBF24' },
  { type: 'Education', icon: '🎓', color: '#A78BFA' },
  { type: 'Home', icon: '🏠', color: '#F472B6' },
];

export default function NewGoal() {
  const router = useRouter();
  const { addGoal } = useApp();
  const [selectedType, setSelectedType] = useState<GoalType>('Travel');
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [monthly, setMonthly] = useState('');

  const canSave = name.trim().length > 1 && Number(target) > 0 && Number(monthly) >= 0;

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>New goal</Text>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Goal type</Text>
        <View style={styles.typeGrid}>
          {types.map((t) => (
            <Pressable
              key={t.type}
              style={[styles.typeChip, selectedType === t.type && { backgroundColor: t.color }]}
              onPress={() => setSelectedType(t.type)}
            >
              <Text style={styles.typeIcon}>{t.icon}</Text>
              <Text style={[styles.typeLabel, selectedType === t.type && { color: colors.inkPrimary }]}>
                {t.type}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Goal name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Bali Trip"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Target amount</Text>
        <TextInput
          style={styles.input}
          placeholder="10000"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          value={target}
          onChangeText={setTarget}
        />

        <Text style={styles.label}>Monthly contribution</Text>
        <TextInput
          style={styles.input}
          placeholder="500"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          value={monthly}
          onChangeText={setMonthly}
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Create goal"
          variant="accent"
          disabled={!canSave}
          onPress={() => {
            const meta = types.find((t) => t.type === selectedType)!;
            const deadline = new Date();
            deadline.setMonth(deadline.getMonth() + Math.max(1, Math.ceil(Number(target) / Math.max(1, Number(monthly)))));
            addGoal({
              name,
              type: selectedType,
              targetAmount: Number(target),
              currentAmount: 0,
              monthlyContribution: Number(monthly),
              deadline: deadline.toISOString(),
              color: meta.color,
            });
            router.back();
          }}
        />
      </View>
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
  title: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '800' },
  close: { color: colors.textSecondary, fontSize: 20 },
  content: { flex: 1, paddingHorizontal: spacing.xl },
  label: { color: colors.textSecondary, fontSize: fontSizes.sm, fontWeight: '700', marginBottom: spacing.sm, marginTop: spacing.lg },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeIcon: { fontSize: 14 },
  typeLabel: { color: colors.textSecondary, fontSize: 12.5, fontWeight: '600' },
  input: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.textPrimary,
    fontSize: fontSizes.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, paddingTop: spacing.md },
});
