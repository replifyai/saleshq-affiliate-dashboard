'use client';

import React, { useState } from 'react';
import { Loader2, Landmark } from 'lucide-react';
import apiClient from '@/services/apiClient';
import { VerifyBankRequest } from '@/types/api';

/**
 * Adding or updating a payout account is *only* ever the Cashfree verification —
 * there is no separate save call. Both entry points (the KYC flow's bank step and the
 * profile card's Save Bank Details) run this.
 *
 * The call is synchronous: Cashfree returns the verdict in the response, so there is
 * nothing to poll.
 */
export const useBankVerification = () => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /** Returns true only once the account is verified and saved. */
    const verify = async (payload: VerifyBankRequest): Promise<boolean> => {
        setError(null);
        setIsVerifying(true);
        try {
            await apiClient.verifyBank(payload);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not verify your bank details. Try again.');
            return false;
        } finally {
            setIsVerifying(false);
        }
    };

    return { isVerifying, error, setError, verify };
};

/**
 * Blocking overlay shown while the penny drop runs. Deliberately a single spinner
 * rather than the Figma's four-step checklist: verification is one synchronous call,
 * so staged steps would be an animation pretending to be progress.
 */
export const BankVerifyingOverlay: React.FC = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-5">
        <div className="w-full max-w-[338px] rounded-3xl bg-white p-5 shadow-xl">
            <Landmark className="h-6 w-6 text-[#131313]" />
            <h3 className="mt-4 text-xl font-semibold text-[#131313]">Verifying bank details</h3>
            <p className="mt-1 text-sm text-[#636363]">
                This may take up-to few mins. Please wait. Do not refresh or close this page.
            </p>
            <div className="mt-6 flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-[#131313]" />
                <span className="text-sm font-medium text-[#131313]">Verifying with your bank</span>
            </div>
        </div>
    </div>
);
