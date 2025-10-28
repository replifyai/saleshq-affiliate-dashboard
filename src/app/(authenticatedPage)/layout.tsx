'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard';
import { useProfile } from '@/contexts/ProfileContext';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchProfile, state } = useProfile();

  // Fetch profile when layout mounts (authenticated pages)
  useEffect(() => {
    // Only fetch if authenticated with token but no profile data
    if (state.isAuthenticated && state.tokens.idToken && !state.profile) {
      fetchProfile().catch((error) => {
        console.error('Failed to fetch profile:', error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isAuthenticated, state.tokens.idToken, state.profile]);

  return <DashboardLayout>{children}</DashboardLayout>;
}