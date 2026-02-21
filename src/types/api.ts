/* eslint-disable @typescript-eslint/no-explicit-any */
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
  shopDomain?: string;
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
  endsAt: string | null;
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
  usageLimit: number | null;
  usesPerOrderLimit: number;
  itemsSelection: CouponItemsSelection;
  description: string;
  startsAt: string;
  endsAt: string | null;
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
  checkoutToken?: string | null;
  pixelEventId?: string | null;
  customerId: string;
  customerEmail: string;
  currencyCode: string;
  subtotalAmount: string;
  shippingAmount: string;
  taxAmount: string;
  totalAmount: string;
  discountsTotal: string;
  lineItems: OrderLineItem[];
  referralCode?: string | null;
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
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded' | 'partially_refunded';
  paymentMethod: string;
  refundedAmount?: string | null;
  refundReason?: string | null;
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

// Dashboard Summary Types
export interface StatusMapEntry {
  count: number;
  amount?: number;
}

export interface SocialChannelData {
  orders: number;
  revenue: number;
}

export interface ActiveCoupon {
  code: string;
  title: string;
  discountType: 'percentage' | 'amount';
  discountValue: number;
  commissionType: 'percentage' | 'amount';
  commissionValue: string;
  commissionBasis: string;
}

export interface ReferralLink {
  referralCode: string;
  commissionType: 'percentage' | 'amount';
  commissionValue: string;
  commissionBasis: string;
  active: boolean;
}

export interface CreatorDashboardSummary {
  totalCoupons: number;
  totalOrders: number;
  totalSales: number;
  totalCommission: number;
  totalDiscountsGiven: number;
  averageOrderValue: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  // New fields for enhanced insights
  netSales: number;
  voidedEarnings: number;
  totalDeducted: number;
  totalRefundedAmount: number;
  totalRefundedOrders: number;
  // Status maps
  earningsStatusMap: Record<string, StatusMapEntry>;
  ordersStatusMap: Record<string, { count: number }>;
  salesBySocialChannel: Record<string, SocialChannelData>;
  activeCoupon: ActiveCoupon | null;
  referralLink: ReferralLink | null;
  // Legacy fields for backward compatibility
  totalEarningsTillDate?: number | string;
  averageEarningPerOrder?: number | string;
  [key: string]: unknown;
}

export interface GetCreatorDashboardSummaryResponse {
  summary: CreatorDashboardSummary;
}

// Shopify Products Types
export interface ShopifyPriceRange {
  minVariantPrice: {
    amount: string;
    currencyCode: string;
  };
  maxVariantPrice: {
    amount: string;
    currencyCode: string;
  };
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  status: string;
  productType: string;
  images?: string[];
  priceRangeV2?: ShopifyPriceRange;
  minPrice?: string;
  maxPrice?: string;
  currencyCode?: string;
}

export interface GetShopifyProductsResponse {
  productCollection: {
    success: boolean;
    data: ShopifyProduct[];
    total: number;
  };
}

// Product Collections Types
export interface ProductCollection {
  id: string;
  name: string;
  handle: string;
  description: string;
  productIds: string[];
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export interface GetProductCollectionsResponse {
  productCollections: ProductCollection[];
}

export interface GetShopifyProductsByIdsRequest {
  ids: string[];
}

export interface GetShopifyProductsByIdsResponse {
  products: ShopifyProduct[];
}

// ============================================================================
// Payout Types
// ============================================================================

export interface AvailablePayoutData {
  creatorId: string;
  available: {
    amount: string;
    currency: string;
    eligibleCommissions: number;
    deductions: string;
    carryForwardDeduction: string;
  };
  pending: {
    totalAmount: string;
    unfulfilled: {
      amount: string;
      count: number;
    };
    inWindow: {
      amount: string;
      count: number;
    };
    inCycle: {
      amount: string;
      count: number;
    };
  };
  canPayout: boolean;
  hasPaymentMethod: boolean;
  reason?: string | null;
}

export interface GetAvailablePayoutResponse {
  payout: AvailablePayoutData;
}

export interface LedgerEntry {
  id: string;
  orderInternalId: string;
  orderNumber: string;
  basisAmount: string;
  commissionAmount: string;
  deductedAmount?: string;
  status: 'pending_payment' | 'paid';
  entryType: string;
  createdAt: number;
  orderCreatedAt: number;
  isEligible: boolean;
  eligibleAt: number | null;
}

export interface GetEarningsLedgerResponse {
  ledger: LedgerEntry[];
}

export interface PayoutHistoryEntry {
  id: string;
  amount: string;
  currency: string;
  commissionsCount: number;
  deductionsAmount: string;
  status: 'approved' | 'processing' | 'processed' | 'completed' | 'failed' | 'reversed';
  initiatedByType: string;
  initiatedById: string;
  processedAt: number | null;
  createdAt: number;
}

export interface GetPayoutHistoryResponse {
  history: PayoutHistoryEntry[];
}

export interface RequestPayoutRequest {
  amount?: string;
}

export interface RequestPayoutResponse {
  payout: {
    success: boolean;
    payoutId: string;
    amount: string;
    commissionsIncluded: number;
  };
}

export interface AddBankDetailsRequest {
  accountNumber: string;
  ifscCode: string;
  accountName: string;
}

export interface AddUpiDetailsRequest {
  upiId: string;
}

export interface PaymentMethodsResponse {
  methods: {
    hasBank: boolean;
    hasUpi: boolean;
    bankDetails?: {
      accountNumber: string;
      ifscCode: string;
      accountName: string;
    } | null;
    preference: 'bank' | 'upi';
  };
}