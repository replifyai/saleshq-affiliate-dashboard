/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponse } from '@/types/api';

const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL || 'https://dashboardapi-dkhjjaxofq-el.a.run.app';

async function callFirebaseFunctionWithAuth(endpoint: string, authToken: string, data?: any, method: 'GET' | 'POST' = 'POST') {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
    };
    if (method === 'POST' && data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${FIREBASE_FUNCTION_URL}${endpoint}`, options);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Firebase function call failed');
    }

    return response.json();
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Authentication Error', message: 'Authorization token is required', success: false } as ErrorResponse,
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const body = await request.json();

        if (!body.accountNumber || !body.ifscCode || !body.accountName) {
            return NextResponse.json(
                { error: 'Validation Error', message: 'accountNumber, ifscCode, and accountName are required', success: false } as ErrorResponse,
                { status: 400 }
            );
        }

        const result = await callFirebaseFunctionWithAuth('/payout/bank-details', token, body, 'POST');

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error adding bank details:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Failed to add bank details', success: false } as ErrorResponse,
            { status: 500 }
        );
    }
}
