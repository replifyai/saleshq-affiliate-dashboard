'use client';

import { useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard';
import { useProfile } from '@/contexts/ProfileContext';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchProfile, state } = useProfile();
  const hasAttemptedFetchRef = useRef(false); // Track if we've already attempted to fetch

  // Fetch profile when layout mounts (authenticated pages)
  useEffect(() => {
    console.log('Auth Layout - Checking profile fetch conditions:', {
      isAuthenticated: state.isAuthenticated,
      hasToken: !!state.tokens.idToken,
      hasProfile: !!state.profile,
      isLoading: state.isLoading,
      hasAttemptedFetch: hasAttemptedFetchRef.current,
    });

    // Only fetch if authenticated with token but no profile data, and we haven't attempted yet
    if (
      state.isAuthenticated &&
      state.tokens.idToken &&
      !state.profile &&
      !state.isLoading &&
      !hasAttemptedFetchRef.current
    ) {
      console.log('Auth Layout - Fetching profile...');
      hasAttemptedFetchRef.current = true; // Mark as attempted
      fetchProfile().catch((error) => {
        console.error('Auth Layout - Failed to fetch profile:', error);
        hasAttemptedFetchRef.current = false; // Reset on error so we can retry
      });
    }

    // Reset flag if profile becomes available (successful fetch) or becomes null (logout)
    if (state.profile || (!state.isAuthenticated && !state.tokens.idToken)) {
      hasAttemptedFetchRef.current = false;
    }
  }, [state.isAuthenticated, state.tokens.idToken, state.profile, state.isLoading, fetchProfile]);

  return <DashboardLayout>{children}</DashboardLayout>;
}