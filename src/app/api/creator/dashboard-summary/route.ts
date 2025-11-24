import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponse, GetCreatorDashboardSummaryResponse } from '@/types/api';

const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL || 'https://dashboardapi-dkhjjaxofq-el.a.run.app';

export async function POST(request: NextRequest) {
  try {
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

    const token = authHeader.substring(7);

    const response = await fetch(`${FIREBASE_FUNCTION_URL}/getCreatorDashboardSummary`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: '',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch dashboard summary';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Ignore JSON parsing errors and fall back to default message
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();

    return NextResponse.json(result as GetCreatorDashboardSummaryResponse);
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to fetch dashboard summary',
        success: false,
      } as ErrorResponse,
      { status: 500 }
    );
  }
}

