/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { VerifyOtpRequest, ErrorResponse } from '@/types/api';
import { setAuthCookies } from '@/lib/server/backend';

const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL || 'https://14cgqud3x9.execute-api.ap-south-1.amazonaws.com/api';

export async function POST(request: NextRequest) {
  try {
    const data: VerifyOtpRequest = await request.json();

    if (!data.phoneNumber || !data.otp) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'phoneNumber and otp are required', success: false } as ErrorResponse,
        { status: 400 }
      );
    }

    const res = await fetch(`${FIREBASE_FUNCTION_URL}/verifyOtp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = (await res.json().catch(() => ({}))) as any;

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Verification Error', message: result.error || result.message || 'Failed to verify OTP', success: false } as ErrorResponse,
        { status: res.status }
      );
    }

    // Backend returns { verified: { idToken, refreshToken } }. Persist the tokens
    // as httpOnly cookies (never exposed to page JS) and strip them from the
    // response body. The profile loads server-side after the client redirects.
    const verified = (result.verified || {}) as Record<string, any>;
    const { idToken, refreshToken, ...safe } = verified;

    if (idToken && refreshToken) {
      const jar = await cookies();
      setAuthCookies(jar, idToken, refreshToken);
    }

    return NextResponse.json({ verified: safe });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Failed to verify OTP', success: false } as ErrorResponse,
      { status: 500 }
    );
  }
}
