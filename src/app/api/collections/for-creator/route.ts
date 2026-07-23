import { NextResponse } from 'next/server';
import { authedBackendFetch } from '@/lib/server/backend';

export async function GET() {
  try {
    const response = await authedBackendFetch('/getAllProductCollectionsForCreator', { method: 'GET' });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching product collections:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
