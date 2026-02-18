/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_FUNCTION_URL = process.env.FIREBASE_FUNCTION_URL || 'https://dashboardapi-dkhjjaxofq-el.a.run.app';

async function callFirebaseFunction(endpoint: string, data: any) {
    const response = await fetch(`${FIREBASE_FUNCTION_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Firebase function call failed');
    }

    return response.json();
}

export async function POST(request: NextRequest) {
    try {
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

        const result = await callFirebaseFunction('/admin/checkCreatorEmail', { email });

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
