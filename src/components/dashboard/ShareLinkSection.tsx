'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useSnackbar } from '@/components/snackbar';
import { Facebook, Linkedin, MessageCircle, Copy } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import LockOverlay from '@/components/LockOverlay';

interface ShareLinkSectionProps {
  shareUrl?: string;
  referralCode?: string;
  className?: string;
}

const ShareLinkSection: React.FC<ShareLinkSectionProps> = ({
  shareUrl = 'https://myfrido.com',
  referralCode = 'AFF123',
  className,
}) => {
  const { showSuccess } = useSnackbar();
  const { state } = useProfile();

  const completion = state.completionScore;
  const totalSteps = (completion?.completedCount || 0) + (completion?.leftCount || 0);
  const completionPercentage = totalSteps > 0 ? Math.round(((completion?.completedCount || 0) / totalSteps) * 100) : 0;
  const isLocked = completionPercentage < 100;

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    showSuccess(message);
  };

  const socialShares = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600 hover:text-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700 hover:text-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600 hover:text-green-700',
      url: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
    },
  ];

  const handleSocialShare = (url: string) => {
    if (isLocked) return;
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className={cn('relative overflow-hidden rounded-xl space-y-8', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10 rounded-xl blur-xl"></div>
      <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
        <LockOverlay isLocked={isLocked} message="Complete all profile steps to unlock Share & Earn." roundedClassName="rounded-3xl" />
        {/* Header */}
        <div className="flex items-center justify-between space-x-2 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Share & Earn</h2>
            <p className="text-muted-foreground">Spread the word and earn more</p>
          </div>
          {/* Social Media Share Buttons - Compact Row */}
          <div>
            <div className="flex items-center justify-center space-x-3">
              {socialShares.map((social, index) => (
                <button
                  key={social.name}
                  onClick={() => handleSocialShare(social.url)}
                  className={cn(
                    'group bg-gradient-to-br from-yellow-500/20 to-yellow-500/5relative p-3 rounded-lg transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg',
                    'bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30',
                    'flex items-center justify-center',
                    social.color,
                    isLocked ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
                  )}
                  aria-label={`Share on ${social.name}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  disabled={isLocked}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <social.icon className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Referral Code and Link in Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Referral Code */}
          <div className="group">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Referral Code</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 text-foreground font-mono text-xl font-bold hover:border-primary/30 transition-all duration-300">
                  {referralCode}
                </div>
              </div>
              <button
                onClick={() => !isLocked && handleCopy(referralCode, 'Referral code copied!')}
                className={cn(
                  'px-2 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-1 whitespace-nowrap shadow-md hover:shadow-lg hover:-translate-y-0.5 bg-primary-gradient text-white hover:opacity-90',
                  isLocked ? 'opacity-50 cursor-not-allowed hover:-translate-y-0' : ''
                )}
                disabled={isLocked}
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* URL Input with Copy Button */}
          <div className="group">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Referral Link</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 text-foreground font-mono text-xl hover:border-primary/30 transition-all duration-300 truncate">
                  {shareUrl}
                </div>
              </div>
              <button
                onClick={() => !isLocked && handleCopy(shareUrl, 'Referral link copied!')}
                className={cn(
                  'px-2 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-1 whitespace-nowrap shadow-md hover:shadow-lg hover:-translate-y-0.5 bg-primary-gradient text-white hover:opacity-90',
                  isLocked ? 'opacity-50 cursor-not-allowed hover:-translate-y-0' : ''
                )}
                disabled={isLocked}
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