/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

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
        // Get token from Authorization header or idToken cookie
        const authHeader = request.headers.get('Authorization');
        const cookieToken = request.cookies.get('idToken')?.value;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : cookieToken;

        if (!token) {
            return NextResponse.json(
                {
                    error: 'Authentication Error',
                    message: 'Authorization token is required',
                    success: false,
                },
                { status: 401 }
            );
        }

        const { email } = await request.json();

        // Validate required fields
        if (!email) {
            return NextResponse.json(
                {
                    error: 'Validation Error',
                    message: 'email is required',
                    success: false,
                },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    error: 'Validation Error',
                    message: 'Invalid email format',
                    success: false,
                },
                { status: 400 }
            );
        }

        const result = await callFirebaseFunctionWithAuth('/checkCreatorEmail', token, { email }, 'POST');

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error checking creator email:', error);
        return NextResponse.json(
            {
                error: 'Internal Server Error',
                message: error instanceof Error ? error.message : 'Failed to check email',
                success: false,
            },
            { status: 500 }
        );
    }
}
