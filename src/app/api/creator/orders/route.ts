/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import {
  GetCreatorOrdersResponse,
  GetCreatorOrdersRequest,
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
    throw new Error(errorData.error || 'Firebase function call failed');
  }

  return response.json();
}

// POST endpoint for fetching orders with filters and sorting
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
    
    const data: GetCreatorOrdersRequest = await request.json();
    
    // Validate required fields
    if (data.page === undefined || data.pageSize === undefined) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'page and pageSize are required',
          success: false,
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Call getCreatorOrders endpoint (Firebase function uses POST)
    const result = await callFirebaseFunctionWithAuth('/getCreatorOrders', token, data, 'POST');
    
    // Handle nested response structure: { orders: { orders: [], pagination: {} } }
    // Firebase returns nested structure, we need to unwrap it
    if (result.orders && typeof result.orders === 'object' && 'orders' in result.orders) {
      return NextResponse.json({
        orders: result.orders.orders || [],
        pagination: result.orders.pagination || { page: 1, pageSize: 20, total: 0, totalPages: 0 }
      } as GetCreatorOrdersResponse);
    }
    
    // Fallback for direct structure
    return NextResponse.json(result as GetCreatorOrdersResponse);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to fetch orders',
        success: false,
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
