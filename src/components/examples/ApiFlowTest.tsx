'use client';

import React from 'react';
import { useProfileOperations } from '@/hooks/useProfileOperations';
import { useSnackbar } from '@/components/snackbar/use-snackbar';

// Test component to demonstrate the complete API flow
export function ApiFlowTest() {
  const { 
    profile, 
    isAuthenticated, 
    isLoading, 
    error, 
    createProfile, 
    sendOtp, 
    verifyOtp, 
    updateProfile, 
    logout, 
    clearError,
    getCompletionPercentage,
    isProfileComplete 
  } = useProfileOperations();
  
  const { showSnackbar } = useSnackbar();

  const testCreateProfile = async () => {
    try {
      await createProfile('+919876543210', 'Test User');
      showSnackbar('Profile created successfully!', 'success');
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Failed to create profile', 'error');
    }
  };

  const testSendOtp = async () => {
    try {
      await sendOtp('+919876543210');
      showSnackbar('OTP sent successfully!', 'success');
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Failed to send OTP', 'error');
    }
  };

  const testVerifyOtp = async () => {
    try {
      await verifyOtp('+919876543210', '123456');
      showSnackbar('OTP verified successfully!', 'success');
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Failed to verify OTP', 'error');
    }
  };

  const testUpdateProfile = async () => {
    if (!profile?.id) {
      showSnackbar('No profile ID available', 'error');
      return;
    }
    
    try {
      await updateProfile({ 
        email: 'test@example.com',
        socialMediaHandles: [
          { platform: 'instagram', handle: '@testuser' }
        ]
      });
      showSnackbar('Profile updated successfully!', 'success');
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Failed to update profile', 'error');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">API Flow Test</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button onClick={clearError} className="ml-2 text-red-500">×</button>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-2">Current State</h3>
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Profile Complete:</strong> {isProfileComplete() ? 'Yes' : 'No'}</p>
          <p><strong>Completion:</strong> {getCompletionPercentage()}%</p>
          {profile && (
            <div className="mt-2">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Phone:</strong> {profile.phoneNumber}</p>
              <p><strong>Email:</strong> {profile.email || 'Not set'}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={testCreateProfile}
            disabled={isLoading}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Test Create Profile'}
          </button>

          <button
            onClick={testSendOtp}
            disabled={isLoading}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Test Send OTP'}
          </button>

          <button
            onClick={testVerifyOtp}
            disabled={isLoading}
            className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Test Verify OTP'}
          </button>

          <button
            onClick={testUpdateProfile}
            disabled={isLoading || !profile?.id}
            className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Test Update Profile'}
          </button>
        </div>

        {isAuthenticated && (
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default ApiFlowTest;
