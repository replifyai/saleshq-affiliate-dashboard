import {
  CreateCreatorProfileRequest,
  CreateCreatorProfileResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  UpdateCreatorProfileRequest,
  UpdateCreatorProfileResponse,
  GetCreatorProfileResponse,
  ErrorResponse,
  GetCreatorCouponsResponse,
  CreateCouponForCreatorRequest,
  CreateCouponForCreatorResponse,
  GetCreatorOrdersRequest,
  GetCreatorOrdersResponse,
  GetCreatorDashboardSummaryResponse,
  GetShopifyProductsResponse,
  GetProductCollectionsResponse,
  GetShopifyProductsByIdsRequest,
  GetShopifyProductsByIdsResponse,
  GetAvailablePayoutResponse,
  GetEarningsLedgerResponse,
  GetPayoutHistoryResponse,
  RequestPayoutRequest,
  RequestPayoutResponse,
  AddBankDetailsRequest,
  AddUpiDetailsRequest,
  PaymentMethodsResponse,
  VerifyPanRequest,
  VerifyPanResponse,
  VerifyBankRequest,
  VerifyBankResponse,
  KycStatusResponse,
} from '@/types/api';

// Auth is cookie-based: the creator's tokens live in httpOnly cookies that the
// browser sends automatically to same-origin BFF routes (/api/*). This client
// never reads or attaches tokens — an XSS bug can't steal them. On a genuine 401
// (the server-side refresh also failed) we redirect to /login.
class ApiClient {
  private baseUrl: string;

  // Custom Cache implementation for 30-minutes retention
  private cache: Record<string, { data: any, timestamp: number }> = {};
  private CACHE_DURATION = 30 * 60 * 1000;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache[key];
    if (cached && (Date.now() - cached.timestamp < this.CACHE_DURATION)) {
      return cached.data as T;
    }
    return null;
  }

  private setCachedData(key: string, data: any) {
    this.cache[key] = { data, timestamp: Date.now() };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = false
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      // Send the httpOnly auth cookies to our same-origin BFF routes.
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // A 401/403 on an authed call means the server-side session (and refresh)
      // is gone — send the user to log in again.
      if (requireAuth && (response.status === 401 || response.status === 403)) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData: ErrorResponse = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch { }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Creator Profile API methods
  async createCreatorProfile(data: CreateCreatorProfileRequest): Promise<CreateCreatorProfileResponse> {
    return this.request<CreateCreatorProfileResponse>('/creator/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    return this.request<SendOtpResponse>('/creator/send-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    return this.request<VerifyOtpResponse>('/creator/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCreatorProfile(data: UpdateCreatorProfileRequest): Promise<UpdateCreatorProfileResponse> {
    return this.request<UpdateCreatorProfileResponse>('/creator/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true);
  }

  async getCreatorProfile(): Promise<GetCreatorProfileResponse> {
    return this.request<GetCreatorProfileResponse>('/creator/profile', {
      method: 'GET',
    }, true);
  }

  // Coupon API methods
  async getCreatorCoupons(): Promise<GetCreatorCouponsResponse> {
    return this.request<GetCreatorCouponsResponse>('/creator/coupons', {
      method: 'GET',
    }, true);
  }

  async createCouponForCreator(data: CreateCouponForCreatorRequest): Promise<CreateCouponForCreatorResponse> {
    return this.request<CreateCouponForCreatorResponse>('/creator/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  // Orders API methods
  async getCreatorOrders(data: GetCreatorOrdersRequest): Promise<GetCreatorOrdersResponse> {
    return this.request<GetCreatorOrdersResponse>('/creator/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  async getCreatorDashboardSummary(): Promise<GetCreatorDashboardSummaryResponse> {
    return this.request<GetCreatorDashboardSummaryResponse>('/creator/dashboard-summary', {
      method: 'POST',
    }, true);
  }

  async getAllShopifyProducts(): Promise<GetShopifyProductsResponse> {
    return this.request<GetShopifyProductsResponse>('/products', {
      method: 'GET',
    }, true);
  }

  async getAllProductCollections(): Promise<GetProductCollectionsResponse> {
    const cacheKey = 'getAllProductCollections';
    const cached = this.getCachedData<GetProductCollectionsResponse>(cacheKey);
    if (cached) return cached;

    const result = await this.request<GetProductCollectionsResponse>('/collections/for-creator', {
      method: 'GET',
    }, true);

    this.setCachedData(cacheKey, result);
    return result;
  }

  async getShopifyProductsByIds(data: GetShopifyProductsByIdsRequest): Promise<GetShopifyProductsByIdsResponse> {
    return this.request<GetShopifyProductsByIdsResponse>('/products/by-ids', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  // Uses the newly created proxy wrapper endpoint for personalized product resolution
  async getResolvedProducts(collectionId: string): Promise<{ success: boolean; data: any[] }> {
    const cacheKey = `getResolvedProducts_${collectionId}`;
    const cached = this.getCachedData<{ success: boolean; data: any[] }>(cacheKey);
    if (cached) return cached;

    const result = await this.request<{ success: boolean; data: any[] }>('/dashboard/creator/getResolvedProducts', {
      method: 'POST',
      body: JSON.stringify({ collectionId }),
    }, true);

    this.setCachedData(cacheKey, result);
    return result;
  }

  // Email check API method
  async checkCreatorEmail(email: string): Promise<{ exists: boolean; creator: { id: string; name: string; email: string; approved: string } | null }> {
    return this.request<{ exists: boolean; creator: { id: string; name: string; email: string; approved: string } | null }>('/creator/check-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Payout API methods
  async getAvailablePayout(): Promise<GetAvailablePayoutResponse> {
    return this.request<GetAvailablePayoutResponse>('/creator/payout/available', {
      method: 'GET',
    }, true);
  }

  async getEarningsLedger(): Promise<GetEarningsLedgerResponse> {
    return this.request<GetEarningsLedgerResponse>('/creator/payout/ledger', {
      method: 'GET',
    }, true);
  }

  async getPayoutHistory(): Promise<GetPayoutHistoryResponse> {
    return this.request<GetPayoutHistoryResponse>('/creator/payout/history', {
      method: 'GET',
    }, true);
  }

  async requestPayout(data?: RequestPayoutRequest): Promise<RequestPayoutResponse> {
    return this.request<RequestPayoutResponse>('/creator/payout/request', {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }, true);
  }

  async addBankDetails(data: AddBankDetailsRequest): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/creator/payout/bank-details', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  async addUpiDetails(data: AddUpiDetailsRequest): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/creator/payout/upi-details', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  async getPaymentMethods(): Promise<PaymentMethodsResponse> {
    return this.request<PaymentMethodsResponse>('/creator/payout/payment-methods', {
      method: 'GET',
    }, true);
  }

  // KYC (Cashfree). Verifying a bank account is also what saves it — there is no
  // separate add/update call.

  async verifyPan(data: VerifyPanRequest): Promise<VerifyPanResponse> {
    return this.request<VerifyPanResponse>('/creator/kyc/pan/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  async verifyBank(data: VerifyBankRequest): Promise<VerifyBankResponse> {
    return this.request<VerifyBankResponse>('/creator/kyc/bank/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  async getKycStatus(): Promise<KycStatusResponse> {
    return this.request<KycStatusResponse>('/creator/kyc/status', {
      method: 'GET',
    }, true);
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;
