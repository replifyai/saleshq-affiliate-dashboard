import { NextRequest, NextResponse } from 'next/server';
import {
  GetCreatorOrdersResponse,
  GetCreatorOrdersRequest,
  ErrorResponse,
} from '@/types/api';
import { authedBackendFetch } from '@/lib/server/backend';

// POST endpoint for fetching orders with filters and sorting
export async function POST(request: NextRequest) {
  try {
    const data: GetCreatorOrdersRequest = await request.json();

    // Validate required fields
    if (data.page === undefined || data.pageSize === undefined) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'page and pageSize are required', success: false } as ErrorResponse,
        { status: 400 }
      );
    }

    const response = await authedBackendFetch('/getCreatorOrders', { method: 'POST', body: JSON.stringify(data) });
    if (!response.ok) {
      let message = 'Failed to fetch orders';
      try { const e = await response.json(); message = e.message || e.error || message; } catch { }
      return NextResponse.json(
        { error: response.status === 401 ? 'Authentication Error' : 'Backend Error', message, success: false } as ErrorResponse,
        { status: response.status }
      );
    }

    const result = await response.json();

    // Handle nested response structure: { orders: { orders: [], pagination: {} } }
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
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Failed to fetch orders', success: false } as ErrorResponse,
      { status: 500 }
    );
  }
}
