'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard';
import { useProfile } from '@/contexts/ProfileContext';
import LockOverlay from '@/components/LockOverlay';
import { usePathname } from 'next/navigation';
import { GetCreatorProfileResponse } from '@/types/api';

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
  const totalSteps = (completion?.completedCount || 0) + (completion?.leftCount || 0);
  const completionPercentage = totalSteps > 0 ? Math.round(((completion?.completedCount || 0) / totalSteps) * 100) : 0;
  
  // Pages that should not show the lock overlay
  const pagesThatShouldNotShowLockOverlay = ['/profile', '/dashboard', '/onboarding'];
  const showLockOverlay = Boolean(
    state.isAuthenticated && 
    state.profile && 
    completionPercentage < 100 && 
    pathname && 
    !pagesThatShouldNotShowLockOverlay.includes(pathname)
  );

  return (
    <DashboardLayout>
      <div className="relative">
        <LockOverlay isLocked={showLockOverlay} message="Complete all profile steps to unlock this page." />
        {children}
      </div>
    </DashboardLayout>
  );
}

