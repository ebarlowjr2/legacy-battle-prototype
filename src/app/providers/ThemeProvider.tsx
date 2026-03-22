import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  theme as staticTheme,
  getThemeColors,
  type Theme,
  type ThemeColors,
  type ThemeMode,
} from '@/shared/theme';
import { THEME_STORAGE_KEY } from '@/shared/constants';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
};

/** Full theme: static tokens + mode-aware colors + mode and toggle. Use this hook for theme in components. */
export type AppTheme = Omit<Theme, 'colors'> & {
  colors: ThemeColors;
  mode: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') {
        setMode(stored);
      }
    });
  }, []);

  const toggleTheme = () => {
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    AsyncStorage.setItem(THEME_STORAGE_KEY, next);
  };

  const colors = getThemeColors(mode);

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
};

/** Single source for theme in components: static tokens + mode-aware colors + mode and toggle. */
export const useTheme = (): AppTheme => {
  const { mode, colors, toggleTheme } = useAppTheme();
  return {
    ...staticTheme,
    colors,
    mode,
    toggleTheme,
  };
};

export const useThemeColors = () => useAppTheme().colors;
