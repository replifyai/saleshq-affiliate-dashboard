'use client';

import React, { useState, useEffect } from 'react';
import { useSnackbar } from '@/components/snackbar';
import { useProfile } from '@/contexts/ProfileContext';
import {
  ProfileHeader,
  PersonalInformationSection,
  SocialMediaSection,
  AccountStatisticsSection,
} from '@/components/profile';
import { AffiliateProfile, SocialMediaHandle } from '@/components/profile/types';
import { SocialMediaHandle as ApiSocialMediaHandle } from '@/types/api';

// Helper function to convert API social media to UI format
const convertApiSocialMediaToUI = (apiHandles?: ApiSocialMediaHandle[] | null): SocialMediaHandle[] => {
  if (!apiHandles || apiHandles.length === 0) return [];

  return apiHandles.map(handle => ({
    platform: handle.platform.charAt(0).toUpperCase() + handle.platform.slice(1), // Capitalize
    handle: handle.handle,
    url: `https://${handle.platform}.com/${handle.handle}`, // Generate URL
    verified: false, // Default to false, can be enhanced later
  }));
};

// Helper function to convert UI social media to API format
const convertUISocialMediaToAPI = (uiHandles: SocialMediaHandle[]): ApiSocialMediaHandle[] => {
  return uiHandles
    .filter(handle => handle.platform && handle.handle) // Filter out empty entries
    .map(handle => ({
      platform: handle.platform.toLowerCase() as ApiSocialMediaHandle['platform'],
      handle: handle.handle,
    }));
};

export default function ProfilePage() {
  const { showSuccess, showError } = useSnackbar();
  const { state, updateProfile } = useProfile();

  const [profile, setProfile] = useState<AffiliateProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load profile data from context
  useEffect(() => {
    if (state.profile) {
      const creatorProfile = state.profile;

      setProfile({
        id: creatorProfile.id,
        name: creatorProfile.name,
        email: creatorProfile.email || '',
        phone: creatorProfile.phoneNumber,
        country: '', // Not in API, will add later
        city: '', // Not in API, will add later
        bio: '', // Not in API, will add later
        dateOfBirth: '', // Not in API, will add later
        joiningDate: new Date(creatorProfile.createdAt).toISOString().split('T')[0],
        socialMedia: convertApiSocialMediaToUI(creatorProfile.socialMediaHandles),
        commissionRate: 15, // Default value, will come from backend later
        totalEarnings: 0, // Will come from backend later
        affiliateCode: `CREATOR${creatorProfile.id.slice(0, 6).toUpperCase()}`, // Generated
      });
    }
  }, [state.profile]);

  // Note: Profile fetching is handled by the layout component,
  // so we don't need to fetch it here to avoid duplicate API calls

  const handleSave = async () => {
    if (!profile || !state.profile) {
      showError('Profile data not available');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare update data
      const updateData: {
        name?: string;
        email?: string | null;
        socialMediaHandles?: ApiSocialMediaHandle[];
      } = {};

      // Only include changed fields
      if (profile.name !== state.profile.name) {
        updateData.name = profile.name;
      }

      if (profile.email !== (state.profile.email || '')) {
        updateData.email = profile.email || null;
      }

      // Convert and update social media handles
      const apiSocialMedia = convertUISocialMediaToAPI(profile.socialMedia);
      updateData.socialMediaHandles = apiSocialMedia;

      // Call the updateProfile API
      await updateProfile(updateData);

      setIsEditing(false);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showError(error instanceof Error ? error.message : 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restore original values from context
    if (state.profile) {
      const creatorProfile = state.profile;
      setProfile({
        id: creatorProfile.id,
        name: creatorProfile.name,
        email: creatorProfile.email || '',
        phone: creatorProfile.phoneNumber,
        country: '',
        city: '',
        bio: '',
        dateOfBirth: '',
        joiningDate: new Date(creatorProfile.createdAt).toISOString().split('T')[0],
        socialMedia: convertApiSocialMediaToUI(creatorProfile.socialMediaHandles),
        commissionRate: 15,
        totalEarnings: 0,
        affiliateCode: `CREATOR${creatorProfile.id.slice(0, 6).toUpperCase()}`,
      });
    }
  };

  const handleUpdateProfile = (field: keyof AffiliateProfile, value: string) => {
    setProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const addSocialMediaHandle = () => {
    const newSocial: SocialMediaHandle = {
      platform: '',
      handle: '',
      url: '',
      verified: false,
    };
    setProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        socialMedia: [...prev.socialMedia, newSocial],
      };
    });
  };

  const removeSocialMediaHandle = (index: number) => {
    setProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        socialMedia: prev.socialMedia.filter((_, i) => i !== index),
      };
    });
  };

  const updateSocialMediaHandle = (index: number, field: keyof SocialMediaHandle, value: string | boolean) => {
    setProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        socialMedia: prev.socialMedia.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      };
    });
  };

  // Show loading state while fetching profile
  if (state.isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if profile failed to load
  if (state.error && !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-destructive mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Profile</h2>
          <p className="text-muted-foreground mb-4">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
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
          phoneVerified={state.profile?.phoneNumberVerified || false}
          approved={state.profile?.approved || 'pending'}
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