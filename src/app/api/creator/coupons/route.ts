import { NextRequest, NextResponse } from 'next/server';
import {
  GetCreatorCouponsResponse,
  CreateCouponForCreatorRequest,
  CreateCouponForCreatorResponse,
  ErrorResponse,
} from '@/types/api';
import { authedBackendFetch } from '@/lib/server/backend';

function backendError(response: Response, message: string) {
  return NextResponse.json(
    { error: response.status === 401 ? 'Authentication Error' : 'Backend Error', message, success: false } as ErrorResponse,
    { status: response.status }
  );
}

// GET endpoint for fetching coupons (internally calls backend POST)
export async function GET() {
  try {
    const response = await authedBackendFetch('/getCreatorCoupons', { method: 'POST', body: '' });
    if (!response.ok) {
      let message = 'Failed to fetch coupons';
      try { const e = await response.json(); message = e.message || e.error || message; } catch { }
      return backendError(response, message);
    }
    return NextResponse.json(await response.json() as GetCreatorCouponsResponse);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Failed to fetch coupons', success: false } as ErrorResponse,
      { status: 500 }
    );
  }
}

// POST endpoint for creating coupons
export async function POST(request: NextRequest) {
  try {
    const data: CreateCouponForCreatorRequest = await request.json();

    // Validate required fields
    if (!data.title || !data.code || !data.value || !data.startsAt || !data.endsAt) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'title, code, value, startsAt, and endsAt are required', success: false } as ErrorResponse,
        { status: 400 }
      );
    }

    // Validate value structure based on type
    if (data.value.type === 'percentage') {
      if (typeof data.value.percentage !== 'number' || data.value.percentage <= 0 || data.value.percentage > 100) {
        return NextResponse.json(
          { error: 'Validation Error', message: 'Percentage must be a number between 1 and 100', success: false } as ErrorResponse,
          { status: 400 }
        );
      }
    } else if (data.value.type === 'amount') {
      if (!data.value.amount || !data.value.currencyCode) {
        return NextResponse.json(
          { error: 'Validation Error', message: 'Amount and currencyCode are required for fixed amount discounts', success: false } as ErrorResponse,
          { status: 400 }
        );
      }
      const amount = parseFloat(data.value.amount);
      if (isNaN(amount) || amount <= 0) {
        return NextResponse.json(
          { error: 'Validation Error', message: 'Amount must be a positive number', success: false } as ErrorResponse,
          { status: 400 }
        );
      }
    }

    const response = await authedBackendFetch('/createCouponForCreator', { method: 'POST', body: JSON.stringify(data) });
    if (!response.ok) {
      let message = 'Failed to create coupon';
      try { const e = await response.json(); message = e.message || e.error || message; } catch { }
      return backendError(response, message);
    }
    return NextResponse.json(await response.json() as CreateCouponForCreatorResponse);
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Failed to create coupon', success: false } as ErrorResponse,
      { status: 500 }
    );
  }
}
