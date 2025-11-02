/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * SaaS Product Constants Configuration
 * This file contains all theme, content, and feature configurations
 * that will later be replaced with server-side API responses
 */

// ============================================================================
// BRAND CONFIGURATION
// ============================================================================

export interface BrandConfig {
  name: string;
  tagline: string;
  description: string;
  logo: {
    light: string; // URL or base64 for light theme
    dark: string;  // URL or base64 for dark theme
    favicon: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  fonts: {
    primary: string;
    secondary: string;
  };
}

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

export interface ThemeConfig {
  id: string;
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
  gradients?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  shadows?: {
    sm: string;
    md: string;
    lg: string;
  };
}

// ============================================================================
// CONTENT CONFIGURATION
// ============================================================================

export interface ContentConfig {
  // Navigation
  navigation: {
    logo: string;
    links: Array<{
      href: string;
      label: string;
      icon?: string;
      badge?: string;
    }>;
    cta: {
      text: string;
      href: string;
    };
  };
  
  // Authentication
  auth: {
    login: {
      title: string;
      subtitle: string;
      mobileLabel: string;
      mobilePlaceholder: string;
      otpLabel: string;
      otpPlaceholder: string;
      sendOtpText: string;
      resendOtpText: string;
      verifyText: string;
      rememberMeText: string;
      countdownText: string;
      errors: {
        invalidMobile: string;
        invalidOtp: string;
        networkError: string;
      };
    };
    register: {
      title: string;
      subtitle: string;
      // Add more registration fields as needed
    };
  };
  
  // Dashboard
  dashboard: {
    title: string;
    welcomeMessage: string;
    stats: Array<{
      label: string;
      value: string;
      change?: string;
      trend?: 'up' | 'down' | 'neutral';
    }>;
  };
  
  // Referrals
  referrals: {
    title: string;
    description: string;
    tableHeaders: string[];
    emptyState: {
      title: string;
      description: string;
      actionText: string;
    };
  };
  
  // Common UI Elements
  ui: {
    buttons: {
      primary: string;
      secondary: string;
      cancel: string;
      save: string;
      delete: string;
      edit: string;
      view: string;
    };
    messages: {
      loading: string;
      success: string;
      error: string;
      noData: string;
      tryAgain: string;
    };
    form: {
      required: string;
      optional: string;
      submit: string;
      cancel: string;
      reset: string;
    };
  };
  
  // Footer
  footer: {
    copyright: string;
    links: Array<{
      label: string;
      href: string;
    }>;
    social: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
  };
}

// ============================================================================
// FEATURE CONFIGURATION
// ============================================================================

export interface FeatureConfig {
  // Authentication Features
  auth: {
    enableOtp: boolean;
    enableRememberMe: boolean;
    enableSocialLogin: boolean;
    enableRegistration: boolean;
    otpLength: number;
    otpExpiryMinutes: number;
  };
  
  // Dashboard Features
  dashboard: {
    enableStats: boolean;
    enableCharts: boolean;
    enableQuickActions: boolean;
    enableNotifications: boolean;
  };
  
  // Referral Features
  referrals: {
    enableReferralLinks: boolean;
    enableCommissionTracking: boolean;
    enablePayouts: boolean;
    enableAnalytics: boolean;
  };
  
  // UI Features
  ui: {
    enableDarkMode: boolean;
    enableAnimations: boolean;
    enableNotifications: boolean;
    enableTooltips: boolean;
  };
  
  // Integration Features
  integrations: {
    enableAnalytics: boolean;
    enableSupport: boolean;
    enableHelp: boolean;
    enableFeedback: boolean;
  };
}

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  name: "SalesHQ Affiliate",
  tagline: "Maximize Your Earnings",
  description: "Partner with us and earn commissions on every successful referral you bring to SalesHQ.",
  logo: {
    light: "/logo-light.svg",
    dark: "/logo-dark.svg",
    favicon: "/favicon.ico",
  },
  colors: {
    primary: "#0891B2",
    secondary: "#67E8F9",
    accent: "#F59E0B",
    background: "#F0FDFF",
    surface: "#ffffff",
    text: {
      primary: "#0C4A6E",
      secondary: "#64748B",
      muted: "#94A3B8",
    },
    status: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
  },
  fonts: {
    primary: "Inter, system-ui, sans-serif",
    secondary: "Inter, system-ui, sans-serif",
  },
};

export const DEFAULT_THEME_CONFIGS: Record<string, ThemeConfig> = {
  ocean: {
    id: "ocean",
    name: "Ocean",
    description: "Shiny teal palette with crystal-clear waters",
    colors: {
      bg: "#F0FDFF",
      text: "#0C4A6E",
      primary: "#0891B2",
      secondary: "#67E8F9",
      accent: "#F59E0B",
      card: "#ffffff",
      border: "#67E8F9",
      muted: "#67E8F9",
      destructive: "#EF4444",
      success: "#10B981",
      warning: "#F59E0B",
    },
    gradients: {
      primary: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
      secondary: "linear-gradient(135deg, #67E8F9 0%, #22D3EE 100%)",
      accent: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    },
    shadows: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    },
  },
  purple: {
    id: "purple",
    name: "Purple",
    description: "Vibrant purple with electric energy",
    colors: {
      bg: "#FAF5FF",
      text: "#581C87",
      primary: "#8B5CF6",
      secondary: "#C4B5FD",
      accent: "#F97316",
      card: "#ffffff",
      border: "#C4B5FD",
      muted: "#C4B5FD",
      destructive: "#EF4444",
      success: "#10B981",
      warning: "#F97316",
    },
    gradients: {
      primary: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
      secondary: "linear-gradient(135deg, #C4B5FD 0%, #A78BFA 100%)",
      accent: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Clean design with emerald accents",
    colors: {
      bg: "#FFFFFF",
      text: "#111827",
      primary: "#059669",
      secondary: "#34D399",
      accent: "#3B82F6",
      card: "#ffffff",
      border: "#34D399",
      muted: "#34D399",
      destructive: "#EF4444",
      success: "#059669",
      warning: "#F59E0B",
    },
  },
  "dark-premium": {
    id: "dark-premium",
    name: "Dark Premium",
    description: "Luxurious dark theme with golden highlights",
    colors: {
      bg: "#0F172A",
      text: "#F8FAFC",
      primary: "#FBBF24",
      secondary: "#06B6D4",
      accent: "#F472B6",
      card: "#1E293B",
      border: "#06B6D4",
      muted: "#06B6D4",
      destructive: "#EF4444",
      success: "#06B6D4",
      warning: "#F472B6",
    },
  },
};

export const DEFAULT_CONTENT_CONFIG: ContentConfig = {
  navigation: {
    logo: "SalesHQ Affiliate",
    links: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: "dashboard",
      },
      {
        href: "/referrals",
        label: "Referrals",
        icon: "referrals",
      },
      {
        href: "/earnings",
        label: "Earnings",
        icon: "earnings",
      },
      {
        href: "/payouts",
        label: "Payouts",
        icon: "payouts",
      },
    ],
    cta: {
      text: "Get Started",
      href: "/register",
    },
  },
  auth: {
    login: {
      title: "Welcome Back",
      subtitle: "Sign in to your affiliate account",
      mobileLabel: "Mobile Number",
      mobilePlaceholder: "Enter your 10-digit mobile number",
      otpLabel: "OTP Code",
      otpPlaceholder: "Enter 6-digit OTP",
      sendOtpText: "Send OTP",
      resendOtpText: "Resend OTP",
      verifyText: "Verify & Login",
      rememberMeText: "Remember me",
      countdownText: "Resend in {seconds}s",
      errors: {
        invalidMobile: "Please enter a valid 10-digit mobile number",
        invalidOtp: "Please enter a valid 6-digit OTP",
        networkError: "Network error. Please try again.",
      },
    },
    register: {
      title: "Join Our Affiliate Program",
      subtitle: "Start earning commissions today",
    },
  },
  dashboard: {
    title: "Dashboard",
    welcomeMessage: "Welcome back! Here's your affiliate overview.",
    stats: [
      {
        label: "Total Referrals",
        value: "0",
        change: "+0%",
        trend: "neutral",
      },
      {
        label: "Active Referrals",
        value: "0",
        change: "+0%",
        trend: "neutral",
      },
      {
        label: "Total Earnings",
        value: "₹0",
        change: "+0%",
        trend: "neutral",
      },
      {
        label: "Pending Payouts",
        value: "₹0",
        change: "+0%",
        trend: "neutral",
      },
    ],
  },
  referrals: {
    title: "Referrals",
    description: "Track and manage your referral links",
    tableHeaders: ["Referral Code", "Status", "Signups", "Conversions", "Earnings", "Actions"],
    emptyState: {
      title: "No referrals yet",
      description: "Start sharing your referral links to earn commissions",
      actionText: "Create Referral Link",
    },
  },
  ui: {
    buttons: {
      primary: "Primary Action",
      secondary: "Secondary Action",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
    },
    messages: {
      loading: "Loading...",
      success: "Operation completed successfully",
      error: "Something went wrong",
      noData: "No data available",
      tryAgain: "Try again",
    },
    form: {
      required: "This field is required",
      optional: "Optional",
      submit: "Submit",
      cancel: "Cancel",
      reset: "Reset",
    },
  },
  footer: {
    copyright: "© 2024 SalesHQ Affiliate. All rights reserved.",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Support", href: "/support" },
      { label: "Contact", href: "/contact" },
    ],
    social: [
      { platform: "Twitter", url: "https://twitter.com/saleshq", icon: "twitter" },
      { platform: "LinkedIn", url: "https://linkedin.com/company/saleshq", icon: "linkedin" },
      { platform: "Facebook", url: "https://facebook.com/saleshq", icon: "facebook" },
    ],
  },
};

export const DEFAULT_FEATURE_CONFIG: FeatureConfig = {
  auth: {
    enableOtp: true,
    enableRememberMe: true,
    enableSocialLogin: false,
    enableRegistration: true,
    otpLength: 6,
    otpExpiryMinutes: 5,
  },
  dashboard: {
    enableStats: true,
    enableCharts: true,
    enableQuickActions: true,
    enableNotifications: true,
  },
  referrals: {
    enableReferralLinks: true,
    enableCommissionTracking: true,
    enablePayouts: true,
    enableAnalytics: true,
  },
  ui: {
    enableDarkMode: true,
    enableAnimations: true,
    enableNotifications: true,
    enableTooltips: true,
  },
  integrations: {
    enableAnalytics: true,
    enableSupport: true,
    enableHelp: true,
    enableFeedback: true,
  },
};

// ============================================================================
// CONFIGURATION MANAGER
// ============================================================================

export interface AppConfig {
  brand: BrandConfig;
  themes: Record<string, ThemeConfig>;
  content: ContentConfig;
  features: FeatureConfig;
  defaultTheme: string;
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  brand: DEFAULT_BRAND_CONFIG,
  themes: DEFAULT_THEME_CONFIGS,
  content: DEFAULT_CONTENT_CONFIG,
  features: DEFAULT_FEATURE_CONFIG,
  defaultTheme: "ocean",
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get current theme configuration
 */
export function getThemeConfig(themeId: string): ThemeConfig {
  return DEFAULT_THEME_CONFIGS[themeId] || DEFAULT_THEME_CONFIGS.ocean;
}

/**
 * Get current brand configuration
 */
export function getBrandConfig(): BrandConfig {
  return DEFAULT_BRAND_CONFIG;
}

/**
 * Get current content configuration
 */
export function getContentConfig(): ContentConfig {
  return DEFAULT_CONTENT_CONFIG;
}

/**
 * Get current feature configuration
 */
export function getFeatureConfig(): FeatureConfig {
  return DEFAULT_FEATURE_CONFIG;
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(featurePath: string): boolean {
  const pathParts = featurePath.split('.');
  let current: any = DEFAULT_FEATURE_CONFIG;
  
  for (const part of pathParts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }
  
  return Boolean(current);
}

/**
 * Get content by path (e.g., 'auth.login.title')
 */
export function getContent(path: string): string {
  const pathParts = path.split('.');
  let current: any = DEFAULT_CONTENT_CONFIG;
  
  for (const part of pathParts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return path; // Return the path if not found
    }
  }
  
  return typeof current === 'string' ? current : path;
}

/**
 * Format content with variables (e.g., 'Resend in {seconds}s' with {seconds: 30})
 */
export function formatContent(template: string, variables: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined ? String(variables[key]) : match;
  });
}