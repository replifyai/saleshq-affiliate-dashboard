import { NextRequest, NextResponse } from 'next/server';
import { authedBackendFetch } from '@/lib/server/backend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const response = await authedBackendFetch('/getShopifyProductsByIds', { method: 'POST', body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching shopify products by ids:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
