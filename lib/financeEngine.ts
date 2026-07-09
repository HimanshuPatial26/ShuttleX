import type { Category, Goal, HealthScoreBreakdown, Transaction } from './types';
import { currencySymbols } from './mockData';
import type { UserProfile } from './types';

export function formatMoney(amount: number, currency: UserProfile['currency'] = 'USD') {
  const symbol = currencySymbols[currency];
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount < 0 ? '-' : ''}${symbol}${symbol === 'AED' ? ' ' : ''}${formatted}`;
}

export function isWithinDays(dateISO: string, days: number) {
  const now = Date.now();
  const t = new Date(dateISO).getTime();
  return now - t <= days * 24 * 60 * 60 * 1000;
}

export function monthlySpend(transactions: Transaction[], days = 30) {
  return transactions
    .filter((t) => t.amount < 0 && isWithinDays(t.date, days))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

export function monthlyIncome(transactions: Transaction[], days = 30) {
  return transactions
    .filter((t) => t.amount > 0 && isWithinDays(t.date, days))
    .reduce((sum, t) => sum + t.amount, 0);
}

export function spendByCategory(transactions: Transaction[], days = 30) {
  const map = new Map<Category, number>();
  transactions
    .filter((t) => t.amount < 0 && isWithinDays(t.date, days))
    .forEach((t) => {
      map.set(t.category, (map.get(t.category) ?? 0) + Math.abs(t.amount));
    });
  return [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function computeHealthScore(
  transactions: Transaction[],
  goals: Goal[],
  monthlyIncomeValue: number
): HealthScoreBreakdown {
  const spend30 = monthlySpend(transactions, 30);
  const income30 = monthlyIncomeValue || monthlyIncome(transactions, 30) || 1;

  const savingsAmount = Math.max(income30 - spend30, 0);
  const savingsRatioRaw = savingsAmount / income30; // 0..1
  const savingsRatio = clampScore(savingsRatioRaw / 0.3); // 30% savings = full score

  // Expense control: compare last 30d spend vs prior 30d spend (lower growth = better)
  const spendPrev = monthlySpendRange(transactions, 30, 60);
  const growth = spendPrev > 0 ? (spend30 - spendPrev) / spendPrev : 0;
  const expenseControl = clampScore(1 - Math.max(growth, 0) * 2);

  // Emergency fund: emergency goal current / (3x monthly spend)
  const emergencyGoal = goals.find((g) => g.type === 'Emergency Fund');
  const emergencyTarget = spend30 * 3 || 1;
  const emergencyFund = clampScore((emergencyGoal?.currentAmount ?? 0) / emergencyTarget);

  // Debt management: no explicit debt data in mock -> assume healthy baseline
  const debtManagement = 0.86;

  // Goal progress: average completion across goals
  const goalProgress = goals.length
    ? clampScore(
        goals.reduce((sum, g) => sum + g.currentAmount / g.targetAmount, 0) / goals.length
      )
    : 0.5;

  const total =
    savingsRatio * 0.3 + expenseControl * 0.25 + emergencyFund * 0.2 + debtManagement * 0.15 + goalProgress * 0.1;

  return {
    savingsRatio: Math.round(savingsRatio * 100),
    expenseControl: Math.round(expenseControl * 100),
    emergencyFund: Math.round(emergencyFund * 100),
    debtManagement: Math.round(debtManagement * 100),
    goalProgress: Math.round(goalProgress * 100),
    total: Math.round(total * 100),
  };
}

function clampScore(v: number) {
  return Math.max(0, Math.min(1, v));
}

function monthlySpendRange(transactions: Transaction[], fromDays: number, toDays: number) {
  const now = Date.now();
  return transactions
    .filter((t) => {
      if (t.amount >= 0) return false;
      const age = (now - new Date(t.date).getTime()) / (24 * 60 * 60 * 1000);
      return age > fromDays && age <= toDays;
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

export function goalMonthsRemaining(goal: Goal) {
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  if (goal.monthlyContribution <= 0) return Infinity;
  return Math.ceil(remaining / goal.monthlyContribution);
}

export function goalProgressPct(goal: Goal) {
  return Math.min(1, goal.currentAmount / goal.targetAmount);
}

export function relativeDay(dateISO: string) {
  const d = new Date(dateISO);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(d, today)) return 'Today';
  if (sameDay(d, yest)) return 'Yesterday';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
