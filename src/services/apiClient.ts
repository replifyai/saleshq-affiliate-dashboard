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
} from '@/types/api';
import { getIdToken } from '@/lib/cookies';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
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
      const idToken = getIdToken();
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
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
}

// Export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;
