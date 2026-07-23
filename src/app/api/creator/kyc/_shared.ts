import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponse } from '@/types/api';
import { authedBackendFetch } from '@/lib/server/backend';

/**
 * Shared proxy for the KYC endpoints. The creator is identified by the httpOnly
 * auth cookie on the backend — never by anything the client sends in the body.
 */
export async function proxyKyc(
    request: NextRequest,
    endpoint: string,
    method: 'GET' | 'POST',
    label: string,
): Promise<NextResponse> {
    try {
        const init: RequestInit = { method };
        if (method === 'POST') {
            init.body = JSON.stringify(await request.json().catch(() => ({})));
        }

        const response = await authedBackendFetch(endpoint, init);
        const data = await response.json().catch(() => ({} as any));

        if (!response.ok) {
            // Pass the backend's status and message through — these are user-facing reasons
            // ("The name on this PAN does not match your profile name"), not internal detail.
            return NextResponse.json(
                {
                    error: response.status === 401 ? 'Authentication Error' : 'Verification Error',
                    message: (data as any).error || (data as any).message || `Failed to ${label}`,
                    success: false,
                } as ErrorResponse,
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
