import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL || 'https://asia-south1-touch-17fa9.cloudfunctions.net/dashboardApi';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Authorization token required' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const response = await fetch(`${FIREBASE_FUNCTION_URL}/getShopifyProductsByIds`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching shopify products by ids:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
