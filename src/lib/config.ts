// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    firebaseFunctionUrl: process.env.FIREBASE_FUNCTION_URL || 'https://14cgqud3x9.execute-api.ap-south-1.amazonaws.com/api',
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
