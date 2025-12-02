'use client';

import React from 'react';
import { Clock, ShieldCheck, Sparkles } from 'lucide-react';
import Button from './common/Button';
import { useProfileOperations } from '@/hooks/useProfileOperations';

const PendingApproval: React.FC = () => {
  const { profile, logout } = useProfileOperations();

  const firstName =
    (profile?.name || '')
      .trim()
      .split(' ')
      .filter(Boolean)[0] || 'Creator';

  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center px-4 py-6 sm:py-10">
      <div className="max-w-xl w-full">
        <div className="bg-gradient-to-br from-[#FFFAE6]/80 to-white backdrop-blur-sm border border-[#FFD100]/40 rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-secondary-foreground">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Account pending review</span>
          </div>

          <div className="flex items-start gap-3 sm:gap-4">
            <div className="mt-0.5 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight leading-snug">
                Hey {firstName}, your creator profile is under review.
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Our team is reviewing your details to keep the affiliate program high-quality and spam-free.
                You&apos;ll get full access to your dashboard as soon as your account is approved.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:gap-5 sm:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-2xl bg-[#FFFAE6]/50 border border-[#FFD100]/30 p-3 sm:p-4">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Step 1
                </p>
                <p className="mt-1 text-sm sm:text-base font-medium text-foreground">
                  Profile verification
                </p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  We verify your details and social presence.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl bg-[#FFFAE6]/50 border border-[#FFD100]/30 p-3 sm:p-4">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Step 2
                </p>
                <p className="mt-1 text-sm sm:text-base font-medium text-foreground">
                  Manual review
                </p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Reviews usually take a short while during business hours.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl bg-[#FFFAE6]/50 border border-[#FFD100]/30 p-3 sm:p-4">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Step 3
                </p>
                <p className="mt-1 text-sm sm:text-base font-medium text-foreground">
                  You&apos;re in
                </p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  We&apos;ll notify you as soon as you&apos;re approved and your dashboard unlocks.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs sm:text-sm font-semibold text-foreground">
              While you wait
            </h2>
            <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground list-disc list-inside">
              <li>Keep an eye on your SMS/WhatsApp and email for the approval update.</li>
              <li>Have any questions? Reply to our onboarding email and we&apos;ll be happy to help.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
            <Button
              onClick={handleRefresh}
              size="lg"
              className="flex-1 bg-primary-gradient font-semibold text-sm sm:text-base"
            >
              Check status again
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              size="lg"
              className="flex-1 text-sm sm:text-base"
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;


