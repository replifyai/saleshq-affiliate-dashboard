import { NextRequest, NextResponse } from 'next/server';
import {
  VerifyOtpRequest,
  VerifyOtpResponse,
  ErrorResponse,
} from '@/types/api';

// This would be your actual Firebase Function URL
const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL || 'https://your-firebase-function-url.com';

async function callFirebaseFunction(endpoint: string, data: any) {
  const response = await fetch(`${FIREBASE_FUNCTION_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error data:', errorData);
    throw new Error(errorData.error || 'Firebase function call failed');
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const data: VerifyOtpRequest = await request.json();
    
    // Validate required fields
    if (!data.phoneNumber || !data.otp) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'phoneNumber and otp are required',
          success: false,
        } as ErrorResponse,
        { status: 400 }
      );
    }

    const result = await callFirebaseFunction('/verifyOtp', data);
    
    return NextResponse.json(result as VerifyOtpResponse);
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to verify OTP',
        success: false,
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
