import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { OnboardingHeader } from '../../components/OnboardingChrome';
import { PrimaryButton } from '../../components/UI';
import { LiquidBackground, Entrance } from '../../components/anim';
import { colors, fontSizes, spacing } from '../../theme';
import { useApp } from '../../lib/store';

export default function Signup() {
  const router = useRouter();
  const { updateProfile } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const canContinue = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email);

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <LiquidBackground variant="teal" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <OnboardingHeader step={1} total={5} />
        <View style={styles.content}>
          <Entrance from="bottom">
            <Text style={styles.title}>Let's get you set up</Text>
            <Text style={styles.subtitle}>Create your FinPilot account. It only takes a minute.</Text>
          </Entrance>

          <View style={styles.form}>
            <Field label="Full name" value={name} onChangeText={setName} placeholder="Alex Morgan" />
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="alex@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.socialRow}>
            <Text style={styles.orText}>or continue with</Text>
            <View style={styles.socialButtons}>
              <View style={styles.socialBtn}>
                <Text style={styles.socialBtnText}></Text>
              </View>
              <View style={styles.socialBtn}>
                <Text style={styles.socialBtnText}>G</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            label="Continue"
            variant="accent"
            disabled={!canContinue}
            onPress={() => {
              updateProfile({ name, email });
              router.push('/onboarding/profile');
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Field(props: React.ComponentProps<typeof TextInput> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...rest}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.xl },
  title: { color: colors.textPrimary, fontSize: fontSizes.xl, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: colors.textSecondary, fontSize: fontSizes.base, lineHeight: 21, marginBottom: spacing.xxl },
  form: { gap: spacing.lg },
  field: { gap: 8 },
  fieldLabel: { color: colors.textSecondary, fontSize: fontSizes.sm, fontWeight: '600' },
  input: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: colors.textPrimary,
    fontSize: fontSizes.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialRow: { marginTop: spacing.xxl, alignItems: 'center', gap: spacing.md },
  orText: { color: colors.textMuted, fontSize: fontSizes.xs },
  socialButtons: { flexDirection: 'row', gap: 14 },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialBtnText: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
});
