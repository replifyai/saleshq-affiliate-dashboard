/**
 * Cookie utility functions for managing authentication tokens
 */

const COOKIE_OPTIONS = {
  // Store for 7 days
  maxAge: 60 * 60 * 24 * 7,
  // Send cookies only over HTTPS in production
  secure: process.env.NODE_ENV === 'production',
  // Prevent XSS attacks
  sameSite: 'strict' as const,
  // Accessible to JavaScript (needed for client-side access)
  httpOnly: false,
  // Available to all paths
  path: '/',
};

/**
 * Set a cookie with the specified name and value
 */
export function setCookie(name: string, value: string, options?: Partial<typeof COOKIE_OPTIONS>) {
  const mergedOptions = { ...COOKIE_OPTIONS, ...options };
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + mergedOptions.maxAge * 1000);

  const cookieString = [
    `${name}=${encodeURIComponent(value)}`,
    `expires=${expirationDate.toUTCString()}`,
    `path=${mergedOptions.path}`,
    `SameSite=${mergedOptions.sameSite}`,
    mergedOptions.secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }

  return null;
}

/**
 * Delete a cookie by setting it to expire in the past
 * Must include same attributes that were used to set the cookie
 */
export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  
  // Delete cookie with all possible attribute combinations to ensure it's removed
  // Include SameSite and Secure attributes to match how cookies were set
  const cookieString = [
    `${name}=`,
    `expires=Thu, 01 Jan 1970 00:00:00 UTC`,
    `path=${COOKIE_OPTIONS.path}`,
    `SameSite=${COOKIE_OPTIONS.sameSite}`,
    COOKIE_OPTIONS.secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');

  document.cookie = cookieString;
  
  // Also try without Secure in case it was set in development
  if (COOKIE_OPTIONS.secure) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${COOKIE_OPTIONS.path}; SameSite=${COOKIE_OPTIONS.sameSite}`;
  }
}

/**
 * Token management functions
 */
export const tokenCookies = {
  /**
   * Store ID token in cookie
   */
  setIdToken: (token: string) => {
    setCookie('idToken', token);
  },

  /**
   * Get ID token from cookie
   */
  getIdToken: (): string | null => {
    return getCookie('idToken');
  },

  /**
   * Store refresh token in cookie
   */
  setRefreshToken: (token: string) => {
    setCookie('refreshToken', token);
  },

  /**
   * Get refresh token from cookie
   */
  getRefreshToken: (): string | null => {
    return getCookie('refreshToken');
  },

  /**
   * Store both tokens
   */
  setTokens: (idToken: string, refreshToken: string) => {
    setIdToken(idToken);
    setRefreshToken(refreshToken);
  },

  /**
   * Get both tokens
   */
  getTokens: () => {
    return {
      idToken: getIdToken(),
      refreshToken: getRefreshToken(),
    };
  },

  /**
   * Clear all tokens
   */
  clearTokens: () => {
    deleteCookie('idToken');
    deleteCookie('refreshToken');
  },
};

// Export for convenience
export const setIdToken = tokenCookies.setIdToken;
export const getIdToken = tokenCookies.getIdToken;
export const setRefreshToken = tokenCookies.setRefreshToken;
export const getRefreshToken = tokenCookies.getRefreshToken;
export const setTokens = tokenCookies.setTokens;
export const getTokens = tokenCookies.getTokens;
export const clearTokens = tokenCookies.clearTokens;
