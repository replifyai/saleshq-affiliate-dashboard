'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import apiClient from '@/services/apiClient';
import { useProfile } from '@/contexts/ProfileContext';
import { useBankVerification, BankVerifyingOverlay } from './bankVerification';
import {
    validatePan,
    validateDob,
    validateAccountNumber,
    validateIfsc,
    dobToIso,
    maskDob,
} from './validators';

type Step = 'pan' | 'bank' | 'done';

const STEP_INDEX: Record<Step, number> = { pan: 1, bank: 2, done: 3 };
const TOTAL_STEPS = 3;

/** Full-screen on mobile, centered card on desktop. <dialog> gives us the backdrop,
 *  Esc handling and focus trap for free. */
const Shell: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({
    open,
    onClose,
    children,
}) => {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            onCancel={(e) => { e.preventDefault(); onClose(); }}
            onClose={onClose}
            className={cn(
                'backdrop:bg-black/40 p-0 bg-transparent',
                // Mobile: fill the viewport. Desktop: centred card.
                'm-0 w-full h-full max-w-none max-h-none',
                'md:m-auto md:h-auto md:w-[440px] md:max-h-[90vh]',
            )}
        >
            {children}
        </dialog>
    );
};

const Field: React.FC<{
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    error?: string;
    inputMode?: 'text' | 'numeric';
    autoFocus?: boolean;
}> = ({ label, value, onChange, placeholder, error, inputMode = 'text', autoFocus }) => (
    <div>
        <label className="block text-sm text-[#636363] mb-1.5">
            {label}
            <span className="text-[#636363]">*</span>
        </label>
        <input
            type="text"
            inputMode={inputMode}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            aria-invalid={!!error}
            className={cn(
                'w-full px-4 py-3.5 rounded-xl border border-[#E5E5E5] text-[#131313]',
                'placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#131313] transition-colors',
                error && 'border-red-500 focus:border-red-500',
            )}
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
);

const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    children,
    className,
    ...props
}) => (
    <button
        {...props}
        className={cn(
            'w-full h-14 rounded-[14px] bg-[#131313] text-white font-semibold',
            'flex items-center justify-center gap-2 transition-colors hover:bg-[#2a2a2a]',
            'disabled:bg-[#131313]/20 disabled:hover:bg-[#131313]/20 disabled:cursor-not-allowed',
            className,
        )}
    >
        {children}
    </button>
);

/** The "Fetching details" / "Verifying bank details" overlays that sit on top of a step. */
const BusyCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}> = ({ icon, title, subtitle, children }) => (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 p-5">
        <div className="w-full max-w-[338px] rounded-3xl bg-white p-5 shadow-xl">
            {icon}
            <h3 className="mt-4 text-xl font-semibold text-[#131313]">{title}</h3>
            <p className="mt-1 text-sm text-[#636363]">{subtitle}</p>
            {children}
        </div>
    </div>
);

export interface KycFlowProps {
    open: boolean;
    onClose: () => void;
    onVerified?: () => void;
    /** Current server-side KYC state, so a reopened flow resumes at the right step instead
     *  of making an already-verified creator re-do PAN. */
    panVerified?: boolean;
    bankVerified?: boolean;
}

/** Where a freshly-opened flow should land given what's already verified. */
const firstStep = (panVerified: boolean, bankVerified: boolean): Step =>
    !panVerified ? 'pan' : !bankVerified ? 'bank' : 'done';

const KycFlow: React.FC<KycFlowProps> = ({
    open,
    onClose,
    onVerified,
    panVerified = false,
    bankVerified = false,
}) => {
    const [step, setStep] = useState<Step>('pan');

    const [pan, setPan] = useState('');
    const [dob, setDob] = useState('');
    const [isFetchingPan, setIsFetchingPan] = useState(false);

    const [accountNumber, setAccountNumber] = useState('');
    const [ifsc, setIfsc] = useState('');

    const bank = useBankVerification();
    const { state: profileState } = useProfile();

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    const busy = isFetchingPan || bank.isVerifying;

    // Reset everything when the flow is reopened, so a cancelled attempt doesn't leak in.
    // Resume at the first unverified step rather than always restarting at PAN.
    useEffect(() => {
        if (!open) return;
        setStep(firstStep(panVerified, bankVerified));
        setPan('');
        setDob('');
        setAccountNumber('');
        setIfsc('');
        setErrors({});
        setFormError(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, panVerified, bankVerified]);

    const handleVerifyPan = async () => {
        const nextErrors = {
            pan: validatePan(pan) ?? '',
            dob: validateDob(dob) ?? '',
        };
        if (nextErrors.pan || nextErrors.dob) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        setFormError(null);
        setIsFetchingPan(true);
        try {
            // The identity behind the PAN is deliberately never read back to the user: any
            // logged-in creator could otherwise type a stranger's PAN and harvest the name
            // and DOB registered against it. The backend owns the name match.
            await apiClient.verifyPan({ pan: pan.toUpperCase(), dob: dobToIso(dob) });
            setStep('bank');
        } catch (error) {
            setFormError(error instanceof Error ? error.message : 'Could not verify your PAN. Try again.');
        } finally {
            setIsFetchingPan(false);
        }
    };

    const handleVerifyBank = async () => {
        const nextErrors: Record<string, string> = {
            accountNumber: validateAccountNumber(accountNumber) ?? '',
            ifsc: validateIfsc(ifsc) ?? '',
        };
        if (Object.values(nextErrors).some(Boolean)) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        setFormError(null);

        // The holder name is not typed — it's the creator's profile name, same as the
        // profile page's Save Bank Details path. The backend matches the name at the bank
        // against the PAN name server-side; the client never sees either.
        const verified = await bank.verify({
            accountNumber,
            ifscCode: ifsc.toUpperCase(),
            accountName: profileState.profile?.name || '',
        });
        if (verified) {
            setStep('done');
            onVerified?.();
        }
    };

    const canSubmitPan = pan.length > 0 && dob.length > 0;
    const canSubmitBank = accountNumber.length > 0 && ifsc.length > 0;

    return (
        <Shell open={open} onClose={onClose}>
            <div className="relative flex h-full flex-col bg-white md:h-auto md:rounded-2xl">
                {/* Header: back arrow on mobile, close on desktop. */}
                <div className="flex items-center justify-between px-5 pt-5 md:px-6">
                    <button
                        onClick={onClose}
                        aria-label="Close verification"
                        disabled={busy}
                        className="text-[#131313] disabled:opacity-40"
                    >
                        <ArrowLeft className="h-6 w-6 md:hidden" />
                        <X className="hidden h-5 w-5 md:block" />
                    </button>
                </div>

                {/* Progress: 3 steps. Hidden on desktop, where each step is its own modal. */}
                {step !== 'done' && (
                    <div
                        className="mx-5 mt-4 flex gap-1 md:hidden"
                        role="progressbar"
                        aria-valuenow={STEP_INDEX[step]}
                        aria-valuemin={1}
                        aria-valuemax={TOTAL_STEPS}
                        aria-label="Verification progress"
                    >
                        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                            <span
                                key={i}
                                className={cn(
                                    'h-1 flex-1 rounded-full',
                                    i < STEP_INDEX[step] ? 'bg-[#2563EB]' : 'bg-[#E5E5E5]',
                                )}
                            />
                        ))}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto px-5 pt-6 md:px-6">
                    {step === 'pan' && (
                        <>
                            <p className="text-sm text-[#636363]">KYC &amp; Verification</p>
                            <h2 className="mt-1 text-2xl font-semibold text-[#131313]">PAN Card details</h2>
                            <div className="mt-6 space-y-5">
                                <Field
                                    label="PAN Card"
                                    value={pan}
                                    onChange={(v) => setPan(v.toUpperCase().slice(0, 10))}
                                    placeholder="Enter your 10 digit PAN card"
                                    error={errors.pan}
                                    autoFocus
                                />
                                <Field
                                    label="DOB"
                                    value={dob}
                                    onChange={(v) => setDob(maskDob(v))}
                                    placeholder="dd/mm/yyyy"
                                    error={errors.dob}
                                    inputMode="numeric"
                                />
                            </div>
                        </>
                    )}

                    {step === 'bank' && (
                        <>
                            <p className="text-sm text-[#636363]">Bank details verification</p>
                            <h2 className="mt-1 text-2xl font-semibold text-[#131313]">
                                Enter your bank details
                            </h2>

                            <div className="mt-5 space-y-5">
                                <Field
                                    label="Account Number"
                                    value={accountNumber}
                                    onChange={(v) => setAccountNumber(v.replace(/\D/g, '').slice(0, 18))}
                                    placeholder="Enter bank account number"
                                    error={errors.accountNumber}
                                    inputMode="numeric"
                                    autoFocus
                                />
                                <Field
                                    label="IFSC Code"
                                    value={ifsc}
                                    onChange={(v) => setIfsc(v.toUpperCase().slice(0, 11))}
                                    placeholder="e.g. SBIN0001234"
                                    error={errors.ifsc}
                                />
                            </div>

                            <p className="mt-5 text-sm text-[#636363]">
                                Use an account in your own name — it must match your PAN. INR 1 will be sent to it to
                                validate &amp; verify the details.
                            </p>
                        </>
                    )}

                    {step === 'done' && (
                        <div className="pt-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                                <Check className="h-6 w-6 text-white" strokeWidth={3} />
                            </div>
                            <h2 className="mt-5 text-2xl font-semibold text-[#131313]">
                                Your PAN and Bank details are verified!
                            </h2>
                            <p className="mt-2 text-sm text-[#636363]">
                                You&apos;ve confirmed your PAN card and Bank details. You can now enjoy smooth and easy
                                Razorpay payouts.
                            </p>
                        </div>
                    )}

                    {(formError || bank.error) && (
                        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {formError || bank.error}
                        </p>
                    )}
                </div>

                {/* Footer action, pinned to the bottom on mobile. */}
                <div className="px-5 pb-6 pt-5 md:px-6">
                    {step === 'pan' && (
                        <PrimaryButton onClick={handleVerifyPan} disabled={!canSubmitPan || busy}>
                            Verify
                        </PrimaryButton>
                    )}
                    {step === 'bank' && (
                        <PrimaryButton onClick={handleVerifyBank} disabled={!canSubmitBank || busy}>
                            Verify
                        </PrimaryButton>
                    )}
                    {step === 'done' && <PrimaryButton onClick={onClose}>Done</PrimaryButton>}
                </div>

                {isFetchingPan && (
                    <BusyCard
                        icon={<IdSearchIcon />}
                        title="Fetching details"
                        subtitle="Hold tight while we fetch your PAN card details. Do not close this page."
                    />
                )}

                {bank.isVerifying && <BankVerifyingOverlay />}
            </div>
        </Shell>
    );
};

// The id-card-with-magnifier mark from the Figma. No lucide equivalent, so it's inline.
const IdSearchIcon: React.FC = () => (
    <svg viewBox="0 0 64 64" fill="none" className="mx-auto h-20 w-20" aria-hidden="true">
        <rect x="4" y="12" width="46" height="34" rx="5" stroke="#93B4F5" strokeWidth="3" />
        <circle cx="19" cy="26" r="5" stroke="#93B4F5" strokeWidth="3" />
        <path d="M11 39c2-4 5-6 8-6s6 2 8 6" stroke="#93B4F5" strokeWidth="3" strokeLinecap="round" />
        <path d="M34 22h10M34 29h10" stroke="#93B4F5" strokeWidth="3" strokeLinecap="round" />
        <circle cx="42" cy="42" r="12" fill="white" stroke="#2563EB" strokeWidth="3" />
        <path d="M51 51l7 7" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

export default KycFlow;
