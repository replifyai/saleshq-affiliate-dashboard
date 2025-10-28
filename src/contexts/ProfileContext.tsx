'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CreatorProfile, VerifyOtpVerified, CompletionScore, SocialMediaHandle } from '@/types/api';
import apiClient from '@/services/apiClient';
import { setTokens, getTokens, clearTokens } from '@/lib/cookies';

// Context state interface
interface ProfileState {
  profile: CreatorProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  completionScore: CompletionScore | null;
  tokens: {
    idToken: string | null;
    refreshToken: string | null;
  };
}

// Action types
type ProfileAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROFILE'; payload: CreatorProfile }
  | { type: 'UPDATE_PROFILE'; payload: Partial<CreatorProfile> }
  | { type: 'SET_AUTHENTICATION'; payload: { profile: CreatorProfile; tokens: { idToken: string; refreshToken: string }; completionScore: CompletionScore } }
  | { type: 'CLEAR_PROFILE' }
  | { type: 'SET_COMPLETION_SCORE'; payload: CompletionScore };

// Initial state
const initialState: ProfileState = {
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  completionScore: null,
  tokens: {
    idToken: null,
    refreshToken: null,
  },
};

// Reducer
function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload, isAuthenticated: true, isLoading: false, error: null };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: state.profile ? { ...state.profile, ...action.payload } : null,
        isLoading: false,
        error: null,
      };
    case 'SET_AUTHENTICATION':
      return {
        ...state,
        profile: action.payload.profile,
        tokens: action.payload.tokens,
        completionScore: action.payload.completionScore,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_PROFILE':
      return {
        ...initialState,
        tokens: { idToken: null, refreshToken: null },
      };
    case 'SET_COMPLETION_SCORE':
      return { ...state, completionScore: action.payload };
    default:
      return state;
  }
}

// Context interface
interface ProfileContextType {
  state: ProfileState;
  createProfile: (phoneNumber: string, name: string) => Promise<void>;
  sendOtp: (phoneNumber: string) => Promise<void>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    email?: string | null;
    approved?: boolean;
    socialMediaHandles?: SocialMediaHandle[];
    phoneNumberVerified?: boolean;
    [key: string]: any;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Provider component
interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // Load tokens from cookies on mount
  useEffect(() => {
    const loadStoredTokens = () => {
      try {
        const tokens = getTokens();

        if (tokens.idToken) {
          dispatch({
            type: 'SET_AUTHENTICATION',
            payload: { 
              profile: null as any, // Will be fetched from API
              tokens: tokens as { idToken: string; refreshToken: string }, 
              completionScore: null as any 
            },
          });
        }
      } catch (error) {
        console.error('Error loading stored tokens:', error);
        clearTokens();
      }
    };

    loadStoredTokens();
  }, []);

  // Store tokens in cookies when they change
  useEffect(() => {
    if (state.tokens.idToken) {
      setTokens(state.tokens.idToken, state.tokens.refreshToken || '');
    }
  }, [state.tokens]);

  const createProfile = async (phoneNumber: string, name: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiClient.createCreatorProfile({ phoneNumber, name });
      dispatch({ type: 'SET_PROFILE', payload: response.profile });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create profile';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const sendOtp = async (phoneNumber: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await apiClient.sendOtp({ phoneNumber });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const verifyOtp = async (phoneNumber: string, otp: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiClient.verifyOtp({ phoneNumber, otp });
      const verifiedData = response.verified;
      const { idToken, refreshToken, completionScore, ...profileData } = verifiedData;

      // Store tokens in cookies
      setTokens(idToken, refreshToken);

      // Set authentication state with profile data from verification
      dispatch({
        type: 'SET_AUTHENTICATION',
        payload: {
          profile: profileData as CreatorProfile,
          tokens: { idToken, refreshToken },
          completionScore,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const fetchProfile = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiClient.getCreatorProfile();
      const { completionScore, ...profile } = response.creator;

      // Update profile and completion score in context only
      dispatch({ type: 'SET_PROFILE', payload: profile });
      if (completionScore) {
        dispatch({ type: 'SET_COMPLETION_SCORE', payload: completionScore });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const updateProfile = async (data: {
    name?: string;
    email?: string | null;
    approved?: boolean;
    socialMediaHandles?: SocialMediaHandle[];
    phoneNumberVerified?: boolean;
    [key: string]: any;
  }) => {
    if (!state.profile) {
      throw new Error('No profile to update');
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiClient.updateCreatorProfile({
        uid: state.profile.id,
        data,
      });
      dispatch({ type: 'UPDATE_PROFILE', payload: response.profile });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    clearTokens(); // Clear cookies
    dispatch({ type: 'CLEAR_PROFILE' });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value: ProfileContextType = {
    state,
    createProfile,
    sendOtp,
    verifyOtp,
    fetchProfile,
    updateProfile,
    logout,
    clearError,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

// Custom hook to use the profile context
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

export default ProfileContext;
