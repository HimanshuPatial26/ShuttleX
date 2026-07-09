# FinPilot AI

A mobile-first AI financial agent, built with Expo (React Native + TypeScript) per the
FinPilot AI PRD (v2.0, Mobile App Edition).

## What's here

This is a functional MVP prototype covering the PRD's mobile scope end to end, running on
mock/local data (no backend, bank connection, or LLM API — all "AI" responses are rule-based
and grounded in the sample transaction/goal data included in the app):

- Onboarding: signup, financial profile, biometric setup, data connection, analysis loading state
- Home dashboard: multi-currency balances, Financial Health Score gauge, quick actions, daily
  briefing, top recommendations, recent transactions
- Card tab: virtual debit card, reveal-able card details, card actions
- AI Assistant: chat interface with structured responses (explanation → reasoning →
  recommendation → expected impact → approve action)
- Goals: goal list with progress rings, goal detail with milestones and contribution editing,
  new goal creation
- Subscriptions: detected recurring charges, flag/cancel workflow
- Recommendations feed, notification preferences, Financial Health Score breakdown, privacy &
  data controls
- Biometric app lock (Face ID / fingerprint via `expo-local-authentication`, with a web fallback)

## Running it

```bash
npm install
npm run web      # preview in a browser
npm run ios       # requires macOS + Xcode
npm run android   # requires Android SDK / emulator
```

## Structure

- `app/` — Expo Router file-based routes (onboarding stack, tab navigator, modals)
- `components/` — shared UI (gradient card, health gauge, progress rings, recommendation cards, etc.)
- `lib/` — mock data, finance calculations (health score, spend aggregation), rule-based chat
  engine, and the app-wide state store (`lib/store.tsx`)
- `theme/` — colors, spacing, typography tokens
