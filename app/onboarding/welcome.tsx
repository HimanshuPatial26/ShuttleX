import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/UI';
import { colors, fontSizes, spacing } from '../../theme';

export default function Welcome() {
  const router = useRouter();
  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <LinearGradient colors={colors.gradientHero} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoGlyph}>✳︎</Text>
          </View>
          <Text style={styles.brand}>FinPilot AI</Text>
        </View>

        <View style={styles.heroWrap}>
          <Text style={styles.headline}>Your money,{'\n'}on autopilot.</Text>
          <Text style={styles.subhead}>
            An AI financial agent that watches your spending, spots savings, and helps you act —
            before problems compound.
          </Text>
        </View>

        <View style={styles.features}>
          <Feature icon="💬" text="Ask it anything about your money, in plain language" />
          <Feature icon="🎯" text="Track goals with real forecasts, not guesses" />
          <Feature icon="🔔" text="Get nudged the moment something needs attention" />
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="Get Started" variant="accent" onPress={() => router.push('/onboarding/signup')} />
          <Text style={styles.disclaimer}>
            Your financial data stays encrypted. FinPilot never moves money without your approval.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'space-between', paddingBottom: spacing.xl },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: spacing.lg },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlyph: { color: colors.white, fontSize: 18 },
  brand: { color: colors.textPrimary, fontSize: fontSizes.md, fontWeight: '700' },
  heroWrap: { marginTop: spacing.xxxl },
  headline: { color: colors.textPrimary, fontSize: 40, fontWeight: '800', lineHeight: 46, letterSpacing: -0.5 },
  subhead: { color: colors.textSecondary, fontSize: fontSizes.base, lineHeight: 22, marginTop: spacing.lg, maxWidth: 320 },
  features: { gap: 18, marginTop: spacing.xxxl },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureIcon: { fontSize: 20, width: 28 },
  featureText: { color: colors.textSecondary, fontSize: fontSizes.sm, flex: 1, lineHeight: 19 },
  footer: { gap: spacing.md },
  disclaimer: { color: colors.textMuted, fontSize: 11.5, textAlign: 'center', lineHeight: 16, paddingHorizontal: spacing.md },
});
