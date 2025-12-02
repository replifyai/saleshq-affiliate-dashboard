'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, applyTheme, storeTheme } from '@/lib/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light';
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
}: ThemeProviderProps) {
  const [theme] = useState<Theme>('light');
  const [resolvedTheme] = useState<'light'>('light');

  const setTheme = (newTheme: Theme) => {
    // Only light theme is available
    storeTheme(newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    // Always apply light theme
    applyTheme('light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}