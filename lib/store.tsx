import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { generateAssistantReply, suggestedPrompts } from './chatEngine';
import {
  defaultNotificationPrefs,
  defaultProfile,
  mockGoals,
  mockRecommendations,
  mockSubscriptions,
  mockTransactions,
} from './mockData';
import { computeHealthScore } from './financeEngine';
import type {
  ChatMessage,
  Goal,
  HealthScoreBreakdown,
  NotificationPrefs,
  Recommendation,
  Subscription,
  Transaction,
  UserProfile,
} from './types';

interface AppState {
  onboardingComplete: boolean;
  profile: UserProfile;
  transactions: Transaction[];
  goals: Goal[];
  recommendations: Recommendation[];
  subscriptions: Subscription[];
  chatMessages: ChatMessage[];
  notificationPrefs: NotificationPrefs;
  healthScore: HealthScoreBreakdown;
  locked: boolean;

  completeOnboarding: (profile: Partial<UserProfile>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  sendChatMessage: (text: string) => void;
  respondToRecommendation: (id: string, status: 'approved' | 'rejected') => void;
  flagSubscription: (id: string) => void;
  cancelSubscription: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoalContribution: (id: string, monthlyContribution: number) => void;
  updateNotificationPrefs: (prefs: Partial<NotificationPrefs>) => void;
  unlock: () => void;
  lock: () => void;
  resetApp: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(defaultNotificationPrefs);
  const [locked, setLocked] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      text: `Hi${profile.name ? ' ' + profile.name.split(' ')[0] : ''}! I'm your FinPilot assistant. Ask me anything about your money — try "${suggestedPrompts[0]}"`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const healthScore = useMemo(
    () => computeHealthScore(transactions, goals, profile.monthlyIncome),
    [transactions, goals, profile.monthlyIncome]
  );

  const completeOnboarding = useCallback((p: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...p }));
    setOnboardingComplete(true);
  }, []);

  const updateProfile = useCallback((p: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...p }));
  }, []);

  const sendChatMessage = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = {
        id: `msg_${Date.now()}_u`,
        role: 'user',
        text,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, userMsg]);
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          generateAssistantReply(text, { transactions, goals, subscriptions, recommendations, profile }),
        ]);
      }, 500);
    },
    [transactions, goals, subscriptions, recommendations, profile]
  );

  const respondToRecommendation = useCallback((id: string, status: 'approved' | 'rejected') => {
    setRecommendations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const flagSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'flagged' } : s)));
  }, []);

  const cancelSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'cancelled' } : s)));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    setGoals((prev) => [...prev, { ...goal, id: `goal_${Date.now()}` }]);
  }, []);

  const updateGoalContribution = useCallback((id: string, monthlyContribution: number) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, monthlyContribution } : g)));
  }, []);

  const updateNotificationPrefs = useCallback((prefs: Partial<NotificationPrefs>) => {
    setNotificationPrefs((prev) => ({ ...prev, ...prefs }));
  }, []);

  const unlock = useCallback(() => setLocked(false), []);
  const lock = useCallback(() => setLocked(true), []);

  const resetApp = useCallback(() => {
    setOnboardingComplete(false);
    setProfile(defaultProfile);
    setLocked(false);
  }, []);

  const value: AppState = {
    onboardingComplete,
    profile,
    transactions,
    goals,
    recommendations,
    subscriptions,
    chatMessages,
    notificationPrefs,
    healthScore,
    locked,
    completeOnboarding,
    updateProfile,
    sendChatMessage,
    respondToRecommendation,
    flagSubscription,
    cancelSubscription,
    addGoal,
    updateGoalContribution,
    updateNotificationPrefs,
    unlock,
    lock,
    resetApp,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
