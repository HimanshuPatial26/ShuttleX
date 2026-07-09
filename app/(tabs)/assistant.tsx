import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/UI';
import { LiquidBackground, Orb3D, AnimatedPressable } from '../../components/anim';
import { colors, fontSizes, radius, spacing } from '../../theme';
import { useApp } from '../../lib/store';
import { suggestedPrompts } from '../../lib/chatEngine';
import { formatMoney } from '../../lib/financeEngine';
import type { ChatMessage } from '../../lib/types';

export default function Assistant() {
  const { chatMessages, sendChatMessage, profile, respondToRecommendation } = useApp();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const submit = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    sendChatMessage(value);
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <LiquidBackground variant="violet" />
      <View style={styles.header}>
        <Orb3D size={40} colorLight="#C9B8FF" colorMid={colors.violet} colorDark="#5A3AB0" float={false} glyph={<Text style={{ fontSize: 16 }}>✳︎</Text>} />
        <View>
          <Text style={styles.headerTitle}>FinPilot Assistant</Text>
          <Text style={styles.headerSubtitle}>Grounded in your real transactions & goals</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={90}>
        <FlatList
          ref={listRef}
          data={chatMessages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              currency={profile.currency}
              onApprove={
                item.structured?.recommendationId
                  ? () => respondToRecommendation(item.structured!.recommendationId!, 'approved')
                  : undefined
              }
            />
          )}
        />

        {chatMessages.length < 3 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promptRow}
          >
            {suggestedPrompts.map((p) => (
              <AnimatedPressable key={p} style={styles.promptChip} onPress={() => submit(p)}>
                <Text style={styles.promptChipText}>{p}</Text>
              </AnimatedPressable>
            ))}
          </ScrollView>
        )}

        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about your money…"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            onSubmitEditing={() => submit()}
            returnKeyType="send"
          />
          <AnimatedPressable style={styles.sendBtnWrap} onPress={() => submit()}>
            <LinearGradient colors={colors.gradientAccent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sendBtn}>
              <Ionicons name="arrow-up" size={18} color={colors.white} />
            </LinearGradient>
          </AnimatedPressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function ChatBubble({
  message,
  currency,
  onApprove,
}: {
  message: ChatMessage;
  currency: any;
  onApprove?: () => void;
}) {
  const isUser = message.role === 'user';
  if (isUser) {
    return (
      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.text}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.assistantRow}>
      <View style={styles.assistantAvatar}>
        <Text style={{ fontSize: 13 }}>✳︎</Text>
      </View>
      <View style={styles.assistantBubble}>
        <Text style={styles.assistantText}>{message.text}</Text>
        {message.structured && (
          <View style={styles.structuredWrap}>
            {message.structured.reasoning && (
              <StructuredBlock label="Why" text={message.structured.reasoning} />
            )}
            {message.structured.recommendation && (
              <StructuredBlock label="Recommendation" text={message.structured.recommendation} />
            )}
            {message.structured.expectedImpact && (
              <StructuredBlock label="Expected impact" text={message.structured.expectedImpact} tone="impact" />
            )}
            {message.structured.actionLabel && (
              <PrimaryButton
                label={message.structured.actionLabel}
                variant="dark"
                style={styles.approveBtn}
                onPress={onApprove}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

function StructuredBlock({ label, text, tone }: { label: string; text: string; tone?: 'impact' }) {
  return (
    <View style={styles.structuredBlock}>
      <Text style={styles.structuredLabel}>{label}</Text>
      <Text style={[styles.structuredText, tone === 'impact' && styles.structuredTextImpact]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: colors.textPrimary, fontSize: fontSizes.base, fontWeight: '700' },
  headerSubtitle: { color: colors.textMuted, fontSize: 11.5, marginTop: 1 },
  listContent: { padding: spacing.xl, gap: 14 },
  userRow: { alignItems: 'flex-end' },
  userBubble: {
    backgroundColor: colors.accent,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 11,
    maxWidth: '82%',
  },
  userText: { color: colors.white, fontSize: fontSizes.base, lineHeight: 20 },
  assistantRow: { flexDirection: 'row', gap: 10, maxWidth: '90%' },
  assistantAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  assistantBubble: {
    backgroundColor: colors.bgCard,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  assistantText: { color: colors.textPrimary, fontSize: fontSizes.base, lineHeight: 21 },
  structuredWrap: { marginTop: 12, gap: 10 },
  structuredBlock: { gap: 2 },
  structuredLabel: {
    color: colors.textMuted,
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  structuredText: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  structuredTextImpact: { color: colors.success, fontWeight: '600' },
  approveBtn: { marginTop: 4, paddingVertical: 11 },
  promptRow: { paddingHorizontal: spacing.xl, gap: 8, paddingBottom: spacing.md },
  promptChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promptChipText: { color: colors.textSecondary, fontSize: 12.5, fontWeight: '600' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  input: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: fontSizes.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtnWrap: { borderRadius: 21, overflow: 'hidden' },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
