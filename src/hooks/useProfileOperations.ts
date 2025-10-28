import { useProfile } from '@/contexts/ProfileContext';
import { CreatorProfile, SocialMediaHandle } from '@/types/api';

// Custom hook for profile operations
export function useProfileOperations() {
  const { state, createProfile, sendOtp, verifyOtp, updateProfile, logout, clearError } = useProfile();

  // Helper functions for common operations
  const updateSocialMediaHandles = async (handles: SocialMediaHandle[]) => {
    await updateProfile({ socialMediaHandles: handles });
  };

  const updateEmail = async (email: string | null) => {
    await updateProfile({ email });
  };

  const updateName = async (name: string) => {
    await updateProfile({ name });
  };

  const markPhoneVerified = async () => {
    await updateProfile({ phoneNumberVerified: true });
  };

  const updateApprovalStatus = async (approved: boolean) => {
    await updateProfile({ approved });
  };

  // Profile completion helpers
  const getCompletionPercentage = (): number => {
    if (!state.completionScore) return 0;
    const total = state.completionScore.completedCount + state.completionScore.leftCount;
    return total > 0 ? Math.round((state.completionScore.completedCount / total) * 100) : 0;
  };

  const getRemainingTasks = (): string[] => {
    return state.completionScore?.left || [];
  };

  const getCompletedTasks = (): string[] => {
    return state.completionScore?.completed || [];
  };

  // Authentication helpers
  const isProfileComplete = (): boolean => {
    if (!state.profile) return false;
    return (
      state.profile.name.length > 0 &&
      state.profile.phoneNumberVerified &&
      (state.profile.email?.length || 0) > 0 &&
      (state.profile.socialMediaHandles?.length || 0) > 0
    );
  };

  const needsOnboarding = (): boolean => {
    return state.isAuthenticated && !isProfileComplete();
  };

  return {
    // State
    profile: state.profile,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    completionScore: state.completionScore,
    tokens: state.tokens,

    // Actions
    createProfile,
    sendOtp,
    verifyOtp,
    updateProfile,
    logout,
    clearError,

    // Helper actions
    updateSocialMediaHandles,
    updateEmail,
    updateName,
    markPhoneVerified,
    updateApprovalStatus,

    // Profile completion helpers
    getCompletionPercentage,
    getRemainingTasks,
    getCompletedTasks,
    isProfileComplete,
    needsOnboarding,
  };
}

export default useProfileOperations;
