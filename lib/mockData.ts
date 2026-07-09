import type {
  Category,
  Goal,
  NotificationPrefs,
  Recommendation,
  Subscription,
  Transaction,
  UserProfile,
} from './types';

// Simple deterministic PRNG so mock data is stable across reloads.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const iso = (d: Date) => d.toISOString();
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(9 + Math.floor(rand() * 10), Math.floor(rand() * 60), 0, 0);
  return d;
};

const merchants: Record<Category, { name: string; icon: string; range: [number, number] }[]> = {
  Food: [
    { name: 'ShopRite of Avenue', icon: '🛒', range: [35, 130] },
    { name: 'Glovo', icon: '🛵', range: [20, 65] },
    { name: 'Talabat', icon: '🍔', range: [25, 80] },
    { name: 'Carrefour', icon: '🛒', range: [60, 220] },
    { name: 'Costa Coffee', icon: '☕', range: [12, 30] },
  ],
  Transport: [
    { name: 'Uber', icon: '🚕', range: [15, 60] },
    { name: 'Careem', icon: '🚗', range: [15, 55] },
    { name: 'RTA Nol Top-up', icon: '🚇', range: [50, 100] },
    { name: 'ADNOC Fuel', icon: '⛽', range: [80, 180] },
  ],
  Shopping: [
    { name: 'Amazon.ae', icon: '📦', range: [40, 350] },
    { name: 'Noon', icon: '🛍️', range: [30, 280] },
    { name: 'Zara', icon: '👕', range: [90, 400] },
    { name: 'IKEA', icon: '🪑', range: [120, 600] },
  ],
  Entertainment: [
    { name: 'Netflix', icon: '🎬', range: [45, 45] },
    { name: 'Spotify', icon: '🎵', range: [22, 22] },
    { name: 'VOX Cinemas', icon: '🎟️', range: [60, 140] },
    { name: 'PlayStation Store', icon: '🎮', range: [30, 250] },
  ],
  Housing: [
    { name: 'DEWA Utilities', icon: '💡', range: [250, 550] },
    { name: 'Etisalat Home', icon: '📶', range: [300, 400] },
    { name: 'Rent - Marina Tower', icon: '🏠', range: [8500, 8500] },
  ],
  Healthcare: [
    { name: 'Life Pharmacy', icon: '💊', range: [30, 150] },
    { name: 'Mediclinic', icon: '🏥', range: [150, 600] },
    { name: 'Fitness First', icon: '🏋️', range: [299, 299] },
  ],
  Travel: [
    { name: 'Emirates Airlines', icon: '✈️', range: [900, 3200] },
    { name: 'Booking.com', icon: '🏨', range: [400, 1800] },
  ],
  Investments: [{ name: 'Sarwa Invest', icon: '📈', range: [200, 1000] }],
  Income: [{ name: 'Salary - Employer LLC', icon: '💼', range: [18000, 18000] }],
  Subscriptions: [
    { name: 'Netflix', icon: '🎬', range: [45, 45] },
    { name: 'Spotify', icon: '🎵', range: [22, 22] },
    { name: 'Fitness First', icon: '🏋️', range: [299, 299] },
    { name: 'Adobe Creative Cloud', icon: '🎨', range: [149, 149] },
    { name: 'iCloud+', icon: '☁️', range: [11, 11] },
    { name: 'NowTV Sports', icon: '📺', range: [199, 199] },
  ],
};

const paymentMethods = ['Debit card', 'Credit card', 'Apple Pay', 'Bank transfer'];

function genSpend(category: Category, date: Date, forceMerchant?: string): Transaction {
  const list = merchants[category];
  const m = forceMerchant ? list.find((x) => x.name === forceMerchant) ?? pick(list) : pick(list);
  const amt = m.range[0] + rand() * (m.range[1] - m.range[0]);
  return {
    id: `tx_${date.getTime()}_${Math.floor(rand() * 100000)}`,
    merchant: m.name,
    category,
    amount: -Math.round(amt * 100) / 100,
    date: iso(date),
    paymentMethod: pick(paymentMethods),
    icon: m.icon,
  };
}

function buildTransactions(): Transaction[] {
  const txs: Transaction[] = [];

  // Salary, last 2 months
  txs.push({
    id: 'tx_income_0',
    merchant: 'Salary - Employer LLC',
    category: 'Income',
    amount: 18000,
    date: iso(daysAgo(2)),
    paymentMethod: 'Bank transfer',
    icon: '💼',
  });
  txs.push({
    id: 'tx_income_1',
    merchant: 'Salary - Employer LLC',
    category: 'Income',
    amount: 18000,
    date: iso(daysAgo(32)),
    paymentMethod: 'Bank transfer',
    icon: '💼',
  });

  // Recurring subscriptions - monthly for last 3 cycles each (some unused -> flagged later)
  const subsSchedule: { name: string; every: number }[] = [
    { name: 'Netflix', every: 30 },
    { name: 'Spotify', every: 30 },
    { name: 'Fitness First', every: 30 },
    { name: 'Adobe Creative Cloud', every: 30 },
    { name: 'iCloud+', every: 30 },
    { name: 'NowTV Sports', every: 30 },
  ];
  subsSchedule.forEach((s) => {
    for (let cycle = 0; cycle < 3; cycle++) {
      const d = daysAgo(cycle * s.every + Math.floor(rand() * 3));
      const t = genSpend('Subscriptions', d, s.name);
      t.isSubscription = true;
      txs.push(t);
    }
  });

  // Housing (rent + utilities) monthly
  ['Rent - Marina Tower', 'DEWA Utilities', 'Etisalat Home'].forEach((name) => {
    for (let cycle = 0; cycle < 2; cycle++) {
      txs.push(genSpend('Housing', daysAgo(cycle * 30 + Math.floor(rand() * 4)), name));
    }
  });

  // Daily-ish spend across 45 days
  const dailyCats: Category[] = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Healthcare'];
  for (let d = 0; d < 45; d++) {
    const count = rand() < 0.7 ? 1 : rand() < 0.9 ? 2 : 0;
    for (let i = 0; i < count; i++) {
      const cat = pick(dailyCats);
      txs.push(genSpend(cat, daysAgo(d)));
    }
  }

  // A couple of travel + investment entries (kept outside the last-30-day
  // window so a one-off trip doesn't distort the current month's health score)
  txs.push(genSpend('Travel', daysAgo(40)));
  txs.push(genSpend('Investments', daysAgo(5)));
  txs.push(genSpend('Investments', daysAgo(35)));

  // Known anomaly: duplicate charge
  const dup = genSpend('Shopping', daysAgo(3), 'Noon');
  const dup2: Transaction = { ...dup, id: dup.id + '_dup', date: dup.date };
  txs.push(dup, dup2);

  // Explicit "today/yesterday" curated rows to match reference visuals
  txs.push({
    id: 'tx_curated_1',
    merchant: 'John Williams',
    category: 'Shopping',
    amount: -75,
    date: iso(daysAgo(0)),
    paymentMethod: 'Debit card',
    icon: '👤',
  });
  txs.push({
    id: 'tx_curated_2',
    merchant: 'Uber',
    category: 'Transport',
    amount: -34.24,
    date: iso(daysAgo(0)),
    paymentMethod: 'Debit card',
    icon: '🚕',
  });
  txs.push({
    id: 'tx_curated_3',
    merchant: 'ShopRite of Avenue',
    category: 'Food',
    amount: -56.84,
    date: iso(daysAgo(1)),
    paymentMethod: 'Debit card',
    icon: '🛒',
  });
  txs.push({
    id: 'tx_curated_4',
    merchant: 'Glovo',
    category: 'Food',
    amount: -56.84,
    date: iso(daysAgo(1)),
    paymentMethod: 'Debit card',
    icon: '🛵',
  });

  return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const mockTransactions: Transaction[] = buildTransactions();

export const mockGoals: Goal[] = [
  {
    id: 'goal_travel',
    name: 'Japan Trip',
    type: 'Travel',
    targetAmount: 12000,
    currentAmount: 8640,
    deadline: '2026-12-01',
    monthlyContribution: 600,
    color: '#2FD4C4',
  },
  {
    id: 'goal_emergency',
    name: 'Emergency Fund',
    type: 'Emergency Fund',
    targetAmount: 30000,
    currentAmount: 14250,
    deadline: '2027-03-01',
    monthlyContribution: 900,
    color: '#5B8DFF',
  },
  {
    id: 'goal_car',
    name: 'New Car',
    type: 'Vehicle',
    targetAmount: 45000,
    currentAmount: 9800,
    deadline: '2027-09-01',
    monthlyContribution: 750,
    color: '#FBBF24',
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec_dining',
    type: 'spending',
    title: 'Dining spend is up 40% this month',
    explanation:
      'You spent AED 1,860 on Food this month vs. your 3-month average of AED 1,330.',
    reasoning:
      'Most of the increase came from delivery apps (Glovo, Talabat) on weekday evenings.',
    expectedImpact: 'Cutting delivery orders to 2x/week could save ~AED 420/month.',
    actionLabel: 'Set a dining budget of AED 1,400',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec_subs',
    type: 'subscription',
    title: 'Reduce subscriptions to save AED 250/month',
    explanation: 'You have 6 active subscriptions totaling AED 725/month.',
    reasoning: '"NowTV Sports" and "Fitness First" show no matching activity in 60 days.',
    expectedImpact: 'Cancelling both frees up AED 498/month toward your goals.',
    actionLabel: 'Flag 2 subscriptions for cancellation',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec_goal_travel',
    type: 'goal',
    title: 'Reach your Japan Trip goal 2 months sooner',
    explanation: 'Your travel goal is 72% funded with 5 months remaining.',
    reasoning: 'Increasing your monthly contribution by AED 300 closes the gap faster.',
    expectedImpact: 'You would hit AED 12,000 by month 3 instead of month 5.',
    actionLabel: 'Increase monthly contribution to AED 900',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec_anomaly',
    type: 'anomaly',
    title: 'Possible duplicate charge detected',
    explanation: 'Two identical charges of the same amount from "Noon" were posted minutes apart.',
    reasoning: 'Duplicate merchant, amount, and timestamp pattern matches known double-billing cases.',
    expectedImpact: 'Disputing the duplicate could recover the charged amount.',
    actionLabel: 'Flag transaction for dispute',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_netflix',
    merchant: 'Netflix',
    amount: 45,
    frequency: 'Monthly',
    lastUsedDaysAgo: 2,
    status: 'active',
    icon: '🎬',
    category: 'Entertainment',
  },
  {
    id: 'sub_spotify',
    merchant: 'Spotify',
    amount: 22,
    frequency: 'Monthly',
    lastUsedDaysAgo: 1,
    status: 'active',
    icon: '🎵',
    category: 'Entertainment',
  },
  {
    id: 'sub_fitness',
    merchant: 'Fitness First',
    amount: 299,
    frequency: 'Monthly',
    lastUsedDaysAgo: 63,
    status: 'flagged',
    icon: '🏋️',
    category: 'Healthcare',
  },
  {
    id: 'sub_adobe',
    merchant: 'Adobe Creative Cloud',
    amount: 149,
    frequency: 'Monthly',
    lastUsedDaysAgo: 9,
    status: 'active',
    icon: '🎨',
    category: 'Shopping',
  },
  {
    id: 'sub_icloud',
    merchant: 'iCloud+',
    amount: 11,
    frequency: 'Monthly',
    lastUsedDaysAgo: 0,
    status: 'active',
    icon: '☁️',
    category: 'Shopping',
  },
  {
    id: 'sub_nowtv',
    merchant: 'NowTV Sports',
    amount: 199,
    frequency: 'Monthly',
    lastUsedDaysAgo: 61,
    status: 'flagged',
    icon: '📺',
    category: 'Entertainment',
  },
];

export const defaultNotificationPrefs: NotificationPrefs = {
  dailyBriefing: true,
  dailyBriefingTime: '08:00',
  anomalyAlerts: true,
  billDue: true,
  goalMilestone: true,
  subscriptionDetected: true,
  recommendationReady: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
};

export const defaultProfile: UserProfile = {
  name: '',
  email: '',
  country: 'United Arab Emirates',
  currency: 'USD',
  incomeRange: 'AED 15,000 - 20,000',
  monthlyIncome: 18000,
  biometricEnabled: false,
};

export const currencySymbols: Record<UserProfile['currency'], string> = {
  AED: 'AED',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const walletBalances = [
  { code: 'USD', flag: '🇺🇸', amount: 24092.67 },
  { code: 'EUR', flag: '🇪🇺', amount: 7805.91 },
  { code: 'AED', flag: '🇦🇪', amount: 3893.7 },
];
