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
} from '@/types/api';
import { getIdToken, getRefreshToken, setTokens, clearTokens } from '@/lib/cookies';
import config from '@/lib/config';

class ApiClient {
  private baseUrl: string;
  private refreshingPromise: Promise<string | null> | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
  }

  private decodeJwt(token: string): { exp?: number } | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(typeof atob !== 'undefined' ? atob(payload) : Buffer.from(payload, 'base64').toString('utf8'));
      return decoded || null;
    } catch {
      return null;
    }
  }

  private isTokenExpiringSoon(token: string, bufferSeconds: number = 60): boolean {
    const payload = this.decodeJwt(token);
    if (!payload?.exp) return false;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.exp - nowSeconds <= bufferSeconds;
  }

  private async refreshIdToken(): Promise<string | null> {
    if (this.refreshingPromise) return this.refreshingPromise;

    this.refreshingPromise = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        return null;
      }

      try {
        const response = await fetch(`${config.api.firebaseFunctionUrl}/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`,
            ...(process.env.NEXT_PUBLIC_API_KEY ? { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY } : {}),
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          clearTokens();
          return null;
        }

        const data = await response.json() as { idToken?: string; refreshToken?: string };
        if (data.idToken && data.refreshToken) {
          setTokens(data.idToken, data.refreshToken);
          return data.idToken;
        }

        clearTokens();
        return null;
      } catch {
        clearTokens();
        return null;
      } finally {
        this.refreshingPromise = null;
      }
    })();

    return this.refreshingPromise;
  }

  private async ensureValidIdToken(): Promise<string | null> {
    const current = getIdToken();
    if (!current) return await this.refreshIdToken();
    if (this.isTokenExpiringSoon(current)) {
      const refreshed = await this.refreshIdToken();
      return refreshed || current;
    }
    return current;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = false
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if authentication is required
    if (requireAuth) {
      const idToken = await this.ensureValidIdToken();
      if (idToken) {
        defaultHeaders['Authorization'] = `Bearer ${idToken}`;
      }
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      let response = await fetch(url, config);

      // If unauthorized, attempt single refresh and retry once
      if (requireAuth && (response.status === 401 || response.status === 403)) {
        const newIdToken = await this.refreshIdToken();
        if (newIdToken) {
          const retryConfig: RequestInit = {
            ...config,
            headers: {
              ...(config.headers as Record<string, string>),
              'Authorization': `Bearer ${newIdToken}`,
            },
          };
          response = await fetch(url, retryConfig);
        }
      }

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData: ErrorResponse = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}
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
}

// Export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;
