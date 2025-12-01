'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useSnackbar } from '@/components/snackbar';
import { Copy } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import LockOverlay from '@/components/LockOverlay';

interface ShareLinkSectionProps {
  shareUrl?: string;
  referralCode?: string;
  className?: string;
}

const ShareLinkSection: React.FC<ShareLinkSectionProps> = ({
  shareUrl: propShareUrl,
  referralCode: propReferralCode,
  className,
}) => {
  const { showSuccess } = useSnackbar();
  const { state } = useProfile();

  // Determine approval & referral-code state
  const approvedStatus = state.profile?.approved;
  const isPendingApproval = approvedStatus !== 'approved';

  const hasReferralCode = !!(state.profile?.uniqueReferralCode || propReferralCode);

  // Display value for referral code (what user sees in UI)
  const referralCodeDisplay = hasReferralCode
    ? state.profile?.uniqueReferralCode || (propReferralCode as string)
    : isPendingApproval
    ? 'Pending approval'
    : 'Loading...';

  // Actual share URL (only valid when we have a real referral code)
  const shareUrl = hasReferralCode
    ? propShareUrl || `https://myfrido.com?ref=${state.profile?.uniqueReferralCode || propReferralCode}`
    : '';

  // What we show in the referral link field
  const shareUrlDisplay = hasReferralCode
    ? shareUrl
    : isPendingApproval
    ? 'Your referral link will be available once your profile is approved.'
    : 'Loading...';

  const completion = state.completionScore;
  const totalSteps = (completion?.completedCount || 0) + (completion?.leftCount || 0);
  const completionPercentage = totalSteps > 0 ? Math.round(((completion?.completedCount || 0) / totalSteps) * 100) : 0;
  const hasCompletedProfile = completionPercentage === 100;

  // Lock when profile setup not complete OR approval is still pending
  const isLocked = !hasCompletedProfile || isPendingApproval;

  const lockMessage = isPendingApproval
    ? 'Your profile is under review. Once it is approved, your referral code and sharing options will be unlocked.'
    : 'Complete all profile steps to unlock Share & Earn.';

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    showSuccess(message);
  };

  return (
    <div className={cn('relative overflow-hidden rounded-xl space-y-5 sm:space-y-8', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10 rounded-xl blur-xl"></div>
      <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-border/50">
        <LockOverlay isLocked={isLocked} message={lockMessage} roundedClassName="rounded-3xl" />
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 mb-3 sm:mb-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Share & Earn</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Spread the word and earn more</p>
          </div>
        </div>

        {/* Referral Code and Link in Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Referral Code */}
          <div className="group">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Referral Code</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative min-w-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 text-foreground font-mono text-base sm:text-xl font-bold hover:border-primary/30 transition-all duration-300">
                  {referralCodeDisplay}
                </div>
              </div>
              <button
                onClick={() => !isLocked && hasReferralCode && handleCopy(referralCodeDisplay, 'Referral code copied!')}
                className={cn(
                  'px-2 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center space-x-1 whitespace-nowrap shadow-md hover:shadow-lg hover:-translate-y-0.5 bg-primary-gradient text-white hover:opacity-90',
                  isLocked || !hasReferralCode ? 'opacity-50 cursor-not-allowed hover:-translate-y-0' : ''
                )}
                disabled={isLocked || !hasReferralCode}
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* URL Input with Copy Button */}
          <div className="group">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Referral Link</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative min-w-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 text-foreground font-mono text-sm sm:text-base md:text-xl hover:border-primary/30 transition-all duration-300 truncate">
                  {shareUrlDisplay}
                </div>
              </div>
              <button
                onClick={() => !isLocked && hasReferralCode && handleCopy(shareUrl, 'Referral link copied!')}
                className={cn(
                  'px-2 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center space-x-1 whitespace-nowrap shadow-md hover:shadow-lg hover:-translate-y-0.5 bg-primary-gradient text-white hover:opacity-90',
                  isLocked || !hasReferralCode ? 'opacity-50 cursor-not-allowed hover:-translate-y-0' : ''
                )}
                disabled={isLocked || !hasReferralCode}
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareLinkSection;