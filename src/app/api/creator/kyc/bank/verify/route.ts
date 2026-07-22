import { NextRequest } from 'next/server';
import { proxyKyc } from '../../_shared';

export async function POST(request: NextRequest) {
    return proxyKyc(request, '/kyc/bank/verify', 'POST', 'verify bank account');
}
