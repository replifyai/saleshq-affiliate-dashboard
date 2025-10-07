'use client';

import React from 'react';
import { useTheme } from './theme-provider';
import { themeConfigs } from '@/lib/theme';
import { Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

// Since we only have one theme, these components are simplified to just show the current theme
export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme } = useTheme();
  const currentTheme = themeConfigs[theme];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        className="px-3 py-2 rounded-lg text-sm font-medium bg-primary text-black shadow-sm"
        title={currentTheme.name}
        aria-label={currentTheme.name}
        disabled
      >
        <Moon className="w-4 h-4 mr-2 inline" />
        {currentTheme.name}
      </button>
    </div>
  );
}

export function SimpleThemeToggle({ className = '' }: ThemeToggleProps) {
  return (
    <button
      className={`
        p-2 rounded-lg transition-all duration-200
        bg-card text-foreground border border-border cursor-default
        ${className}
      `}
      title="Ark Premium Theme"
      aria-label="Theme indicator"
      disabled
    >
      <Moon className="w-5 h-5" />
    </button>
  );
}

export function ThemeSelector({ className = '' }: ThemeToggleProps) {
  const { theme } = useTheme();
  const currentTheme = themeConfigs[theme];

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-lg"
        aria-label="Current theme"
      >
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentTheme.colors.primary }}></div>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentTheme.colors.accent }}></div>
        </div>
        <span className="font-medium text-foreground">{currentTheme.name}</span>
      </div>
    </div>
  );
}