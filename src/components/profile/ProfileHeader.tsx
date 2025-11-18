'use client';

import React from 'react';
import { Button } from '@/components/common';
import { AffiliateProfile } from './types';

interface ProfileHeaderProps {
  profile: AffiliateProfile;
  isEditing: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isEditing,
  isLoading,
  onEdit,
  onSave,
  onCancel,
}) => {
  return (
    <div className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black text-xl sm:text-2xl font-bold">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-foreground">{profile.name}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">{profile.email}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:space-x-3">
          {!isEditing ? (
            <Button
              onClick={onEdit}
              variant="outline"
              className="flex items-center bg-primary text-black hover:opacity-90 text-sm"
            >
              <span className='text-black'>Edit Profile</span>
            </Button>
          ) : (
            <>
              <Button
                onClick={onCancel}
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={onSave}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <span>{isLoading ? '⏳' : '💾'}</span>
                <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;