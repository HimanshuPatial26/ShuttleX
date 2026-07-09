export const colors = {
  // Deep space base — subtle indigo/violet so gradient orbs read richly
  bg: '#070A14',
  bgDeep: '#04060D',
  bgElevated: '#0E1322',
  bgCard: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.10)',
  borderStrong: 'rgba(255,255,255,0.18)',

  // Glass tokens (used with BlurView overlays)
  glass: 'rgba(20,26,44,0.55)',
  glassStrong: 'rgba(24,30,52,0.72)',
  glassBorder: 'rgba(255,255,255,0.14)',
  glassHighlight: 'rgba(255,255,255,0.22)',

  // "sheet" surfaces are now dark glass panels (flipped from the old light theme)
  sheet: 'rgba(12,16,30,0.72)',
  sheetElevated: 'rgba(255,255,255,0.055)',

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.64)',
  textMuted: 'rgba(255,255,255,0.40)',

  // "ink" tokens (text/content on sheets) — flipped to light so glass panels read correctly
  inkPrimary: '#FFFFFF',
  inkSecondary: 'rgba(255,255,255,0.66)',
  inkMuted: 'rgba(255,255,255,0.42)',

  // Vibrant accents
  accent: '#6E8BFF',
  accentSoft: 'rgba(110,139,255,0.18)',
  violet: '#A57BFF',
  violetSoft: 'rgba(165,123,255,0.18)',
  teal: '#2FD4C4',
  tealSoft: 'rgba(47,212,196,0.18)',
  pink: '#FF7BC5',
  pinkSoft: 'rgba(255,123,197,0.18)',

  success: '#3BE0A0',
  successSoft: 'rgba(59,224,160,0.16)',
  warning: '#FFC94D',
  warningSoft: 'rgba(255,201,77,0.16)',
  danger: '#FF6B8A',
  dangerSoft: 'rgba(255,107,138,0.16)',

  // Multi-stop gradients
  gradientCardA: ['#0E2A3B', '#134B5E', '#2E86A8', '#4FD0D8'] as const,
  gradientCardB: ['#241B4E', '#3A2A78', '#6E4FC0', '#A57BFF'] as const,
  gradientHero: ['#070A14', '#0B1024', '#0A0E1C'] as const,
  gradientAccent: ['#6E8BFF', '#A57BFF'] as const,
  gradientTeal: ['#2FD4C4', '#4F9FE0'] as const,
  gradientViolet: ['#8B6BFF', '#C77BFF'] as const,
  gradientSunset: ['#FF7BC5', '#FFA94D'] as const,
  gradientAurora: ['#6E8BFF', '#A57BFF', '#2FD4C4'] as const,

  // Orb colors for the animated liquid background
  orbViolet: '#7B5CFF',
  orbBlue: '#3C6BFF',
  orbTeal: '#1FC9C0',
  orbPink: '#FF5CA8',

  black: '#000000',
  white: '#FFFFFF',
};

export type AppColors = typeof colors;
