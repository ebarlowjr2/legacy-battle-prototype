/**
 * Single source of truth for app colors. Use with ThemeContext so that
 * COLORS.primary etc. automatically reflect dark/light mode via useAppTheme().colors.
 */

export type ThemeColors = {
  primary: string;
  primaryDark: string;
  primaryTint: string;
  secondary: string;
  background: string;
  backgroundLight: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  muted: string;
  red: string;
  gray: string;
  success: string;
  successTint: string;
  warning: string;
  warningTint: string;
  error: string;
  info: string;
  infoTint: string;
  gold: string;
  white: string;
  black: string;
  transparent: string;
  overlay: string;
  overlayHeavy: string;
  inputBackground: string;
  inputBorder: string;
  /** Facebook brand blue (social buttons / icons). */
  brandFacebook: string;
};

export const DARK_COLORS: ThemeColors = {
  primary: '#FF0000',
  primaryDark: '#C62828',
  primaryTint: 'rgba(229, 57, 53, 0.1)',
  secondary: '#1B2B1B',
  background: '#121212',
  backgroundLight: '#1E1E1E',
  card: '#1E1E1E',
  cardBorder: '#333333',
  text: '#FFFFFF',
  textSecondary: '#9E9E9E',
  textMuted: '#666666',
  muted: '#666666',
  red: '#F44336',
  gray: '#666666',
  success: '#17B26A',
  successTint: 'rgba(76, 175, 80, 0.1)',
  warning: '#FFC107',
  warningTint: 'rgba(245, 158, 11, 0.1)',
  error: '#F44336',
  info: '#2196F3',
  infoTint: 'rgba(33, 150, 243, 0.1)',
  gold: '#FFD700',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayHeavy: 'rgba(0, 0, 0, 0.7)',
  inputBackground: '#2A2A2A',
  inputBorder: '#404040',
  brandFacebook: '#1877F2',
};

export const LIGHT_COLORS: ThemeColors = {
  primary: '#E53935',
  primaryDark: '#C62828',
  primaryTint: 'rgba(229, 57, 53, 0.08)',
  secondary: '#1B2B1B',
  background: '#F5F5F5',
  backgroundLight: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: '#E0E0E0',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  muted: '#999999',
  red: '#F44336',
  gray: '#999999',
  success: '#4CAF50',
  successTint: 'rgba(76, 175, 80, 0.08)',
  warning: '#FFC107',
  warningTint: 'rgba(245, 158, 11, 0.08)',
  error: '#F44336',
  info: '#2196F3',
  infoTint: 'rgba(33, 150, 243, 0.08)',
  gold: '#FFD700',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.3)',
  overlayHeavy: 'rgba(0, 0, 0, 0.6)',
  inputBackground: '#F0F0F0',
  inputBorder: '#D0D0D0',
  brandFacebook: '#1877F2',
};

export type ThemeMode = 'dark' | 'light';

export function getThemeColors(mode: ThemeMode): ThemeColors {
  return mode === 'dark' ? DARK_COLORS : LIGHT_COLORS;
}
