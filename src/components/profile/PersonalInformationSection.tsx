'use client';

import React from 'react';
import { AffiliateProfile } from './types';
import { useSnackbar } from '@/components/snackbar';

interface PersonalInformationSectionProps {
  profile: AffiliateProfile;
  isEditing: boolean;
  onUpdateProfile: (field: keyof AffiliateProfile, value: string) => void;
  phoneVerified?: boolean;
  approved?: 'approved' | 'rejected' | 'pending';
}

const PersonalInformationSection: React.FC<PersonalInformationSectionProps> = ({
  profile,
  isEditing,
  onUpdateProfile,
  phoneVerified = false,
  approved = 'pending',
}) => {
  const { showSuccess } = useSnackbar();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile.affiliateCode);
    showSuccess('Affiliate code copied to clipboard!');
  };

  return (
    <div className="bg-gradient-to-br from-[#FFFAE6]/60 to-white rounded-xl border border-[#FFD100]/40 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name <span className="text-destructive">*</span>
          </label>
          {isEditing ? (
            <input
              type="text"
              value={profile.name}
              onChange={(e) => onUpdateProfile('name', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Enter your full name"
              required
            />
          ) : (
            <p className="text-foreground font-medium">{profile.name}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            Email Address
            {profile.email && (
              <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                Provided
              </span>
            )}
          </label>
          {isEditing ? (
            <input
              type="email"
              value={profile.email}
              onChange={(e) => onUpdateProfile('email', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="your.email@example.com"
            />
          ) : (
            <p className="text-foreground">{profile.email || <span className="text-muted-foreground italic">Not provided</span>}</p>
          )}
          {isEditing && !profile.email && (
            <p className="text-xs text-muted-foreground mt-1">💡 Add your email to improve profile completion</p>
          )}
        </div>

        {/* Phone Number - Read Only (verified via OTP) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            Phone Number
            {phoneVerified && (
              <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </label>
          <div className="relative">
            <input
              type="tel"
              value={profile.phone}
              disabled
              className="w-full px-3 py-2 border border-border rounded-md bg-secondary/20 text-foreground cursor-not-allowed"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              🔒 Verified
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Phone number is verified and cannot be changed</p>
        </div>

        {/* Account Status */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Account Status</label>
          <div className="flex items-center gap-2">
            {approved === 'approved' && (
              <span className="px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Approved
              </span>
            )}
            {approved === 'rejected' && (
              <span className="px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Rejected
              </span>
            )}
            {approved === 'pending' && (
              <span className="px-4 py-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg font-medium flex items-center gap-2">
                <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Pending Approval
              </span>
            )}
          </div>
          {approved === 'pending' && (
            <p className="text-xs text-muted-foreground mt-1">Your account is under review. You&apos;ll be notified once approved.</p>
          )}
          {approved === 'rejected' && (
            <p className="text-xs text-muted-foreground mt-1">Your account application was rejected. Please contact support for more information.</p>
          )}
        </div>

        {/* Joining Date */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Member Since</label>
          <p className="text-foreground font-medium">
            {new Date(profile.joiningDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Affiliate Code */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Affiliate Code</label>
          <div className="flex items-center gap-2">
            <code className="px-3 py-2 bg-secondary/30 rounded-md font-mono text-sm font-bold text-primary">
              {profile.affiliateCode}
            </code>
            <button
              onClick={handleCopyCode}
              className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-all hover:scale-105 active:scale-95"
              title="Copy to clipboard"
            >
              📋
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Click to copy your unique affiliate code</p>
        </div>
      </div>

      {/* Additional Information - Coming Soon */}
      {isEditing && (
        <div className="mt-8 p-4 bg-[#FFFAE6]/50 border border-[#FFD100]/30 rounded-lg">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Additional Fields Coming Soon
          </h3>
          <p className="text-xs text-muted-foreground">
            More profile fields like bio, location, date of birth, and preferences will be available in future updates.
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonalInformationSection;