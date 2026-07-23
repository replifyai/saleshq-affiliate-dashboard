import { NextResponse } from 'next/server';
import { ErrorResponse } from '@/types/api';
import { authedBackendFetch } from '@/lib/server/backend';

export async function GET() {
    try {
        const response = await authedBackendFetch('/payout/payment-methods', { method: 'GET' });
        if (!response.ok) {
            let message = 'Failed to fetch payment methods';
            try { const e = await response.json(); message = e.message || e.error || message; } catch { }
            return NextResponse.json(
                { error: response.status === 401 ? 'Authentication Error' : 'Backend Error', message, success: false } as ErrorResponse,
                { status: response.status }
            );
        }
        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Failed to fetch payment methods', success: false } as ErrorResponse,
            { status: 500 }
        );
    }
}
