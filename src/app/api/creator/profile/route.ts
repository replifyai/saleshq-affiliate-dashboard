/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import {
  CreateCreatorProfileRequest,
  CreateCreatorProfileResponse,
  UpdateCreatorProfileRequest,
  UpdateCreatorProfileResponse,
  GetCreatorProfileResponse,
  ErrorResponse,
} from '@/types/api';
import { authedBackendFetch } from '@/lib/server/backend';

const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL || 'https://14cgqud3x9.execute-api.ap-south-1.amazonaws.com/api';

// Unauthenticated backend call — used only by the public signup POST below.
async function callFirebaseFunction(endpoint: string, data: any) {
  const response = await fetch(`${FIREBASE_FUNCTION_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Backend call failed');
  }
  return response.json();
}

// Public: creator self-signup (no auth token yet).
export async function POST(request: NextRequest) {
  try {
    const data: CreateCreatorProfileRequest = await request.json();

    if (!data.phoneNumber || !data.name) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'phoneNumber and name are required', success: false } as ErrorResponse,
        { status: 400 }
      );
    }

    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(data.phoneNumber)) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'phoneNumber must be in E.164 format (e.g., +1234567890)', success: false } as ErrorResponse,
        { status: 400 }
      );
    }

    const result = await callFirebaseFunction('/createCreatorProfile', data);
    return NextResponse.json({ profile: result } as CreateCreatorProfileResponse);
  } catch (error) {
    console.error('Error creating creator profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Failed to create creator profile', success: false } as ErrorResponse,
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data: UpdateCreatorProfileRequest = await request.json();

    if (!data.uid || !data.data) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'uid and data are required', success: false } as ErrorResponse,
        { status: 400 }
      );
    }

    // Note: the backend derives the target creator from the auth token, not the
    // body uid (IDOR-safe); uid is still sent for backwards compatibility.
    const response = await authedBackendFetch('/updateCreatorProfile', { method: 'POST', body: JSON.stringify(data) });
    if (!response.ok) {
      let message = 'Failed to update creator profile';
      try { const e = await response.json(); message = e.message || e.error || message; } catch { }
      return NextResponse.json(
        { error: response.status === 401 ? 'Authentication Error' : 'Backend Error', message, success: false } as ErrorResponse,
        { status: response.status }
      );
    }

    revalidateTag('creator-profile', 'max');
    return NextResponse.json(await response.json() as UpdateCreatorProfileResponse);
  } catch (error) {
    console.error('Error updating creator profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Failed to update creator profile', success: false } as ErrorResponse,
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await authedBackendFetch('/getCreatorProfile', { method: 'POST', body: '' });
    if (!response.ok) {
      let message = 'Failed to get creator profile';
      try { const e = await response.json(); message = e.message || e.error || message; } catch { }
      return NextResponse.json(
        { error: response.status === 401 ? 'Authentication Error' : 'Backend Error', message, success: false } as ErrorResponse,
        { status: response.status }
      );
    }
    return NextResponse.json(await response.json() as GetCreatorProfileResponse);
  } catch (error) {
    console.error('Error getting creator profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Failed to get creator profile', success: false } as ErrorResponse,
      { status: 500 }
    );
  }
}
