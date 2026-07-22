'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, ContactRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import apiClient from '@/services/apiClient';
import KycFlow from './KycFlow';

/** ID card with the red error badge, per the Figma. */
const PanAlertIcon: React.FC = () => (
    <span className="relative inline-flex self-start">
        <ContactRound className="h-6 w-6 text-[#131313]" />
        <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#EF4444]">
            <X className="h-2 w-2 text-white" strokeWidth={5} />
        </span>
    </span>
);

/** Dashboard nudge for unverified creators: bottom sheet on mobile, centred modal on desktop.
 *  Dismissed for the session only — it comes back on reload until KYC is done. */
const KycNudge: React.FC = () => {
    const ref = useRef<HTMLDialogElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isFlowOpen, setIsFlowOpen] = useState(false);

    useEffect(() => {
        apiClient
            .getKycStatus()
            .then((response) => setIsOpen(response.kyc.status !== 'verified'))
            .catch((error) => console.error('Failed to fetch KYC status:', error));
    }, []);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        // Hide the nudge while the flow itself is on screen.
        const shouldShow = isOpen && !isFlowOpen;
        if (shouldShow && !dialog.open) dialog.showModal();
        if (!shouldShow && dialog.open) dialog.close();
    }, [isOpen, isFlowOpen]);

    return (
        <>
            <dialog
                ref={ref}
                onCancel={(e) => { e.preventDefault(); setIsOpen(false); }}
                className={cn(
                    'bg-transparent p-0 backdrop:bg-black/40',
                    // Mobile: pinned to the bottom as a sheet. Desktop: centred 600px card.
                    'm-0 mt-auto w-full max-w-none',
                    'md:m-auto md:w-[600px]',
                )}
            >
                <div
                    className={cn(
                        'flex flex-col gap-6 rounded-t-3xl bg-white p-5',
                        'md:gap-10 md:rounded-[20px] md:p-8 md:shadow-[0_3px_3px_rgba(0,0,0,0.05)]',
                    )}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-4">
                            <PanAlertIcon />
                            <h2 className="text-2xl font-medium leading-[1.15] text-black">
                                PAN &amp; Bank details not verified
                            </h2>
                        </div>
                        <button onClick={() => setIsOpen(false)} aria-label="Dismiss" className="text-black">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <p className="text-sm leading-[1.2] text-[#7E7E7E] md:text-lg">
                        Verify your PAN and bank account details for a smooth and easy Razorpay payouts.
                    </p>

                    <button
                        onClick={() => setIsFlowOpen(true)}
                        className="h-12 w-full rounded-[14px] bg-[#131313] font-semibold text-white transition-colors hover:bg-[#2a2a2a]"
                    >
                        Proceed to verify
                    </button>
                </div>
            </dialog>

            <KycFlow
                open={isFlowOpen}
                onClose={() => setIsFlowOpen(false)}
                onVerified={() => setIsOpen(false)}
            />
        </>
    );
};

export default KycNudge;
