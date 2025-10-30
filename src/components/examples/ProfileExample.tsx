'use client';

import React, { useState } from 'react';
import { useProfileOperations } from '@/hooks/useProfileOperations';
import { SocialMediaHandle } from '@/types/api';

// Example component demonstrating creator profile operations
export function ProfileExample() {
  const {
    profile,
    isAuthenticated,
    isLoading,
    error,
    completionScore,
    createProfile,
    sendOtp,
    verifyOtp,
    updateProfile,
    logout,
    clearError,
    getCompletionPercentage,
    getRemainingTasks,
    getCompletedTasks,
    isProfileComplete,
    needsOnboarding,
  } = useProfileOperations();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [uid, setUid] = useState('');

  const handleCreateProfile = async () => {
    try {
      await createProfile(phoneNumber, name);
      alert('Profile created successfully!');
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const handleSendOtp = async () => {
    try {
      await sendOtp(phoneNumber);
      alert('OTP sent successfully!');
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp(uid, otp);
      alert('OTP verified successfully!');
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;
    
    try {
      const socialMediaHandles: SocialMediaHandle[] = [
        { platform: 'instagram', handle: '@example' },
        { platform: 'youtube', handle: '@example' },
      ];
      
      await updateProfile({
        email: 'example@email.com',
        socialMediaHandles,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Creator Profile Management Demo</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button onClick={clearError} className="ml-2 text-red-500">×</button>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={handleCreateProfile}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Profile'}
          </button>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Send OTP</h3>
            <button
              onClick={handleSendOtp}
              disabled={isLoading || !phoneNumber}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Verify OTP</h3>
            <div className="space-y-2">
              <input
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="UID"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="OTP"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || !uid || !otp}
                className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Creator Profile Dashboard</h2>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button onClick={clearError} className="ml-2 text-red-500">×</button>
        </div>
      )}

      {profile && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Profile Information</h3>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Phone:</strong> {profile.phoneNumber}</p>
            <p><strong>Email:</strong> {profile.email || 'Not set'}</p>
            <p><strong>Approved:</strong> {profile.approved.charAt(0).toUpperCase() + profile.approved.slice(1)}</p>
            <p><strong>Phone Verified:</strong> {profile.phoneNumberVerified ? 'Yes' : 'No'}</p>
            <p><strong>Social Media:</strong> {profile.socialMediaHandles?.length || 0} handles</p>
          </div>

          {completionScore && (
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-medium mb-2">Profile Completion</h3>
              <p><strong>Progress:</strong> {getCompletionPercentage()}%</p>
              <p><strong>Completed:</strong> {getCompletedTasks().join(', ') || 'None'}</p>
              <p><strong>Remaining:</strong> {getRemainingTasks().join(', ') || 'None'}</p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-medium">Quick Actions</h3>
            <button
              onClick={handleUpdateProfile}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>

          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="font-medium mb-2">Status</h3>
            <p><strong>Profile Complete:</strong> {isProfileComplete() ? 'Yes' : 'No'}</p>
            <p><strong>Needs Onboarding:</strong> {needsOnboarding() ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileExample;
