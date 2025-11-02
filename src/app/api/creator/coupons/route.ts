/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import {
  GetCreatorCouponsResponse,
  CreateCouponForCreatorRequest,
  CreateCouponForCreatorResponse,
  ErrorResponse,
} from '@/types/api';

// This would be your actual Firebase Function URL
const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL || 'https://dashboardapi-dkhjjaxofq-el.a.run.app';

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

// GET endpoint for fetching coupons (internally calls Firebase POST)
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
    
    // Call getCreatorCoupons endpoint (Firebase function uses POST)
    const result = await callFirebaseFunctionWithAuth('/getCreatorCoupons', token, '', 'POST');
    return NextResponse.json(result as GetCreatorCouponsResponse);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to fetch coupons',
        success: false,
      } as ErrorResponse,
      { status: 500 }
    );
  }
}

// POST endpoint for creating coupons
export async function POST(request: NextRequest) {
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
    
    const data: CreateCouponForCreatorRequest = await request.json();
    
    // Validate required fields
    if (!data.title || !data.code || !data.value || !data.startsAt || !data.endsAt) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'title, code, value, startsAt, and endsAt are required',
          success: false,
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Validate value structure based on type
    if (data.value.type === 'percentage') {
      if (typeof data.value.percentage !== 'number' || data.value.percentage <= 0 || data.value.percentage > 100) {
        return NextResponse.json(
          {
            error: 'Validation Error',
            message: 'Percentage must be a number between 1 and 100',
            success: false,
          } as ErrorResponse,
          { status: 400 }
        );
      }
    } else if (data.value.type === 'amount') {
      if (!data.value.amount || !data.value.currencyCode) {
        return NextResponse.json(
          {
            error: 'Validation Error',
            message: 'Amount and currencyCode are required for fixed amount discounts',
            success: false,
          } as ErrorResponse,
          { status: 400 }
        );
      }
      const amount = parseFloat(data.value.amount);
      if (isNaN(amount) || amount <= 0) {
        return NextResponse.json(
          {
            error: 'Validation Error',
            message: 'Amount must be a positive number',
            success: false,
          } as ErrorResponse,
          { status: 400 }
        );
      }
    }

    const result = await callFirebaseFunctionWithAuth('/createCouponForCreator', token, data, 'POST');
    return NextResponse.json(result as CreateCouponForCreatorResponse);
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to create coupon',
        success: false,
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
