export const colors = {
  bg: '#0A0E17',
  bgElevated: '#111623',
  bgCard: '#161C2C',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',

  sheet: '#F5F6F8',
  sheetElevated: '#FFFFFF',

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.62)',
  textMuted: 'rgba(255,255,255,0.38)',

  inkPrimary: '#0E1220',
  inkSecondary: 'rgba(14,18,32,0.6)',
  inkMuted: 'rgba(14,18,32,0.4)',

  accent: '#5B8DFF',
  accentSoft: 'rgba(91,141,255,0.16)',
  teal: '#2FD4C4',
  tealSoft: 'rgba(47,212,196,0.16)',

  success: '#34D399',
  successSoft: 'rgba(52,211,153,0.14)',
  warning: '#FBBF24',
  warningSoft: 'rgba(251,191,36,0.14)',
  danger: '#F87171',
  dangerSoft: 'rgba(248,113,113,0.14)',

  gradientCardA: ['#0F2E3D', '#123B4E', '#1E5F73', '#3FB6C9'] as const,
  gradientCardB: ['#1A1F3B', '#2A2F5C', '#4A3F8C'] as const,
  gradientHero: ['#0A0E17', '#0D1220', '#0A0E17'] as const,

  black: '#000000',
  white: '#FFFFFF',
};

export type AppColors = typeof colors;
