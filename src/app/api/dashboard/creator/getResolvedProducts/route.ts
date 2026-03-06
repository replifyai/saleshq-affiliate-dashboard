import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL || 'https://dashboardapi-dkhjjaxofq-el.a.run.app';

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'Authorization token is required' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const body = await request.json().catch(() => ({}));

        if (!body.collectionId) {
            return NextResponse.json(
                { success: false, error: 'collectionId is required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${FIREBASE_FUNCTION_URL}/getResolvedProducts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                collectionId: body.collectionId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { success: false, error: errorData.error || errorData.message || 'Firebase function call failed' },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error getting resolved products:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
