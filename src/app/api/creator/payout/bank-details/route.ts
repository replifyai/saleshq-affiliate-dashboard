import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponse } from '@/types/api';
import { authedBackendFetch } from '@/lib/server/backend';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.accountNumber || !body.ifscCode || !body.accountName) {
            return NextResponse.json(
                { error: 'Validation Error', message: 'accountNumber, ifscCode, and accountName are required', success: false } as ErrorResponse,
                { status: 400 }
            );
        }

        const response = await authedBackendFetch('/payout/bank-details', { method: 'POST', body: JSON.stringify(body) });
        if (!response.ok) {
            let message = 'Failed to add bank details';
            try { const e = await response.json(); message = e.message || e.error || message; } catch { }
            return NextResponse.json(
                { error: response.status === 401 ? 'Authentication Error' : 'Backend Error', message, success: false } as ErrorResponse,
                { status: response.status }
            );
        }
        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error adding bank details:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Failed to add bank details', success: false } as ErrorResponse,
            { status: 500 }
        );
    }
}
