'use client';

import React from 'react';
import { Check, Clock, RefreshCw, User, Mail, Phone, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from './common/Button';
import { useProfileOperations } from '@/hooks/useProfileOperations';

const PendingApproval: React.FC = () => {
  const { profile, logout } = useProfileOperations();
  const router = useRouter();

  const firstName =
    (profile?.name || '').trim().split(' ').filter(Boolean)[0] || 'Creator';

  const handleRefresh = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  // Slim 3-stage timeline: submitted (done) → review (active) → approved (pending)
  const stages = [
    { label: 'Details submitted', state: 'done' as const },
    { label: 'Under review', state: 'active' as const },
    { label: 'Approved', state: 'pending' as const },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F0F0F0] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-lg animate-scale-in">
        <div className="bg-white border border-[#E5E5E5] rounded-3xl shadow-sm overflow-hidden">
          {/* Hero */}
          <div className="bg-gradient-to-br from-[#FFFAE6]/80 to-white border-b border-[#FFD100]/30 p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#FFD100]/40 px-3 py-1 text-xs font-medium text-foreground">
              <span className="h-2 w-2 rounded-full bg-[#FFD100] animate-pulse" />
              Account pending review
            </div>
            <h1 className="mt-4 text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              Hey {firstName}, you&apos;re almost in.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Our team is reviewing your profile to keep the program high-quality.
              Your dashboard unlocks as soon as you&apos;re approved — we&apos;ll notify you over SMS, WhatsApp and email.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-7">
            {/* Timeline */}
            <ol className="flex items-center">
              {stages.map((stage, i) => (
                <React.Fragment key={stage.label}>
                  <li className="flex flex-col items-center gap-2 text-center">
                    <span
                      className={[
                        'flex h-9 w-9 items-center justify-center rounded-full border transition-colors',
                        stage.state === 'done'
                          ? 'bg-[#131313] border-[#131313] text-white'
                          : stage.state === 'active'
                            ? 'bg-[#FFE887] border-[#FFD100] text-[#131313]'
                            : 'bg-white border-[#E5E5E5] text-muted-foreground',
                      ].join(' ')}
                    >
                      {stage.state === 'done' ? (
                        <Check className="h-4 w-4" />
                      ) : stage.state === 'active' ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-semibold">{i + 1}</span>
                      )}
                    </span>
                    <span className={`text-xs font-medium max-w-[5.5rem] ${stage.state === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {stage.label}
                    </span>
                  </li>
                  {i < stages.length - 1 && (
                    <span className={`flex-1 h-0.5 mb-6 mx-1 rounded-full ${stages[i + 1].state === 'pending' ? 'bg-[#E5E5E5]' : 'bg-[#FFD100]'}`} />
                  )}
                </React.Fragment>
              ))}
            </ol>

            {/* Compact profile summary */}
            <div className="rounded-2xl border border-[#E5E5E5] divide-y divide-[#E5E5E5]">
              <SummaryRow icon={<User className="h-4 w-4" />} label="Name" value={profile?.name} />
              <SummaryRow icon={<Mail className="h-4 w-4" />} label="Email" value={profile?.email} />
              <SummaryRow
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={profile?.phoneNumber}
                badge={profile?.phoneNumberVerified ? 'Verified' : undefined}
              />
              <SummaryRow
                icon={<Globe className="h-4 w-4" />}
                label="Socials"
                value={
                  profile?.socialMediaHandles && profile.socialMediaHandles.length > 0
                    ? profile.socialMediaHandles.map(h => h.platform).join(', ')
                    : undefined
                }
              />
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <Button onClick={() => router.push('/profile')} size="lg" className="flex-1">
                  Update profile
                </Button>
                <Button onClick={handleRefresh} variant="outline" size="lg" className="flex-1 gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Check status
                </Button>
              </div>
              <button
                onClick={logout}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  badge?: string;
}> = ({ icon, label, value, badge }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFFAE6] text-[#131313] shrink-0">
      {icon}
    </span>
    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground w-16 shrink-0">
      {label}
    </span>
    <span className={`flex-1 min-w-0 text-sm truncate ${value ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
      {value || 'Not provided'}
    </span>
    {badge && (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
        {badge}
      </span>
    )}
  </div>
);

export default PendingApproval;
