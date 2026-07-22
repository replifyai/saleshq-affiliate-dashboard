/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponse } from '@/types/api';

const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL || 'https://14cgqud3x9.execute-api.ap-south-1.amazonaws.com/api';

/**
 * Shared proxy for the KYC endpoints. Same shape as the payout routes, factored out
 * because there are four of them and the only thing that varies is the path and body.
 * The creator is identified by the Bearer token on the backend — never by anything the
 * client sends in the body.
 */
export async function proxyKyc(
    request: NextRequest,
    endpoint: string,
    method: 'GET' | 'POST',
    label: string,
): Promise<NextResponse> {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Authentication Error', message: 'Authorization token is required', success: false } as ErrorResponse,
                { status: 401 }
            );
        }

        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
        };

        if (method === 'POST') {
            options.body = JSON.stringify(await request.json());
        }

        const response = await fetch(`${FIREBASE_FUNCTION_URL}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) {
            // Pass the backend's status and message through — these are user-facing reasons
            // ("The name on this PAN does not match your profile name"), not internal detail.
            return NextResponse.json(
                { error: 'Verification Error', message: data.error || `Failed to ${label}`, success: false } as ErrorResponse,
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error(`Error in ${label}:`, error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: error instanceof Error ? error.message : `Failed to ${label}`, success: false } as ErrorResponse,
            { status: 500 }
        );
    }
}
