import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius } from '../theme';

export function GradientCard({
  cardholder = 'Debit',
  height = 200,
  compact = false,
}: {
  cardholder?: string;
  height?: number;
  compact?: boolean;
}) {
  return (
    <LinearGradient
      colors={colors.gradientCardA}
      start={{ x: 0.1, y: 0.9 }}
      end={{ x: 1, y: 0.1 }}
      style={[styles.card, { height }]}
    >
      <View style={styles.topRow}>
        <View style={styles.chip} />
        <Text style={styles.contactless}>((•))</Text>
      </View>
      {!compact && (
        <View style={styles.logoWrap}>
          <Text style={styles.logo}>✳︎</Text>
        </View>
      )}
      <View style={styles.bottomRow}>
        <Text style={styles.rings}>◎</Text>
        <Text style={styles.label}>{cardholder}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    width: 34,
    height: 24,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  contactless: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  logoWrap: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 46,
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '300',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rings: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 20,
  },
  label: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
