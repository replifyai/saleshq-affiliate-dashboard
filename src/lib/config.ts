// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    firebaseFunctionUrl: process.env.FIREBASE_FUNCTION_URL || 'https://asia-south1-touch-17fa9.cloudfunctions.net/dashboardApi',
  },
  
  // App Configuration
  app: {
    name: 'SalesHQ Creator Dashboard',
    version: '1.0.0',
  },
  
  // Feature Flags
  features: {
    enableProfileCompletion: true,
    enableSocialMediaHandles: true,
    enableOtpVerification: true,
  },
} as const;

export default config;
