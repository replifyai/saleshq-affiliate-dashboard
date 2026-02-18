'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/services/apiClient';
import { PaymentMethodsResponse, AddBankDetailsRequest, AddUpiDetailsRequest } from '@/types/api';
import { Building2, Smartphone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type TabType = 'bank' | 'upi';

const PaymentMethodSection: React.FC = () => {
    const [methods, setMethods] = useState<PaymentMethodsResponse['methods'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('bank');
    const [showForm, setShowForm] = useState(false);

    // Bank form state
    const [bankForm, setBankForm] = useState<AddBankDetailsRequest>({
        accountNumber: '',
        ifscCode: '',
        accountName: '',
    });

    // UPI form state
    const [upiForm, setUpiForm] = useState<AddUpiDetailsRequest>({
        upiId: '',
    });

    const fetchPaymentMethods = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiClient.getPaymentMethods();
            setMethods(response.methods);
        } catch (err) {
            console.error('Failed to fetch payment methods:', err);
            setError('Failed to load payment methods');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const handleAddBank = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bankForm.accountNumber || !bankForm.ifscCode || !bankForm.accountName) {
            setError('All bank details fields are required');
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await apiClient.addBankDetails(bankForm);
            setSuccessMessage('Bank account added successfully!');
            setBankForm({ accountNumber: '', ifscCode: '', accountName: '' });
            setShowForm(false);
            await fetchPaymentMethods();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add bank details');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddUpi = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!upiForm.upiId) {
            setError('UPI ID is required');
            return;
        }

        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await apiClient.addUpiDetails(upiForm);
            setSuccessMessage('UPI ID added successfully!');
            setUpiForm({ upiId: '' });
            setShowForm(false);
            await fetchPaymentMethods();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add UPI details');
        } finally {
            setIsSaving(false);
        }
    };

    // Clear messages after 4 seconds
    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
                setError(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, error]);

    if (isLoading) {
        return (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#131313] mb-6">Payment Methods</h2>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#BCBCBC]" />
                    <span className="ml-2 text-[#BCBCBC]">Loading payment methods...</span>
                </div>
            </div>
        );
    }

    const hasAnyMethod = methods?.hasBank || methods?.hasUpi;

    return (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#131313]">Payment Methods</h2>
                {hasAnyMethod && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-sm font-medium text-[#131313] hover:text-[#636363] transition-colors px-4 py-2 rounded-lg border border-[#E5E5E5] hover:border-[#BCBCBC]"
                    >
                        + Update
                    </button>
                )}
            </div>

            {/* Status Messages */}
            {successMessage && (
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-green-700">{successMessage}</span>
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-600">{error}</span>
                </div>
            )}

            {/* Existing Payment Methods */}
            {hasAnyMethod && !showForm && (
                <div className="space-y-4">
                    {methods?.hasBank && methods.bankDetails && (
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F9F9F9] border border-[#E5E5E5]">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#131313]">{methods.bankDetails.accountName}</p>
                                <p className="text-sm text-[#636363]">
                                    A/C: {methods.bankDetails.accountNumber} · IFSC: {methods.bankDetails.ifscCode}
                                </p>
                            </div>
                            {methods.preference === 'bank' && (
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                                    Primary
                                </span>
                            )}
                        </div>
                    )}
                    {methods?.hasUpi && (
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F9F9F9] border border-[#E5E5E5]">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                                <Smartphone className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#131313]">UPI</p>
                                <p className="text-sm text-[#636363]">Connected</p>
                            </div>
                            {methods?.preference === 'upi' && (
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                                    Primary
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Add Payment Method Form */}
            {(!hasAnyMethod || showForm) && (
                <div>
                    {!hasAnyMethod && (
                        <p className="text-sm text-[#636363] mb-4">
                            Add your bank account or UPI to receive payouts.
                        </p>
                    )}

                    {/* Tab Selector */}
                    <div className="flex gap-1 mb-5 p-1 bg-[#F5F5F5] rounded-lg">
                        <button
                            onClick={() => { setActiveTab('bank'); setError(null); }}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'bank'
                                    ? 'bg-white text-[#131313] shadow-sm'
                                    : 'text-[#636363] hover:text-[#131313]'
                                }`}
                        >
                            <Building2 className="w-4 h-4" />
                            Bank Account
                        </button>
                        <button
                            onClick={() => { setActiveTab('upi'); setError(null); }}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'upi'
                                    ? 'bg-white text-[#131313] shadow-sm'
                                    : 'text-[#636363] hover:text-[#131313]'
                                }`}
                        >
                            <Smartphone className="w-4 h-4" />
                            UPI
                        </button>
                    </div>

                    {/* Bank Form */}
                    {activeTab === 'bank' && (
                        <form onSubmit={handleAddBank} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#131313] mb-1.5">Account Holder Name</label>
                                <input
                                    type="text"
                                    value={bankForm.accountName}
                                    onChange={(e) => setBankForm(prev => ({ ...prev, accountName: e.target.value }))}
                                    placeholder="Enter account holder name"
                                    className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] text-[#131313] placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#131313] transition-colors text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#131313] mb-1.5">Account Number</label>
                                <input
                                    type="text"
                                    value={bankForm.accountNumber}
                                    onChange={(e) => setBankForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                                    placeholder="Enter bank account number"
                                    className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] text-[#131313] placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#131313] transition-colors text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#131313] mb-1.5">IFSC Code</label>
                                <input
                                    type="text"
                                    value={bankForm.ifscCode}
                                    onChange={(e) => setBankForm(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                                    placeholder="e.g. SBIN0001234"
                                    className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] text-[#131313] placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#131313] transition-colors text-sm uppercase"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                {showForm && (
                                    <button
                                        type="button"
                                        onClick={() => { setShowForm(false); setError(null); }}
                                        className="flex-1 px-4 py-3 rounded-full border border-[#E5E5E5] text-[#131313] hover:bg-[#F5F5F5] transition-colors font-medium text-sm"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-3 rounded-full bg-[#131313] text-white hover:bg-[#2a2a2a] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isSaving ? 'Saving...' : 'Save Bank Details'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* UPI Form */}
                    {activeTab === 'upi' && (
                        <form onSubmit={handleAddUpi} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#131313] mb-1.5">UPI ID</label>
                                <input
                                    type="text"
                                    value={upiForm.upiId}
                                    onChange={(e) => setUpiForm({ upiId: e.target.value })}
                                    placeholder="e.g. yourname@upi"
                                    className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] text-[#131313] placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#131313] transition-colors text-sm"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                {showForm && (
                                    <button
                                        type="button"
                                        onClick={() => { setShowForm(false); setError(null); }}
                                        className="flex-1 px-4 py-3 rounded-full border border-[#E5E5E5] text-[#131313] hover:bg-[#F5F5F5] transition-colors font-medium text-sm"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-3 rounded-full bg-[#131313] text-white hover:bg-[#2a2a2a] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isSaving ? 'Saving...' : 'Save UPI Details'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentMethodSection;
