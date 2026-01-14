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
    <>
      {/* Mobile version - just action buttons */}
      <div className="lg:hidden flex justify-end gap-2 mb-4">
        {!isEditing ? (
          <Button
            onClick={onEdit}
            className="flex items-center bg-[#131313] text-white hover:bg-[#2a2a2a] hover:text-white border-none text-sm"
          >
            <span>Edit Profile</span>
          </Button>
        ) : (
          <>
            <Button
              onClick={onCancel}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={isLoading}
              className="flex items-center space-x-2 text-sm"
            >
              <span>{isLoading ? '⏳' : '💾'}</span>
              <span>{isLoading ? 'Saving...' : 'Save'}</span>
            </Button>
          </>
        )}
      </div>

      {/* Desktop version - full header with avatar */}
      <div className="hidden lg:block bg-white border border-[#E5E5E5] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#F0F0F0] flex items-center justify-center text-[#131313] text-xl sm:text-2xl font-bold border border-[#E5E5E5]">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-[#131313]">{profile.name}</h1>
              <p className="text-sm sm:text-base text-[#636363]">{profile.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:space-x-3">
            {!isEditing ? (
              <Button
                onClick={onEdit}
                className="flex items-center bg-[#131313] text-white hover:bg-[#2a2a2a] hover:text-white border-none text-sm rounded-full px-6"
              >
                <span>Edit Profile</span>
              </Button>
            ) : (
              <>
                <Button
                  onClick={onCancel}
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onSave}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-[#131313] text-white hover:bg-[#2a2a2a] rounded-full"
                >
                  <span>{isLoading ? '⏳' : '💾'}</span>
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;