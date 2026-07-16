import { NextRequest } from 'next/server';
import { proxyKyc } from '../_shared';

export async function GET(request: NextRequest) {
    return proxyKyc(request, '/kyc/status', 'GET', 'fetch KYC status');
}
