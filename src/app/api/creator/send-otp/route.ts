/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import {
  SendOtpRequest,
  SendOtpResponse,
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
    throw new Error(errorData.error || 'Firebase function call failed');
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const data: SendOtpRequest = await request.json();
    
    // Validate required fields
    if (!data.phoneNumber) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'phoneNumber is required',
          success: false,
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Validate phone number format (E.164)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(data.phoneNumber)) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'phoneNumber must be in E.164 format (e.g., +1234567890)',
          success: false,
        } as ErrorResponse,
        { status: 400 }
      );
    }

    const result = await callFirebaseFunction('/sendOtp', data);
    
    return NextResponse.json(result as SendOtpResponse);
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to send OTP',
        success: false,
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
