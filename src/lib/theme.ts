export type Theme = 'dark-premium';

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
  'dark-premium': {
    name: 'Ark Premium',
    description: 'Premium dark theme with golden highlights',
    colors: {
      bg: '#000000',
      text: '#FFFFFF',
      primary: '#edc200',
      secondary: '#000000',
      accent: '#ffefca',
      card: '#111111',
      border: 'rgba(255,255,255,0.06)',
      muted: 'rgba(255,255,255,0.60)',
      destructive: '#EF4444',
      success: '#10B981',
      warning: '#edc200',
    },
  },
};

export const defaultTheme: Theme = 'dark-premium';

export function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return defaultTheme;
  
  const stored = localStorage.getItem('theme') as Theme;
  return stored && stored === 'dark-premium' ? stored : defaultTheme;
}

export function storeTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
}