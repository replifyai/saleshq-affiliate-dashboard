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
  uniqueReferralCode?: string;
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

// Coupon Types
export type CouponValue =
  | { type: 'percentage'; percentage: number }
  | { type: 'amount'; amount: string; currencyCode: string; appliesOnEachItem?: boolean };

export interface CouponItemsSelection {
  [key: string]: any;
}

export interface Coupon {
  id: string;
  shopifyId: string;
  title: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EXPIRED';
  startsAt: string;
  endsAt: string;
  value: CouponValue;
  usageLimit: number;
  usesPerOrderLimit: number;
  itemsSelection: CouponItemsSelection;
  createdBy: string;
  approvedBy?: string | null;
  approvedAt?: number | null;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface GetCreatorCouponsResponse {
  coupons: Coupon[];
}

export interface CreateCouponForCreatorRequest {
  title: string;
  code: string;
  value: CouponValue;
  usageLimit: number;
  usesPerOrderLimit: number;
  itemsSelection: CouponItemsSelection;
  description: string;
  startsAt: string;
  endsAt: string;
}

export interface CreateCouponForCreatorResponse {
  coupon: Coupon;
}

// Order Types
export interface OrderLineItem {
  [key: string]: any;
}

export interface CreatorOrder {
  id: string;
  orderId: string;
  orderNumber: string;
  pixelEventId: string;
  customerId: string;
  customerEmail: string;
  currencyCode: string;
  subtotalAmount: string;
  shippingAmount: string;
  taxAmount: string;
  totalAmount: string;
  discountsTotal: string;
  lineItems: OrderLineItem[];
  referralCode: string;
  appliedCoupons: string[];
  attributedCreatorId: string;
  attributionType: string;
  attributedCouponCode: string;
  commissionBasis: string;
  commissionRateType: string;
  commissionRateValue: string;
  commissionAmount: string;
  commissionCurrency: string;
  commissionSource: string;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  refundedAmount: string;
  refundReason: string;
  rawEvent: { [key: string]: any };
  createdAt: number;
  updatedAt: number;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface GetCreatorOrdersRequest {
  page: number;
  pageSize: number;
  filters?: {
    paymentStatus?: string;
    orderNumber?: string;
  };
  sort?: {
    by: string;
    direction: 'asc' | 'desc';
  };
}

export interface GetCreatorOrdersResponse {
  orders: CreatorOrder[];
  pagination: PaginationInfo;
}