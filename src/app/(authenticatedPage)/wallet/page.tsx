'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/contexts/ProfileContext';
import { useSnackbar } from '@/components/snackbar';
import { apiClient } from '@/services/apiClient';
import {
  AvailablePayoutData,
  LedgerEntry,
  PayoutHistoryEntry,
  PaymentMethodsResponse,
} from '@/types/api';
import {
  ArrowRight,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Wallet,
  ArrowDownToLine,
  Receipt,
  History,
  Info,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

// ============================================================================
// Sub-Components
// ============================================================================

type TabType = 'ledger' | 'history';

// --- Status Badge ---
const PayoutStatusBadge: React.FC<{ status: PayoutHistoryEntry['status'] }> = ({ status }) => {
  const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    approved: {
      label: 'Approved',
      className: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      icon: <Clock className="w-3 h-3" />,
    },
    processing: {
      label: 'Processing',
      className: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
    },
    processed: {
      label: 'Completed',
      className: 'text-green-700 bg-green-50 border-green-200',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    completed: {
      label: 'Completed',
      className: 'text-green-700 bg-green-50 border-green-200',
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    failed: {
      label: 'Failed',
      className: 'text-red-700 bg-red-50 border-red-200',
      icon: <XCircle className="w-3 h-3" />,
    },
    reversed: {
      label: 'Reversed',
      className: 'text-red-700 bg-red-50 border-red-200',
      icon: <XCircle className="w-3 h-3" />,
    },
  };

  const c = config[status] || config.processing;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${c.className}`}>
      {c.icon}
      {c.label}
    </span>
  );
};

// --- Ledger Status Badge ---
const LedgerStatusBadge: React.FC<{ isEligible: boolean; status: string }> = ({ isEligible, status }) => {
  if (status === 'void' || status === 'partially_voided') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border text-red-700 bg-red-50 border-red-200">
        <XCircle className="w-3 h-3" />
        Cancelled
      </span>
    );
  }
  if (status === 'paid') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border text-blue-700 bg-blue-50 border-blue-200">
        <CheckCircle2 className="w-3 h-3" />
        Paid
      </span>
    );
  }
  if (isEligible) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border text-green-700 bg-green-50 border-green-200">
        <CheckCircle2 className="w-3 h-3" />
        Eligible
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border text-[#636363] bg-[#F5F5F5] border-[#E5E5E5]">
      <Clock className="w-3 h-3" />
      Pending
    </span>
  );
};

// --- Wallet Header ---
const WalletHeader: React.FC<{ lastRefreshed: Date; onRefresh: () => void; isRefreshing: boolean }> = ({
  lastRefreshed,
  onRefresh,
  isRefreshing,
}) => {
  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="hidden lg:flex items-center gap-3">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#131313]">Wallet</h1>
      <span className="text-sm text-[#BCBCBC]">Last refreshed: {formatTime(lastRefreshed)}</span>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="p-1.5 rounded-lg hover:bg-[#F5F5F5] text-[#BCBCBC] hover:text-[#131313] transition-colors disabled:opacity-50"
        aria-label="Refresh"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};

const BalanceCard: React.FC<{
  payout: AvailablePayoutData;
  onWithdraw: () => void;
  isWithdrawing: boolean;
  hasPaymentMethod: boolean;
}> = ({ payout, onWithdraw, isWithdrawing, hasPaymentMethod }) => {
  const router = useRouter();
  const availableAmount = parseFloat(payout.available.amount) || 0;
  const pendingTotal = parseFloat(payout.pending.totalAmount) || 0;

  const pendingBuckets = [
    {
      label: 'Not Shipped',
      amount: parseFloat(payout.pending.unfulfilled.amount) || 0,
      count: payout.pending.unfulfilled.count,
      description: 'Orders placed but not yet shipped/delivered by the brand.'
    },
    {
      label: 'Return Window',
      amount: parseFloat(payout.pending.inWindow.amount) || 0,
      count: payout.pending.inWindow.count,
      description: 'Orders delivered but still in the 7-day return/refund window.'
    },
    {
      label: 'Awaiting Cycle',
      amount: parseFloat(payout.pending.inCycle.amount) || 0,
      count: payout.pending.inCycle.count,
      description: 'Money is safe! Waiting for the platform\'s official Payout Day to be available.'
    },
  ].filter(b => b.amount > 0 || b.count > 0);

  return (
    <div className="relative bg-gradient-to-br from-[#FFE887] via-[#FFD54F] to-[#FFC107] rounded-2xl sm:rounded-3xl p-5 sm:p-8 overflow-hidden">
      {/* Decorative Vectors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img src="/Vector (1).svg" alt="" className="absolute -top-4 right-0 w-[400px] sm:w-[520px] opacity-100" />
        <img src="/Vector.svg" alt="" className="absolute bottom-0 right-0 w-[500px] sm:w-[640px] opacity-100" />
      </div>

      <div className="relative z-10">
        {/* Available Balance */}
        <p className="text-sm sm:text-base text-[#636363] mb-1 sm:mb-2">Available to Withdraw</p>
        <h2 className="text-4xl sm:text-6xl font-bold text-[#131313]">
          ₹{availableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </h2>

        {/* Pending Breakdown */}
        <div className="flex flex-col gap-2 mt-4">
          {pendingBuckets.length > 0 ? (
            <>
              <span className="text-sm font-medium text-[#636363]">Pending processing:</span>
              <div className="flex flex-wrap gap-2">
                {pendingBuckets.map((bucket) => (
                  <div
                    key={bucket.label}
                    className="group relative inline-flex items-center justify-center gap-1.5 text-xs bg-white/60 px-2.5 py-1.5 rounded-full border border-white/40"
                  >
                    <span className="text-[#636363] leading-none">{bucket.label}:</span>
                    <span className="font-semibold text-[#131313] leading-none">
                      ₹{bucket.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    {bucket.count > 0 && <span className="text-[#8C8C8C] shrink-0 leading-none">({bucket.count})</span>}
                    <HelpCircle className="w-3.5 h-3.5 text-[#8C8C8C] cursor-help transition-colors group-hover:text-[#131313] shrink-0 self-center" />

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#131313] text-white text-[11px] leading-relaxed rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none text-center shadow-lg">
                      {bucket.description}
                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#131313]"></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <span className="text-sm font-medium text-[#636363]">
              Pending processing: <span className="font-semibold text-[#131313]">₹0.00</span>
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {!hasPaymentMethod ? (
            <button
              onClick={() => router.push('/profile')}
              className="px-6 py-3 rounded-full bg-[#131313] text-white font-medium text-sm hover:bg-[#2a2a2a] transition-colors inline-flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              Add Payment Method
            </button>
          ) : !payout.canPayout ? (
            <div>
              <button
                disabled
                className="px-6 py-3 rounded-full bg-[#131313]/40 text-white/70 font-medium text-sm cursor-not-allowed inline-flex items-center gap-2"
              >
                <ArrowDownToLine className="w-4 h-4" />
                Withdraw
              </button>
              {payout.reason && (
                <p className="text-xs text-[#636363] mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3 flex-shrink-0" />
                  {payout.reason}
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={onWithdraw}
              disabled={isWithdrawing}
              className="px-6 py-3 rounded-full bg-[#131313] text-white font-medium text-sm hover:bg-[#2a2a2a] transition-colors inline-flex items-center gap-2 disabled:opacity-50"
            >
              {isWithdrawing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowDownToLine className="w-4 h-4" />
              )}
              {isWithdrawing
                ? 'Processing...'
                : `Withdraw ₹${availableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Withdraw Confirmation Modal ---
const WithdrawModal: React.FC<{
  amount: string;
  isOpen: boolean;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ amount, isOpen, isProcessing, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const formattedAmount = parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
            <ArrowDownToLine className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#131313]">Confirm Withdrawal</h3>
            <p className="text-sm text-[#636363]">This action cannot be undone</p>
          </div>
        </div>

        <div className="bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl p-4 text-center">
          <p className="text-xs text-[#636363] mb-1">Amount</p>
          <p className="text-3xl font-bold text-[#131313]">₹{formattedAmount}</p>
        </div>

        <p className="text-xs text-[#636363] text-center">
          The amount will be transferred to your registered payment method. Processing typically takes 1–3 business days.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 px-4 py-3 rounded-full border border-[#E5E5E5] text-[#131313] hover:bg-[#F5F5F5] transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 px-4 py-3 rounded-full bg-[#131313] text-white hover:bg-[#2a2a2a] transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
            {isProcessing ? 'Processing...' : 'Withdraw'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Tab Selector ---
const TabSelector: React.FC<{ activeTab: TabType; onChange: (tab: TabType) => void }> = ({ activeTab, onChange }) => (
  <div className="flex gap-1 p-1 bg-[#F5F5F5] rounded-lg w-fit">
    <button
      onClick={() => onChange('ledger')}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'ledger'
        ? 'bg-white text-[#131313] shadow-sm'
        : 'text-[#636363] hover:text-[#131313]'
        }`}
    >
      <Receipt className="w-4 h-4" />
      Earnings
    </button>
    <button
      onClick={() => onChange('history')}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'history'
        ? 'bg-white text-[#131313] shadow-sm'
        : 'text-[#636363] hover:text-[#131313]'
        }`}
    >
      <History className="w-4 h-4" />
      Payout History
    </button>
  </div>
);

// --- Earnings Ledger Table (Desktop) ---
const LedgerTable: React.FC<{ entries: LedgerEntry[] }> = ({ entries }) => {
  const formatDate = (ms: number | null) => {
    if (!ms) return '—';
    return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="hidden md:block bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E5E5E5]">
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Order</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Order Amount</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Commission</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Deduction</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Status</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Eligible On</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={entry.id} className={index !== entries.length - 1 ? 'border-b border-[#E5E5E5]' : ''}>
              <td className="px-6 py-4 text-sm font-medium text-[#131313]">{entry.orderNumber}</td>
              <td className="px-6 py-4 text-sm text-[#131313]">
                ₹{parseFloat(entry.basisAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-green-600">
                ₹{parseFloat(entry.commissionAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-4 text-sm text-[#636363]">
                {entry.deductedAmount && parseFloat(entry.deductedAmount) > 0
                  ? `₹${parseFloat(entry.deductedAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                  : '—'}
              </td>
              <td className="px-6 py-4">
                <LedgerStatusBadge isEligible={entry.isEligible} status={entry.status} />
              </td>
              <td className="px-6 py-4 text-sm text-[#636363]">{formatDate(entry.eligibleAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Earnings Ledger Cards (Mobile) ---
const LedgerCards: React.FC<{ entries: LedgerEntry[] }> = ({ entries }) => {
  const formatDate = (ms: number | null) => {
    if (!ms) return '—';
    return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="md:hidden space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white border border-[#E5E5E5] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#131313] font-medium">{entry.orderNumber}</span>
            <LedgerStatusBadge isEligible={entry.isEligible} status={entry.status} />
          </div>
          <div className="border-t border-dashed border-[#E5E5E5] my-3" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#BCBCBC] mb-1">Commission</p>
              <p className="text-sm font-semibold text-green-600">
                ₹{parseFloat(entry.commissionAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#BCBCBC] mb-1">Eligible On</p>
              <p className="text-sm text-[#131313]">{formatDate(entry.eligibleAt)}</p>
            </div>
            {entry.deductedAmount && parseFloat(entry.deductedAmount) > 0 && (
              <div>
                <p className="text-xs text-[#BCBCBC] mb-1">Deduction</p>
                <p className="text-sm text-red-500">
                  ₹{parseFloat(entry.deductedAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-[#BCBCBC] mb-1">Order Amount</p>
              <p className="text-sm text-[#131313]">
                ₹{parseFloat(entry.basisAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Payout History Table (Desktop) ---
const HistoryTable: React.FC<{ payouts: PayoutHistoryEntry[] }> = ({ payouts }) => {
  const formatDate = (ms: number | null) => {
    if (!ms) return '—';
    return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="hidden md:block bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E5E5E5]">
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Date</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Payout ID</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Amount</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Commissions</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Deductions</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Status</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((payout, index) => (
            <tr key={payout.id} className={index !== payouts.length - 1 ? 'border-b border-[#E5E5E5]' : ''}>
              <td className="px-6 py-4 text-sm text-[#131313]">{formatDate(payout.createdAt)}</td>
              <td className="px-6 py-4 text-sm text-[#636363] font-mono">{payout.id.slice(0, 12)}…</td>
              <td className="px-6 py-4 text-sm font-semibold text-green-600">
                ₹{parseFloat(payout.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-4 text-sm text-[#131313]">{payout.commissionsCount}</td>
              <td className="px-6 py-4 text-sm text-[#636363]">
                {parseFloat(payout.deductionsAmount) > 0
                  ? `₹${parseFloat(payout.deductionsAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                  : '—'}
              </td>
              <td className="px-6 py-4">
                <PayoutStatusBadge status={payout.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Payout History Cards (Mobile) ---
const HistoryCards: React.FC<{ payouts: PayoutHistoryEntry[] }> = ({ payouts }) => {
  const formatDate = (ms: number | null) => {
    if (!ms) return '—';
    return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="md:hidden space-y-3">
      {payouts.map((payout) => (
        <div key={payout.id} className="bg-white border border-[#E5E5E5] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#131313] font-medium font-mono">{payout.id.slice(0, 12)}…</span>
            <PayoutStatusBadge status={payout.status} />
          </div>
          <div className="border-t border-dashed border-[#E5E5E5] my-3" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#BCBCBC] mb-1">Date</p>
              <p className="text-sm text-[#131313]">{formatDate(payout.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-[#BCBCBC] mb-1">Amount</p>
              <p className="text-sm font-semibold text-green-600">
                ₹{parseFloat(payout.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// Main Wallet Page
// ============================================================================

export default function WalletPage() {
  const { state } = useProfile();
  const { showSuccess, showError } = useSnackbar();

  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('history');

  // Data
  const [payoutData, setPayoutData] = useState<AvailablePayoutData | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [history, setHistory] = useState<PayoutHistoryEntry[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodsResponse['methods'] | null>(null);

  // Withdraw flow
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const [availableRes, ledgerRes, historyRes, methodsRes] = await Promise.allSettled([
        apiClient.getAvailablePayout(),
        apiClient.getEarningsLedger(),
        apiClient.getPayoutHistory(),
        apiClient.getPaymentMethods(),
      ]);

      if (availableRes.status === 'fulfilled') {
        setPayoutData(availableRes.value.payout);
      }
      if (ledgerRes.status === 'fulfilled') {
        setLedger(ledgerRes.value.ledger);
      }
      if (historyRes.status === 'fulfilled') {
        setHistory(historyRes.value.history);
      }
      if (methodsRes.status === 'fulfilled') {
        setPaymentMethods(methodsRes.value.methods);
      }

      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error loading wallet data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleWithdraw = async () => {
    if (!payoutData) return;

    setIsWithdrawing(true);
    try {
      const result = await apiClient.requestPayout();
      showSuccess(
        `Withdrawal of ₹${parseFloat(result.payout.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} initiated successfully! ${result.payout.commissionsIncluded} commission(s) included.`
      );
      setShowWithdrawModal(false);
      // Refresh data after successful withdrawal
      await fetchData(true);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to process withdrawal');
    } finally {
      setIsWithdrawing(false);
    }
  };

  // --- Loading state ---
  if (!state.profile || isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-3 border-[#131313] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[#BCBCBC]">Loading wallet...</p>
        </div>
      </div>
    );
  }

  // --- Error state: no payout data ---
  if (!payoutData) {
    return (
      <div className="min-h-screen bg-[#F0F0F0]">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <WalletHeader lastRefreshed={lastRefreshed} onRefresh={() => fetchData(true)} isRefreshing={isRefreshing} />
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center">
            <AlertCircle className="w-12 h-12 text-[#BCBCBC] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#131313] mb-2">Unable to Load Wallet</h3>
            <p className="text-sm text-[#636363] mb-4">We couldn&apos;t fetch your wallet data. Please try again.</p>
            <button
              onClick={() => fetchData()}
              className="px-6 py-3 rounded-full bg-[#131313] text-white font-medium text-sm hover:bg-[#2a2a2a] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasPaymentMethod = paymentMethods ? paymentMethods.hasBank || paymentMethods.hasUpi : payoutData.hasPaymentMethod;

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <WalletHeader lastRefreshed={lastRefreshed} onRefresh={() => fetchData(true)} isRefreshing={isRefreshing} />

        {/* Balance Card */}
        <BalanceCard
          payout={payoutData}
          onWithdraw={() => setShowWithdrawModal(true)}
          isWithdrawing={isWithdrawing}
          hasPaymentMethod={hasPaymentMethod}
        />

        {/* Deductions Info */}
        {parseFloat(payoutData.available.deductions) > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <span className="text-sm text-yellow-700">
              ₹{parseFloat(payoutData.available.deductions).toLocaleString('en-IN', { minimumFractionDigits: 2 })} in deductions will be applied to your next payout.
            </span>
          </div>
        )}

        {/* Tabs + Content */}
        <div className="space-y-4">
          <TabSelector activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'ledger' && (
            <>
              {ledger.length === 0 ? (
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center">
                  <Receipt className="w-10 h-10 text-[#BCBCBC] mx-auto mb-3" />
                  <p className="text-[#636363] text-sm">No earnings yet. Commissions from your orders will appear here.</p>
                </div>
              ) : (
                <>
                  <LedgerTable entries={ledger} />
                  <LedgerCards entries={ledger} />
                </>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <>
              {history.length === 0 ? (
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center">
                  <History className="w-10 h-10 text-[#BCBCBC] mx-auto mb-3" />
                  <p className="text-[#636363] text-sm">No payouts yet. Your withdrawal history will appear here.</p>
                </div>
              ) : (
                <>
                  <HistoryTable payouts={history} />
                  <HistoryCards payouts={history} />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Withdraw Confirmation Modal */}
      <WithdrawModal
        amount={payoutData.available.amount}
        isOpen={showWithdrawModal}
        isProcessing={isWithdrawing}
        onConfirm={handleWithdraw}
        onCancel={() => !isWithdrawing && setShowWithdrawModal(false)}
      />
    </div>
  );
}
