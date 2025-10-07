'use client';

import React from 'react';
import { AffiliateProfile } from './types';

interface PersonalInformationSectionProps {
  profile: AffiliateProfile;
  isEditing: boolean;
  onUpdateProfile: (field: keyof AffiliateProfile, value: string) => void;
}

const PersonalInformationSection: React.FC<PersonalInformationSectionProps> = ({
  profile,
  isEditing,
  onUpdateProfile,
}) => {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              value={profile.name}
              onChange={(e) => onUpdateProfile('name', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          ) : (
            <p className="text-foreground">{profile.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
          {isEditing ? (
            <input
              type="email"
              value={profile.email}
              onChange={(e) => onUpdateProfile('email', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          ) : (
            <p className="text-foreground">{profile.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => onUpdateProfile('phone', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          ) : (
            <p className="text-foreground">{profile.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
          {isEditing ? (
            <input
              type="date"
              value={profile.dateOfBirth}
              onChange={(e) => onUpdateProfile('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          ) : (
            <p className="text-foreground">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Country</label>
          {isEditing ? (
            <select
              value={profile.country}
              onChange={(e) => onUpdateProfile('country', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="India">India</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <p className="text-foreground">{profile.country}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">City</label>
          {isEditing ? (
            <input
              type="text"
              value={profile.city}
              onChange={(e) => onUpdateProfile('city', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          ) : (
            <p className="text-foreground">{profile.city}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
          {isEditing ? (
            <textarea
              value={profile.bio}
              onChange={(e) => onUpdateProfile('bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-vertical"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-foreground">{profile.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationSection;