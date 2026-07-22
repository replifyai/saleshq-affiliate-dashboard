import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL || 'https://14cgqud3x9.execute-api.ap-south-1.amazonaws.com/api';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Authorization token required' }, { status: 401 });
  }

  try {
    const response = await fetch(`${FIREBASE_FUNCTION_URL}/getAllShopifyProducts`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching shopify products:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
