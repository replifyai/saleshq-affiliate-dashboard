/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Configuration Manager
 * This file provides utilities to manage and switch between different configurations
 * for different clients/tenants in your SaaS application
 */

import { AppConfig, DEFAULT_APP_CONFIG } from './constants';

// ============================================================================
// CONFIGURATION STORAGE
// ============================================================================

interface ConfigStorage {
  [tenantId: string]: AppConfig;
}

// In-memory storage for configurations
// In production, this would be replaced with API calls or database storage
const configStorage: ConfigStorage = {
  default: DEFAULT_APP_CONFIG,
  // Add more tenant configurations here
  // tenant1: { ... },
  // tenant2: { ... },
};

// ============================================================================
// CONFIGURATION MANAGER CLASS
// ============================================================================

export class ConfigManager {
  private currentTenantId: string = 'default';
  private config: AppConfig = DEFAULT_APP_CONFIG;

  constructor(tenantId?: string) {
    if (tenantId) {
      this.setTenant(tenantId);
    }
  }

  /**
   * Set the current tenant and load their configuration
   */
  setTenant(tenantId: string): void {
    this.currentTenantId = tenantId;
    this.config = configStorage[tenantId] || DEFAULT_APP_CONFIG;
  }

  /**
   * Get the current tenant ID
   */
  getCurrentTenant(): string {
    return this.currentTenantId;
  }

  /**
   * Get the complete configuration for the current tenant
   */
  getConfig(): AppConfig {
    return this.config;
  }

  /**
   * Get brand configuration for the current tenant
   */
  getBrand(): AppConfig['brand'] {
    return this.config.brand;
  }

  /**
   * Get theme configuration for the current tenant
   */
  getThemes(): AppConfig['themes'] {
    return this.config.themes;
  }

  /**
   * Get content configuration for the current tenant
   */
  getContent(): AppConfig['content'] {
    return this.config.content;
  }

  /**
   * Get feature configuration for the current tenant
   */
  getFeatures(): AppConfig['features'] {
    return this.config.features;
  }

  /**
   * Get a specific theme by ID
   */
  getTheme(themeId: string): AppConfig['themes'][string] | null {
    return this.config.themes[themeId] || null;
  }

  /**
   * Get the default theme for the current tenant
   */
  getDefaultTheme(): string {
    return this.config.defaultTheme;
  }

  /**
   * Check if a feature is enabled for the current tenant
   */
  isFeatureEnabled(featurePath: string): boolean {
    const pathParts = featurePath.split('.');
    let current: any = this.config.features;
    
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
  getContentByPath(path: string): string {
    const pathParts = path.split('.');
    let current: any = this.config.content;
    
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
  formatContent(template: string, variables: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key] !== undefined ? String(variables[key]) : match;
    });
  }

  /**
   * Update configuration for a tenant (useful for admin panels)
   */
  updateTenantConfig(tenantId: string, config: Partial<AppConfig>): void {
    if (!configStorage[tenantId]) {
      configStorage[tenantId] = { ...DEFAULT_APP_CONFIG };
    }
    
    configStorage[tenantId] = {
      ...configStorage[tenantId],
      ...config,
    };

    // If this is the current tenant, update the current config
    if (tenantId === this.currentTenantId) {
      this.config = configStorage[tenantId];
    }
  }

  /**
   * Add a new tenant configuration
   */
  addTenant(tenantId: string, config: AppConfig): void {
    configStorage[tenantId] = config;
  }

  /**
   * Remove a tenant configuration
   */
  removeTenant(tenantId: string): void {
    delete configStorage[tenantId];
  }

  /**
   * List all available tenants
   */
  listTenants(): string[] {
    return Object.keys(configStorage);
  }
}

// ============================================================================
// GLOBAL CONFIGURATION MANAGER INSTANCE
// ============================================================================

// Create a global instance that can be used throughout the application
export const configManager = new ConfigManager();

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get the current brand configuration
 */
export function getCurrentBrand() {
  return configManager.getBrand();
}

/**
 * Get the current content configuration
 */
export function getCurrentContent() {
  return configManager.getContent();
}

/**
 * Get the current feature configuration
 */
export function getCurrentFeatures() {
  return configManager.getFeatures();
}

/**
 * Get the current theme configuration
 */
export function getCurrentThemes() {
  return configManager.getThemes();
}

/**
 * Check if a feature is enabled
 */
export function isCurrentFeatureEnabled(featurePath: string): boolean {
  return configManager.isFeatureEnabled(featurePath);
}

/**
 * Get content by path
 */
export function getCurrentContentByPath(path: string): string {
  return configManager.getContentByPath(path);
}

/**
 * Format content with variables
 */
export function formatCurrentContent(template: string, variables: Record<string, any>): string {
  return configManager.formatContent(template, variables);
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/*
// Example: Switch to a different tenant
configManager.setTenant('client1');

// Example: Get tenant-specific content
const loginTitle = configManager.getContentByPath('auth.login.title');

// Example: Check if a feature is enabled
const isOtpEnabled = configManager.isFeatureEnabled('auth.enableOtp');

// Example: Format content with variables
const countdownText = configManager.formatContent(
  configManager.getContentByPath('auth.login.countdownText'),
  { seconds: 30 }
);

// Example: Update configuration (for admin panels)
configManager.updateTenantConfig('client1', {
  brand: {
    ...configManager.getBrand(),
    name: 'Client1 Affiliate Program',
  },
});
*/