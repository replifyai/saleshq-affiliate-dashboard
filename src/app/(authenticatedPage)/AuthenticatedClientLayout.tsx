'use client';

import { useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard';
import { useProfile } from '@/contexts/ProfileContext';
import LockOverlay from '@/components/LockOverlay';
import { usePathname } from 'next/navigation';
import { GetCreatorProfileResponse } from '@/types/api';
import PendingApproval from '@/components/PendingApproval';
import type { ProfileFetchErrorType } from '@/lib/server/profile';

interface AuthenticatedClientLayoutProps {
  children: React.ReactNode;
  initialProfile: GetCreatorProfileResponse | null;
  initialError: string | null;
  initialErrorType: ProfileFetchErrorType;
}

export default function AuthenticatedClientLayout({
  children,
  initialProfile,
  initialError,
  initialErrorType,
}: AuthenticatedClientLayoutProps) {
  const { state, setInitialProfile, setError, logout } = useProfile();
  const pathname = usePathname();
  const handledServerResultRef = useRef(false);

  // Apply the server-side fetch result to client state (only once)
  useEffect(() => {
    if (handledServerResultRef.current) return;

    if (initialProfile && !state.profile) {
      handledServerResultRef.current = true;
      console.log('Client: Setting initial profile from server');
      setInitialProfile(initialProfile.creator, initialProfile.creator.completionScore);
      return;
    }

    if (initialError) {
      handledServerResultRef.current = true;
      if (initialErrorType === 'auth') {
        // Tokens are invalid/expired and could not be refreshed — clear them and
        // send the user back to login. logout() clears cookies before redirecting,
        // so the middleware won't bounce us back to /dashboard.
        console.warn('Client: Auth error from server, logging out:', initialError);
        logout();
      } else {
        // Backend/network failure — surface a retryable error instead of an infinite spinner
        console.error('Client: Profile fetch error from server:', initialError);
        setError(initialError);
      }
    }
  }, [initialProfile, initialError, initialErrorType, state.profile, setInitialProfile, setError, logout]);

  // Shared error fallback: profile failed to load and we have no data to render.
  // Covers all authenticated pages so none of them spin forever.
  if (!state.profile && (state.error || initialError)) {
    // Auth errors redirect via logout(); show nothing while that happens
    if (initialErrorType === 'auth') {
      return null;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0] p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#131313] mb-2">Something went wrong</h2>
          <p className="text-[#777] mb-6">{state.error || initialError}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#131313] text-white rounded-full font-medium hover:bg-[#2a2a2a] transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={logout}
              className="px-6 py-3 border border-[#131313] text-[#131313] rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completion = state.completionScore;
  const isPendingApproval = state.profile?.approved === 'pending';
  const isProfileIncomplete = Boolean(
    state.profile &&
    completion &&
    completion.leftCount > 0
  );

  // Pages that should not show the lock overlay
  const pagesThatShouldNotShowLockOverlay = ['/profile', '/dashboard', '/onboarding'];
  const showLockOverlay = Boolean(
    state.isAuthenticated &&
    isProfileIncomplete &&
    pathname &&
    !pagesThatShouldNotShowLockOverlay.includes(pathname)
  );

  // Pages that should allow access even when pending approval (e.g., onboarding and profile to complete/update details)
  const pagesThatBypassPendingApproval = ['/onboarding', '/profile'];
  const shouldShowPendingApproval = Boolean(
    state.isAuthenticated &&
    isPendingApproval &&
    pathname &&
    !pagesThatBypassPendingApproval.includes(pathname)
  );

  // If creator is pending approval, show a dedicated informative screen and hide other pages
  if (shouldShowPendingApproval) {
    return (
      <DashboardLayout>
        <PendingApproval />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="relative">
        <LockOverlay isLocked={showLockOverlay} message="Complete all profile steps to unlock this page." />
        {children}
      </div>
    </DashboardLayout>
  );
}
