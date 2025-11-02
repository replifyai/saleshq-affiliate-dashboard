import { cookies } from 'next/headers';
import { GetCreatorProfileResponse } from '@/types/api';

const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL || 'https://dashboardapi-dkhjjaxofq-el.a.run.app';

interface TokenRefreshResponse {
  idToken: string;
  refreshToken: string;
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
    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

/**
 * Server-side function to fetch creator profile with automatic token refresh
 * This runs on the server before rendering, ensuring profile data is available
 */
export async function fetchCreatorProfileServer(): Promise<{
  profile: GetCreatorProfileResponse | null;
  tokens: { idToken: string; refreshToken: string } | null;
  error: string | null;
}> {
  try {
    const cookieStore = await cookies();
    let idToken = cookieStore.get('idToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // No tokens available
    if (!idToken && !refreshToken) {
      return { profile: null, tokens: null, error: null };
    }

    // If only refresh token available, try to refresh
    if (!idToken && refreshToken) {
      console.log('Server: No ID token, attempting refresh...');
      const refreshResult = await refreshIdToken(refreshToken);
      if (refreshResult) {
        idToken = refreshResult.idToken;
        // Note: Cookies will be set on client side via the returned tokens
      } else {
        return { profile: null, tokens: null, error: 'Token refresh failed' };
      }
    }

    if (!idToken) {
      return { profile: null, tokens: null, error: 'No valid token' };
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
            const errorData = await retryResponse.json();
            return { profile: null, tokens: null, error: errorData.message || 'Failed to fetch profile after refresh' };
          }

          const profileData = await retryResponse.json();
          return {
            profile: profileData,
            tokens: { idToken, refreshToken: refreshResult.refreshToken },
            error: null,
          };
        }
      }
      return { profile: null, tokens: null, error: 'Authentication failed' };
    }

    if (!response.ok) {
      const errorData = await response.json();
      return { profile: null, tokens: null, error: errorData.message || 'Failed to fetch profile' };
    }

    const profileData = await response.json();
    return {
      profile: profileData,
      tokens: { idToken, refreshToken: refreshToken || '' },
      error: null,
    };
  } catch (error) {
    console.error('Server: Error fetching profile:', error);
    return {
      profile: null,
      tokens: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

