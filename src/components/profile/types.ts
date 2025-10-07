export interface SocialMediaHandle {
  platform: string;
  handle: string;
  url: string;
  verified: boolean;
}

export interface AffiliateProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  bio: string;
  dateOfBirth: string;
  joiningDate: string;
  socialMedia: SocialMediaHandle[];
  commissionRate: number;
  totalEarnings: number;
  affiliateCode: string;
}