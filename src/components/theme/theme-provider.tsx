'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, applyTheme, storeTheme } from '@/lib/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark-premium',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme] = useState<Theme>('dark-premium');
  const [resolvedTheme] = useState<'dark'>('dark');

  const setTheme = (newTheme: Theme) => {
    // Only dark-premium is available, so this is a no-op
    storeTheme(newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    // Always apply dark-premium theme
    applyTheme('dark-premium');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}