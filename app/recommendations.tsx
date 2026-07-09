import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../components/Screen';
import { RecommendationCard } from '../components/RecommendationCard';
import { colors, fontSizes, spacing } from '../theme';
import { useApp } from '../lib/store';

export default function Recommendations() {
  const router = useRouter();
  const { recommendations, respondToRecommendation } = useApp();

  const pending = recommendations.filter((r) => r.status === 'pending');
  const resolved = recommendations.filter((r) => r.status !== 'pending');

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommendations</Text>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {pending.length === 0 && resolved.length === 0 && (
          <Text style={styles.empty}>No recommendations right now — check back after your next sync.</Text>
        )}

        {pending.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Awaiting your review</Text>
            {pending.map((rec) => (
              <RecommendationCard
                key={rec.id}
                rec={rec}
                onApprove={() => respondToRecommendation(rec.id, 'approved')}
                onReject={() => respondToRecommendation(rec.id, 'rejected')}
              />
            ))}
          </>
        )}

        {resolved.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>History</Text>
            {resolved.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
          </>
        )}
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
  content: { paddingBottom: spacing.xxl },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxl, paddingHorizontal: spacing.xl },
});
