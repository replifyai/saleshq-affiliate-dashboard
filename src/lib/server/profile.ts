import { cookies } from 'next/headers';
import { GetCreatorProfileResponse } from '@/types/api';

const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL || 'https://asia-south1-touch-17fa9.cloudfunctions.net/dashboardApi';

interface TokenRefreshResponse {
  idToken: string;
  refreshToken: string;
}

export type ProfileFetchErrorType = 'auth' | 'server' | null;

export interface ProfileFetchResult {
  profile: GetCreatorProfileResponse | null;
  tokens: { idToken: string; refreshToken: string } | null;
  error: string | null;
  errorType: ProfileFetchErrorType;
}

/**
 * Safely extract an error message from a response.
 * Backend may return non-JSON bodies (e.g. HTML error pages), so guard the parse.
 */
async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json();
    return data.message || data.error || `${fallback} (status ${response.status})`;
  } catch {
    return `${fallback} (status ${response.status})`;
  }
}

/**
 * Server-side function to refresh ID token using refresh token
 */
async function refreshIdToken(refreshToken: string): Promise<TokenRefreshResponse | null> {
  try {
    const response = await fetch(`${FIREBASE_FUNCTION_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({}),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Token refresh failed:', response.status);
      return null;
    }

    const data = await response.json();
    if (!data?.idToken) {
      console.error('Token refresh returned no idToken');
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

/**
 * Server-side function to fetch creator profile with automatic token refresh
 * This runs on the server before rendering, ensuring profile data is available
 *
 * errorType semantics:
 * - 'auth':   tokens are invalid/expired and could not be refreshed — client should log out
 * - 'server': backend/network failure — client should show retryable error UI
 */
export async function fetchCreatorProfileServer(): Promise<ProfileFetchResult> {
  try {
    const cookieStore = await cookies();
    let idToken = cookieStore.get('idToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // No tokens available — middleware should have redirected; treat as auth error
    if (!idToken && !refreshToken) {
      return { profile: null, tokens: null, error: 'Not authenticated', errorType: 'auth' };
    }

    // If only refresh token available, try to refresh
    if (!idToken && refreshToken) {
      console.log('Server: No ID token, attempting refresh...');
      const refreshResult = await refreshIdToken(refreshToken);
      if (refreshResult) {
        idToken = refreshResult.idToken;
        // Note: Cookies will be set on client side via the returned tokens
      } else {
        return { profile: null, tokens: null, error: 'Token refresh failed', errorType: 'auth' };
      }
    }

    if (!idToken) {
      return { profile: null, tokens: null, error: 'No valid token', errorType: 'auth' };
    }

    // Fetch profile with ID token
    console.log('Server: Fetching profile...');
    const response = await fetch(`${FIREBASE_FUNCTION_URL}/getCreatorProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: '',
      cache: 'no-store', // Don't cache to always get fresh data
    });

    // If unauthorized, try refreshing token once
    if (response.status === 401 || response.status === 403) {
      if (refreshToken) {
        console.log('Server: Unauthorized, attempting token refresh...');
        const refreshResult = await refreshIdToken(refreshToken);
        if (refreshResult) {
          idToken = refreshResult.idToken;
          // Note: Cookies will be set on client side via the returned tokens

          // Retry fetch with new token
          const retryResponse = await fetch(`${FIREBASE_FUNCTION_URL}/getCreatorProfile`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
            body: '',
            cache: 'no-store',
          });

          if (!retryResponse.ok) {
            // Refreshed token still rejected → auth problem; anything else → server problem
            const isAuthFailure = retryResponse.status === 401 || retryResponse.status === 403;
            const message = await parseErrorMessage(retryResponse, 'Failed to fetch profile after refresh');
            return {
              profile: null,
              tokens: null,
              error: message,
              errorType: isAuthFailure ? 'auth' : 'server',
            };
          }

          const profileData = await retryResponse.json();
          return {
            profile: profileData,
            tokens: { idToken, refreshToken: refreshResult.refreshToken },
            error: null,
            errorType: null,
          };
        }
      }
      return { profile: null, tokens: null, error: 'Authentication failed', errorType: 'auth' };
    }

    if (!response.ok) {
      const message = await parseErrorMessage(response, 'Failed to fetch profile');
      console.error(`Server: getCreatorProfile failed with status ${response.status}: ${message}`);
      return { profile: null, tokens: null, error: message, errorType: 'server' };
    }

    const profileData = await response.json();
    if (!profileData?.creator) {
      console.error('Server: getCreatorProfile returned unexpected payload', profileData);
      return { profile: null, tokens: null, error: 'Profile data is invalid', errorType: 'server' };
    }

    return {
      profile: profileData,
      tokens: { idToken, refreshToken: refreshToken || '' },
      error: null,
      errorType: null,
    };
  } catch (error) {
    console.error('Server: Error fetching profile:', error);
    return {
      profile: null,
      tokens: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: 'server',
    };
  }
}
