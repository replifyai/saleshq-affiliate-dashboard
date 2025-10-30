// API Types based on OpenAPI specification - Creator endpoints only

export interface SocialMediaHandle {
  platform: 'instagram' | 'youtube' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'snapchat' | 'pinterest' | 'reddit' | 'telegram' | 'whatsapp' | 'other';
  handle: string;
}

export interface CreatorProfile {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string | null;
  createdAt: number;
  approved: 'approved' | 'rejected' | 'pending';
  socialMediaHandles?: SocialMediaHandle[] | null;
  phoneNumberVerified: boolean;
}

export interface CompletionScore {
  completed: string[];
  left: string[];
  completedCount: number;
  leftCount: number;
}

export interface VerifyOtpVerified extends CreatorProfile {
  idToken: string;
  refreshToken: string;
  completionScore: CompletionScore;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  success: boolean;
  [key: string]: any;
}

// Request types
export interface CreateCreatorProfileRequest {
  phoneNumber: string;
  name: string;
}

export interface SendOtpRequest {
  phoneNumber: string;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string | number; // Accept both string and number for flexibility
}

export interface UpdateCreatorProfileRequest {
  uid: string;
  data: {
    name?: string;
    email?: string | null;
    approved?: 'approved' | 'rejected' | 'pending';
    socialMediaHandles?: SocialMediaHandle[];
    phoneNumberVerified?: boolean;
    [key: string]: any;
  };
}

// Response wrapper types
export interface CreateCreatorProfileResponse {
  profile: CreatorProfile;
}

export interface VerifyOtpResponse {
  verified: VerifyOtpVerified;
}

export interface UpdateCreatorProfileResponse {
  profile: CreatorProfile;
}

export interface GetCreatorProfileResponse {
  creator: CreatorProfile & {
    completionScore: CompletionScore;
  };
}
