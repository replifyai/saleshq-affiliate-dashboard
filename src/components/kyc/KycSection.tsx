'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KycStatusResponse } from '@/types/api';
import apiClient from '@/services/apiClient';
import KycFlow from './KycFlow';
import { useBankVerification, BankVerifyingOverlay } from './bankVerification';
import { validateAccountNumber, validateIfsc } from './validators';

const STATUS_BADGE: Record<KycStatusResponse['kyc']['status'], { label: string; className: string }> = {
    not_verified: { label: 'Not Verified', className: 'bg-red-50 text-red-600' },
    pending: { label: 'In Progress', className: 'bg-amber-50 text-amber-600' },
    verified: { label: 'Verified', className: 'bg-green-50 text-green-600' },
    failed: { label: 'Verification Failed', className: 'bg-red-50 text-red-600' },
};

const Field: React.FC<{
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    error?: string;
    inputMode?: 'text' | 'numeric';
}> = ({ label, value, onChange, placeholder, error, inputMode = 'text' }) => (
    <div>
        <label className="mb-1.5 block text-sm font-medium text-[#131313]">{label}</label>
        <input
            type="text"
            inputMode={inputMode}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            aria-invalid={!!error}
            className={cn(
                'w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-sm text-[#131313]',
                'placeholder:text-[#BCBCBC] focus:border-[#131313] focus:outline-none transition-colors',
                error && 'border-red-500 focus:border-red-500',
            )}
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
);

/** "KYC & Verification" on the profile page: PAN status + Verify, and the payout
 *  bank details, in one card — matching the Figma. */
const KycSection: React.FC = () => {
    const [kyc, setKyc] = useState<KycStatusResponse['kyc'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFlowOpen, setIsFlowOpen] = useState(false);

    const [accountNumber, setAccountNumber] = useState('');
    const [ifsc, setIfsc] = useState('');

    const bank = useBankVerification();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchStatus = async () => {
        try {
            const [kycResponse, methodsResponse] = await Promise.all([
                apiClient.getKycStatus(),
                apiClient.getPaymentMethods(),
            ]);
            setKyc(kycResponse.kyc);

            // Prefill from whatever is already saved. The account number comes back masked,
            // so it is only a hint — re-verifying requires typing it in full again.
            if (methodsResponse.methods.bankDetails) {
                setIfsc(methodsResponse.methods.bankDetails.ifscCode);
            }
        } catch (err) {
            console.error('Failed to load KYC section:', err);
            setError('Failed to load verification details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    useEffect(() => {
        if (!successMessage && !error) return;
        const timer = setTimeout(() => {
            setSuccessMessage(null);
            setError(null);
        }, 4000);
        return () => clearTimeout(timer);
    }, [successMessage, error]);

    const handleSaveBank = async (e: React.FormEvent) => {
        e.preventDefault();

        const nextErrors: Record<string, string> = {
            accountNumber: validateAccountNumber(accountNumber) ?? '',
            ifsc: validateIfsc(ifsc) ?? '',
        };
        if (Object.values(nextErrors).some(Boolean)) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        setError(null);
        setSuccessMessage(null);

        // Saving *is* verifying — there is no separate add/update call.
        const verified = await bank.verify({
            accountNumber,
            ifscCode: ifsc.toUpperCase(),
        });
        if (verified) {
            setSuccessMessage('Bank account verified and saved!');
            await fetchStatus();
        }
    };

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-semibold text-[#131313]">KYC &amp; Verification</h2>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#BCBCBC]" />
                    <span className="ml-2 text-[#BCBCBC]">Loading verification details...</span>
                </div>
            </div>
        );
    }

    const status = kyc?.status ?? 'not_verified';
    // The badge next to "PAN Card Details" is about the PAN specifically, not the overall
    // KYC — otherwise a verified PAN reads "In Progress" while the bank is still pending.
    const panBadge = kyc?.panVerified ? STATUS_BADGE.verified : STATUS_BADGE[status];

    return (
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-[#131313]">KYC &amp; Verification</h2>

            {successMessage && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-green-700">{successMessage}</span>
                </div>
            )}
            {(error || bank.error) && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                    <span className="text-sm text-red-600">{error || bank.error}</span>
                </div>
            )}

            {/* PAN */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#131313]">PAN Card Details</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${panBadge.className}`}>
                    {panBadge.label}
                </span>
            </div>

            <div className="mt-3 flex items-stretch overflow-hidden rounded-xl border border-[#E5E5E5]">
                <input
                    readOnly
                    value={kyc?.maskedPan ?? ''}
                    placeholder="XXXXXXXXXX"
                    aria-label="PAN card number"
                    className="min-w-0 flex-1 px-4 py-3 text-sm text-[#131313] placeholder:text-[#BCBCBC] focus:outline-none"
                />
                {!kyc?.panVerified && (
                    <button
                        onClick={() => setIsFlowOpen(true)}
                        className="flex-shrink-0 border-l border-[#E5E5E5] px-6 text-sm font-medium text-[#2563EB] hover:bg-[#F9F9F9]"
                    >
                        Verify
                    </button>
                )}
            </div>

            {/* Bank */}
            <h3 className="mb-3 mt-6 text-sm font-medium text-[#131313]">Bank Details</h3>

            <form onSubmit={handleSaveBank} className="space-y-4">
                <Field
                    label="Account Number"
                    value={accountNumber}
                    onChange={(v) => setAccountNumber(v.replace(/\D/g, '').slice(0, 18))}
                    placeholder="Enter bank account number"
                    error={errors.accountNumber}
                    inputMode="numeric"
                />
                <Field
                    label="IFSC Code"
                    value={ifsc}
                    onChange={(v) => setIfsc(v.toUpperCase().slice(0, 11))}
                    placeholder="E.G. SBIN0001234"
                    error={errors.ifsc}
                />

                <p className="text-sm text-[#636363]">
                    Note: INR 1 will be sent to your Bank Account to validate &amp; verify the details
                </p>

                <button
                    type="submit"
                    disabled={bank.isVerifying}
                    className={cn(
                        'flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#131313]',
                        'font-medium text-white transition-colors hover:bg-[#2a2a2a]',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                    )}
                >
                    {bank.isVerifying && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Bank Details
                </button>
            </form>

            {bank.isVerifying && <BankVerifyingOverlay />}

            <KycFlow
                open={isFlowOpen}
                panVerified={!!kyc?.panVerified}
                bankVerified={!!kyc?.bankVerified}
                onClose={() => { setIsFlowOpen(false); fetchStatus(); }}
                onVerified={fetchStatus}
            />
        </div>
    );
};

export default KycSection;
