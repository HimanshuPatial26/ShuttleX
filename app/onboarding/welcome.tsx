import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/UI';
import { LiquidBackground, GlassCard, Orb3D, Entrance } from '../../components/anim';
import { colors, fontSizes, spacing } from '../../theme';

export default function Welcome() {
  const router = useRouter();
  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <LiquidBackground variant="aurora" />

      <View style={styles.content}>
        <Entrance from="top">
          <View style={styles.brandRow}>
            <Orb3D size={34} colorLight="#B9C6FF" colorMid={colors.accent} colorDark="#3A4CC0" float={false} />
            <Text style={styles.brand}>FinPilot AI</Text>
          </View>
        </Entrance>

        {/* Floating 3D orb cluster */}
        <View style={styles.orbStage}>
          <Orb3D
            size={150}
            colorLight="#C9B8FF"
            colorMid={colors.violet}
            colorDark="#5A3AB0"
            delay={0}
            style={styles.orbMain}
            glyph={<Text style={styles.orbGlyph}>✳︎</Text>}
          />
          <Orb3D size={68} colorLight="#9FF3EA" colorMid={colors.teal} colorDark="#188F86" delay={400} style={styles.orbTeal} />
          <Orb3D size={54} colorLight="#FFC3E1" colorMid={colors.pink} colorDark="#B83E7E" delay={800} style={styles.orbPink} />
          <Orb3D size={44} colorLight="#BBC9FF" colorMid={colors.accent} colorDark="#3A4CC0" delay={600} style={styles.orbBlue} />
        </View>

        <Entrance from="bottom" delay={200}>
          <Text style={styles.headline}>Your money,{'\n'}on autopilot.</Text>
          <Text style={styles.subhead}>
            An AI financial agent that watches your spending, spots savings, and helps you act — before
            problems compound.
          </Text>
        </Entrance>

        <Entrance from="bottom" delay={340} style={{ marginTop: spacing.xxl }}>
          <GlassCard style={styles.featureCard} intensity={20}>
            <Feature icon="💬" text="Ask it anything about your money, in plain language" />
            <View style={styles.featureDivider} />
            <Feature icon="🎯" text="Track goals with real forecasts, not guesses" />
            <View style={styles.featureDivider} />
            <Feature icon="🔔" text="Get nudged the moment something needs attention" />
          </GlassCard>
        </Entrance>

        <Entrance from="scale" delay={520} style={styles.footer}>
          <PrimaryButton label="Get Started" variant="accent" onPress={() => router.push('/onboarding/signup')} />
          <Text style={styles.disclaimer}>
            Your financial data stays encrypted. FinPilot never moves money without your approval.
          </Text>
        </Entrance>
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
  content: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: 'flex-start', paddingBottom: spacing.xl },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.lg },
  brand: { color: colors.textPrimary, fontSize: fontSizes.md, fontWeight: '800' },
  orbStage: { height: 190, marginTop: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  orbMain: { position: 'absolute' },
  orbGlyph: { fontSize: 44, color: 'rgba(255,255,255,0.92)', fontWeight: '300' },
  orbTeal: { position: 'absolute', top: 6, right: 40 },
  orbPink: { position: 'absolute', bottom: 8, left: 44 },
  orbBlue: { position: 'absolute', top: 30, left: 52 },
  headline: { color: colors.textPrimary, fontSize: 40, fontWeight: '800', lineHeight: 46, letterSpacing: -0.5, marginTop: spacing.md },
  subhead: { color: colors.textSecondary, fontSize: fontSizes.base, lineHeight: 22, marginTop: spacing.md, maxWidth: 340 },
  featureCard: { padding: spacing.lg, gap: 0 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 11 },
  featureDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  featureIcon: { fontSize: 20, width: 28 },
  featureText: { color: colors.textSecondary, fontSize: fontSizes.sm, flex: 1, lineHeight: 19 },
  footer: { gap: spacing.md, marginTop: 'auto' },
  disclaimer: { color: colors.textMuted, fontSize: 11.5, textAlign: 'center', lineHeight: 16, paddingHorizontal: spacing.md },
});
