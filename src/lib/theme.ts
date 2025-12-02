export type Theme = 'light';

export interface ThemeConfig {
  name: string;
  description: string;
  colors: {
    bg: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
    card: string;
    border: string;
    muted: string;
    destructive: string;
    success: string;
    warning: string;
  };
}

export const themeConfigs: Record<Theme, ThemeConfig> = {
  'light': {
    name: 'SalesHQ Light',
    description: 'Clean light theme with golden yellow highlights',
    colors: {
      bg: '#FFFFFF',
      text: 'rgba(35, 31, 32, 1)',
      primary: '#ffda34',
      secondary: '#FFFAE6',
      accent: '#FFD100',
      card: '#FFFFFF',
      border: 'rgba(255, 209, 0, 0.5)',
      muted: 'rgba(35, 31, 32, 0.50)',
      destructive: '#EF4444',
      success: '#10B981',
      warning: '#ffda34',
    },
  },
};

export const defaultTheme: Theme = 'light';

export function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return defaultTheme;
  
  const stored = localStorage.getItem('theme') as Theme;
  return stored && stored === 'light' ? stored : defaultTheme;
}

export function storeTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
}