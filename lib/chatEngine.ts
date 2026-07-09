import { formatMoney, goalMonthsRemaining, goalProgressPct, monthlySpend, spendByCategory } from './financeEngine';
import type { ChatMessage, Goal, Recommendation, Subscription, Transaction, UserProfile } from './types';

interface ChatContext {
  transactions: Transaction[];
  goals: Goal[];
  subscriptions: Subscription[];
  recommendations: Recommendation[];
  profile: UserProfile;
}

function newMessage(partial: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
  return {
    ...partial,
    id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    timestamp: new Date().toISOString(),
  };
}

export function generateAssistantReply(userText: string, ctx: ChatContext): ChatMessage {
  const text = userText.toLowerCase();
  const cur = ctx.profile.currency;
  const spend30 = monthlySpend(ctx.transactions, 30);
  const byCategory = spendByCategory(ctx.transactions, 30);

  if (/afford|vacation|trip|buy a|purchase/.test(text)) {
    const topGoal = ctx.goals[0];
    const disposable = ctx.profile.monthlyIncome - spend30;
    const canAfford = disposable > 1500;
    return newMessage({
      role: 'assistant',
      text: canAfford
        ? `Based on your spending this month, you have about ${formatMoney(disposable, cur)} in disposable income after expenses.`
        : `Your disposable income this month is tight — about ${formatMoney(Math.max(disposable, 0), cur)} after expenses.`,
      structured: {
        reasoning: `Income of ${formatMoney(ctx.profile.monthlyIncome, cur)} minus ${formatMoney(spend30, cur)} in tracked spending over the last 30 days.${
          topGoal ? ` Your "${topGoal.name}" goal is ${Math.round(goalProgressPct(topGoal) * 100)}% funded.` : ''
        }`,
        recommendation: canAfford
          ? `You could set aside up to ${formatMoney(Math.min(disposable * 0.4, 2000), cur)} for this without affecting your goals.`
          : `Consider waiting 2-3 weeks, or trimming discretionary categories like Shopping and Entertainment first.`,
        expectedImpact: canAfford
          ? `This keeps your savings rate healthy while still making progress.`
          : `Delaying this purchase protects your Financial Health Score and goal timelines.`,
        actionLabel: canAfford ? 'Set aside funds for this purchase' : undefined,
      },
    });
  }

  if (/overspen|why did i spend|spending/.test(text)) {
    const top = byCategory[0];
    return newMessage({
      role: 'assistant',
      text: top
        ? `Your biggest category this month was ${top.category} at ${formatMoney(top.amount, cur)}.`
        : `You're tracking under budget across all categories this month.`,
      structured: top
        ? {
            reasoning: `${top.category} spend is running above your recent average, largely driven by frequent smaller transactions rather than one big purchase.`,
            recommendation: `Setting a soft monthly cap on ${top.category} can help you catch overspending earlier.`,
            expectedImpact: `A 20% reduction in ${top.category} would free up roughly ${formatMoney(top.amount * 0.2, cur)}/month.`,
            actionLabel: `Set a ${top.category} budget`,
          }
        : undefined,
    });
  }

  if (/save|saving/.test(text)) {
    const flaggedSubs = ctx.subscriptions.filter((s) => s.status === 'flagged');
    const subsTotal = flaggedSubs.reduce((s, x) => s + x.amount, 0);
    return newMessage({
      role: 'assistant',
      text: `You could realistically save more by trimming unused subscriptions and capping discretionary categories.`,
      structured: {
        reasoning: flaggedSubs.length
          ? `${flaggedSubs.length} subscription${flaggedSubs.length > 1 ? 's' : ''} (${flaggedSubs
              .map((s) => s.merchant)
              .join(', ')}) show little to no recent usage.`
          : `No unused subscriptions detected right now — your recurring spend looks efficient.`,
        recommendation: flaggedSubs.length
          ? `Cancel or pause these to immediately increase your monthly savings.`
          : `Focus on your top discretionary category instead.`,
        expectedImpact: flaggedSubs.length
          ? `That's about ${formatMoney(subsTotal, cur)}/month back into savings or goals.`
          : `Small consistent increases to your goal contributions compound quickly.`,
        actionLabel: flaggedSubs.length ? 'Review flagged subscriptions' : undefined,
      },
    });
  }

  if (/subscription/.test(text)) {
    const active = ctx.subscriptions.filter((s) => s.status !== 'cancelled');
    const total = active.reduce((s, x) => s + x.amount, 0);
    return newMessage({
      role: 'assistant',
      text: `You have ${active.length} active subscriptions totaling ${formatMoney(total, cur)}/month.`,
      structured: {
        reasoning: `Detected via recurring merchant, amount, and frequency matching across your transaction history.`,
        recommendation: `Check the Subscriptions tab to review each one and flag anything unused.`,
        expectedImpact: `Trimming just the unused ones is often the fastest way to boost your savings rate.`,
      },
    });
  }

  if (/goal|travel|japan|emergency|car/.test(text)) {
    const goal = ctx.goals.find((g) => text.includes(g.name.toLowerCase().split(' ')[0])) ?? ctx.goals[0];
    if (!goal) {
      return newMessage({ role: 'assistant', text: `You don't have any goals set up yet — want to create one?` });
    }
    const months = goalMonthsRemaining(goal);
    return newMessage({
      role: 'assistant',
      text: `Your "${goal.name}" goal is ${Math.round(goalProgressPct(goal) * 100)}% funded (${formatMoney(
        goal.currentAmount,
        cur
      )} of ${formatMoney(goal.targetAmount, cur)}).`,
      structured: {
        reasoning: `At ${formatMoney(goal.monthlyContribution, cur)}/month, you're on track to finish in about ${months} month${
          months === 1 ? '' : 's'
        }.`,
        recommendation: `Increasing your contribution by ${formatMoney(goal.monthlyContribution * 0.25, cur)}/month would meaningfully speed this up.`,
        expectedImpact: `That could pull your finish date in by several weeks.`,
        actionLabel: `Increase contribution to ${goal.name}`,
      },
    });
  }

  if (/health score|score/.test(text)) {
    return newMessage({
      role: 'assistant',
      text: `Your Financial Health Score blends five factors: savings ratio, expense control, emergency fund coverage, debt management, and goal progress.`,
      structured: {
        recommendation: `Tap the score on your Home tab to see a full breakdown of what's helping or hurting it.`,
      },
    });
  }

  return newMessage({
    role: 'assistant',
    text: `I looked at your last 30 days: ${formatMoney(spend30, cur)} spent, income of ${formatMoney(
      ctx.profile.monthlyIncome,
      cur
    )}. Ask me things like "Can I afford a trip?", "Why did I overspend?", or "How much can I save?"`,
  });
}

export const suggestedPrompts = [
  'Can I afford a vacation this month?',
  'Why did I overspend?',
  'How much can I save?',
  'Show my subscriptions',
];
