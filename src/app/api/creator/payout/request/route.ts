import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponse } from '@/types/api';
import { authedBackendFetch } from '@/lib/server/backend';

export async function POST(request: NextRequest) {
    try {
        let body = {};
        try {
            body = await request.json();
        } catch {
            // Empty body is valid — withdraws full available amount
        }

        const response = await authedBackendFetch('/payout/request', { method: 'POST', body: JSON.stringify(body) });
        if (!response.ok) {
            let message = 'Failed to request payout';
            try { const e = await response.json(); message = e.message || e.error || message; } catch { }
            return NextResponse.json(
                { error: response.status === 401 ? 'Authentication Error' : 'Backend Error', message, success: false } as ErrorResponse,
                { status: response.status }
            );
        }
        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error requesting payout:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Failed to request payout', success: false } as ErrorResponse,
            { status: 500 }
        );
    }
}
