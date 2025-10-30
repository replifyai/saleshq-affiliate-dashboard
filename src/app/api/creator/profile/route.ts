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

// This would be your actual Firebase Function URL
const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL || 'https://dashboardapi-dkhjjaxofq-el.a.run.app';

async function callFirebaseFunction(endpoint: string, data: any, method: 'GET' | 'POST' = 'POST') {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Only add body for POST requests
  if (method === 'POST') {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${FIREBASE_FUNCTION_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Firebase function call failed');
  }

  return response.json();
}

async function callFirebaseFunctionWithAuth(endpoint: string, authToken: string, data?: any, method: 'GET' | 'POST' = 'POST') {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  };
   // Only add body for POST requests
  if (method === 'POST' && data) {
    options.body = JSON.stringify(data);
  } 

  const response = await fetch(`${FIREBASE_FUNCTION_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Firebase function call failed');
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateCreatorProfileRequest = await request.json();
    
    // Validate required fields
    if (!data.phoneNumber || !data.name) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'phoneNumber and name are required',
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

    const result = await callFirebaseFunction('/createCreatorProfile', data);
    
    return NextResponse.json({ profile: result } as CreateCreatorProfileResponse);
  } catch (error) {
    console.error('Error creating creator profile:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to create creator profile',
        success: false,
      } as ErrorResponse,
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          error: 'Authentication Error',
          message: 'Authorization token is required',
          success: false,
        } as ErrorResponse,
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const data: UpdateCreatorProfileRequest = await request.json();
    
    // Validate required fields
    if (!data.uid || !data.data) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'uid and data are required',
          success: false,
        } as ErrorResponse,
        { status: 400 }
      );
    }

    const result = await callFirebaseFunctionWithAuth('/updateCreatorProfile', token, data);
    
    // Revalidate the cache after updating the profile
    revalidateTag('creator-profile');
    
    // Firebase function already returns { profile: CreatorProfile }, so return it directly
    return NextResponse.json(result as UpdateCreatorProfileResponse);
  } catch (error) {
    console.error('Error updating creator profile:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to update creator profile',
        success: false,
      } as ErrorResponse,
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          error: 'Authentication Error',
          message: 'Authorization token is required',
          success: false,
        } as ErrorResponse,
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Call the external API endpoint with Next.js caching (10 minutes = 600 seconds)
    const response = await fetch(`${FIREBASE_FUNCTION_URL}/getCreatorProfile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: '',
      next: { 
        revalidate: 600, // Cache for 10 minutes
        tags: ['creator-profile'] // Tag for cache invalidation
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get creator profile');
    }

    const result = await response.json();
    
    return NextResponse.json(result as GetCreatorProfileResponse);
  } catch (error) {
    console.error('Error getting creator profile:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to get creator profile',
        success: false,
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
