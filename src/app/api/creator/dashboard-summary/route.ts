import { NextResponse } from 'next/server';
import { ErrorResponse, GetCreatorDashboardSummaryResponse } from '@/types/api';
import { authedBackendFetch } from '@/lib/server/backend';

export async function POST() {
  try {
    const response = await authedBackendFetch('/getCreatorDashboardSummary', { method: 'POST', body: '' });

    if (!response.ok) {
      let message = 'Failed to fetch dashboard summary';
      try { const e = await response.json(); message = e.message || e.error || message; } catch { }
      // Forward the backend status (esp. 401) so the client can redirect to login.
      return NextResponse.json(
        { error: response.status === 401 ? 'Authentication Error' : 'Backend Error', message, success: false } as ErrorResponse,
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result as GetCreatorDashboardSummaryResponse);
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Failed to fetch dashboard summary', success: false } as ErrorResponse,
      { status: 500 }
    );
  }
}
