export type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Housing'
  | 'Healthcare'
  | 'Travel'
  | 'Investments'
  | 'Income'
  | 'Subscriptions';

export interface Transaction {
  id: string;
  merchant: string;
  category: Category;
  amount: number; // negative = spend, positive = income
  date: string; // ISO
  paymentMethod: string;
  icon: string;
  isSubscription?: boolean;
}

export type GoalType = 'Travel' | 'Emergency Fund' | 'Vehicle' | 'Education' | 'Home';

export interface Goal {
  id: string;
  name: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  monthlyContribution: number;
  color: string;
}

export type RecommendationType = 'spending' | 'savings' | 'goal' | 'subscription' | 'anomaly';
export type RecommendationStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  explanation: string;
  reasoning: string;
  expectedImpact: string;
  actionLabel?: string;
  status: RecommendationStatus;
  createdAt: string;
}

export type SubscriptionStatus = 'active' | 'flagged' | 'cancelled';

export interface Subscription {
  id: string;
  merchant: string;
  amount: number;
  frequency: 'Monthly' | 'Yearly' | 'Weekly';
  lastUsedDaysAgo: number;
  status: SubscriptionStatus;
  icon: string;
  category: Category;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  structured?: {
    reasoning?: string;
    recommendation?: string;
    expectedImpact?: string;
    actionLabel?: string;
    recommendationId?: string;
  };
  timestamp: string;
}

export interface NotificationPrefs {
  dailyBriefing: boolean;
  dailyBriefingTime: string;
  anomalyAlerts: boolean;
  billDue: boolean;
  goalMilestone: boolean;
  subscriptionDetected: boolean;
  recommendationReady: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface UserProfile {
  name: string;
  email: string;
  country: string;
  currency: 'AED' | 'USD' | 'EUR' | 'GBP';
  incomeRange: string;
  monthlyIncome: number;
  employmentType?: string;
  biometricEnabled: boolean;
}

export interface HealthScoreBreakdown {
  savingsRatio: number;
  expenseControl: number;
  emergencyFund: number;
  debtManagement: number;
  goalProgress: number;
  total: number;
}
