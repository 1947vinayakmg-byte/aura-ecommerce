export const LUXURY_COLORS = {
  GOLD: '#D4AF37',
  GOLD_LIGHT: '#F5D76E',
  BLACK: '#0F0F0F',
  DARK: '#1A1A1A',
  CARD: '#161616',
  WHITE: '#FFFFFF',
  SECONDARY: '#B3B3B3',
  MUTED: '#666666',
  EMERALD: '#0E5E4E'
} as const;

export type LuxuryColor = keyof typeof LUXURY_COLORS;
