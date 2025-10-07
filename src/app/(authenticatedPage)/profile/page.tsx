'use client';

import React, { useState } from 'react';
import { useSnackbar } from '@/components/snackbar';
import {
  ProfileHeader,
  PersonalInformationSection,
  SocialMediaSection,
  AccountStatisticsSection,
} from '@/components/profile';
import { AffiliateProfile, SocialMediaHandle } from '@/components/profile/types';

interface ProfilePageProps {
  onMenuClick?: () => void;
}

export default function ProfilePage({ onMenuClick }: ProfilePageProps) {
  const { showSuccess, showError } = useSnackbar();
  
  // Mock data - replace with actual data fetching
  const [profile, setProfile] = useState<AffiliateProfile>({
    id: '1',
    name: 'Robert Grant',
    email: 'robert.grant@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    city: 'New York',
    bio: 'Passionate about helping businesses grow through strategic partnerships and marketing.',
    dateOfBirth: '1990-05-15',
    joiningDate: '2024-01-15',
    socialMedia: [
      { platform: 'Twitter', handle: '@robertgrant', url: 'https://twitter.com/robertgrant', verified: true },
      { platform: 'LinkedIn', handle: '@robert-grant', url: 'https://linkedin.com/in/robert-grant', verified: true },
      { platform: 'Instagram', handle: '@robert.grant', url: 'https://instagram.com/robert.grant', verified: false },
    ],
    commissionRate: 15,
    totalEarnings: 12500,
    affiliateCode: 'ROBERT15',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      showError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data here - would restore original values from API
  };

  const handleUpdateProfile = (field: keyof AffiliateProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSocialMediaHandle = () => {
    const newSocial: SocialMediaHandle = {
      platform: '',
      handle: '',
      url: '',
      verified: false,
    };
    setProfile(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, newSocial],
    }));
  };

  const removeSocialMediaHandle = (index: number) => {
    setProfile(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index),
    }));
  };

  const updateSocialMediaHandle = (index: number, field: keyof SocialMediaHandle, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Mobile Menu Button - Only visible on mobile */}
        {onMenuClick && (
          <div className="lg:hidden">
            <button
              onClick={onMenuClick}
              className="mb-4 p-3 rounded-lg bg-card border border-border hover:bg-secondary/20 transition-all duration-300 shadow-sm"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}

        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          isEditing={isEditing}
          isLoading={isLoading}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        {/* Personal Information */}
        <PersonalInformationSection
          profile={profile}
          isEditing={isEditing}
          onUpdateProfile={handleUpdateProfile}
        />

        {/* Social Media Handles */}
        <SocialMediaSection
          socialMedia={profile.socialMedia}
          isEditing={isEditing}
          onAddHandle={addSocialMediaHandle}
          onUpdateHandle={updateSocialMediaHandle}
          onRemoveHandle={removeSocialMediaHandle}
        />

        {/* Account Statistics */}
        <AccountStatisticsSection
          totalEarnings={profile.totalEarnings}
          commissionRate={profile.commissionRate}
          joiningDate={profile.joiningDate}
        />
      </div>
    </div>
  );
}