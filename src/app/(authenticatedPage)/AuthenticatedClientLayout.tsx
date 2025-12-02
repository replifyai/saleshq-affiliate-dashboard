'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard';
import { useProfile } from '@/contexts/ProfileContext';
import LockOverlay from '@/components/LockOverlay';
import { usePathname } from 'next/navigation';
import { GetCreatorProfileResponse } from '@/types/api';
import PendingApproval from '@/components/PendingApproval';

interface AuthenticatedClientLayoutProps {
  children: React.ReactNode;
  initialProfile: GetCreatorProfileResponse | null;
  initialTokens: { idToken: string; refreshToken: string } | null;
}

export default function AuthenticatedClientLayout({
  children,
  initialProfile,
  initialTokens,
}: AuthenticatedClientLayoutProps) {
  const { state, setInitialProfile } = useProfile();
  const pathname = usePathname();

  // Set initial profile data from server-side fetch (only once)
  useEffect(() => {
    if (initialProfile && initialTokens && !state.profile) {
      console.log('Client: Setting initial profile from server');
      setInitialProfile(initialProfile.creator, initialTokens, initialProfile.creator.completionScore);
    }
  }, [initialProfile, initialTokens, state.profile, setInitialProfile]);

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

  // Pages that should allow access even when pending approval (e.g., onboarding to complete profile)
  const pagesThatBypassPendingApproval = ['/onboarding'];
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

