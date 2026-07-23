import { NextRequest, NextResponse } from 'next/server';
import { authedBackendFetch } from '@/lib/server/backend';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));

        if (!body.collectionId) {
            return NextResponse.json(
                { success: false, error: 'collectionId is required' },
                { status: 400 }
            );
        }

        const response = await authedBackendFetch('/getResolvedProducts', {
            method: 'POST',
            body: JSON.stringify({ collectionId: body.collectionId }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { success: false, error: errorData.error || errorData.message || 'Backend call failed' },
                { status: response.status }
            );
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error getting resolved products:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
