'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { ArrowRight } from 'lucide-react';

// Types
interface PayoutRecord {
  id: string;
  payoutId: string;
  issuedOn: string;
  reward: number;
  status: 'Issued' | 'Payout Processed' | 'Pending';
  payoutLink?: string;
}

// Mock data for payouts (will be replaced with API data later)
const mockPayouts: PayoutRecord[] = [
  { id: '1', payoutId: 'P124', issuedOn: '23 Aug 2025', reward: 398.20, status: 'Issued', payoutLink: '#' },
  { id: '2', payoutId: 'P124', issuedOn: '23 Aug 2025', reward: 398.20, status: 'Issued', payoutLink: '#' },
  { id: '3', payoutId: 'P124', issuedOn: '23 Aug 2025', reward: 398.20, status: 'Issued', payoutLink: '#' },
  { id: '4', payoutId: 'P124', issuedOn: '23 Aug 2025', reward: 398.20, status: 'Payout Processed', payoutLink: '#' },
  { id: '5', payoutId: 'P124', issuedOn: '23 Aug 2025', reward: 398.20, status: 'Payout Processed', payoutLink: '#' },
  { id: '6', payoutId: 'P124', issuedOn: '02 Jul 25', reward: 398.20, status: 'Payout Processed', payoutLink: '#' },
  { id: '7', payoutId: 'P124', issuedOn: '02 Jul 25', reward: 398.20, status: 'Payout Processed', payoutLink: '#' },
];

// Status Badge Component
const StatusBadge: React.FC<{ status: PayoutRecord['status'] }> = ({ status }) => {
  const styles = {
    'Issued': 'text-green-600 border-green-200 bg-green-50',
    'Payout Processed': 'text-green-600',
    'Pending': 'text-[#636363]',
  };

  if (status === 'Payout Processed') {
    return (
      <span className="text-sm text-green-600 font-medium">
        {status}
      </span>
    );
  }

  return (
    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
};

// Wallet Header Component
const WalletHeader: React.FC<{ lastRefreshed: Date }> = ({ lastRefreshed }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="hidden lg:flex items-center gap-3">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#131313]">Wallet</h1>
      <span className="text-sm text-[#BCBCBC]">
        Last refreshed: {formatTime(lastRefreshed)}
      </span>
    </div>
  );
};

// Balance Card Component
const BalanceCard: React.FC<{ balance: number; nextPayoutDate: string }> = ({ balance, nextPayoutDate }) => {
  return (
    <div className="relative bg-gradient-to-br from-[#FFE887] via-[#FFD54F] to-[#FFC107] rounded-2xl sm:rounded-3xl p-5 sm:p-8 overflow-hidden">
      {/* Decorative Vector SVGs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top wave */}
        <img 
          src="/Vector (1).svg" 
          alt="" 
          className="absolute -top-4 right-0 w-[400px] sm:w-[520px] opacity-100"
        />
        {/* Bottom wave */}
        <img 
          src="/Vector.svg" 
          alt="" 
          className="absolute bottom-0 right-0 w-[500px] sm:w-[640px] opacity-100"
        />
      </div>

      {/* Next Payout Badge - Positioned differently for mobile/desktop */}
      <div className="hidden sm:flex absolute top-6 right-6 bg-white rounded-xl px-4 py-2 items-center gap-4 shadow-sm z-10">
        <span className="text-sm text-[#636363]">Next Payout</span>
        <span className="text-sm font-semibold text-green-600">{nextPayoutDate}</span>
      </div>

      {/* Balance Content */}
      <div className="relative z-10">
        <p className="text-sm sm:text-base text-[#636363] mb-1 sm:mb-2">Available Balance</p>
        <h2 className="text-4xl sm:text-6xl font-bold text-[#131313]">
          ₹{balance.toLocaleString('en-IN')}
        </h2>
      </div>

      {/* Mobile Next Payout - Below the card on mobile */}
      <div className="sm:hidden mt-6 flex items-center justify-between text-sm relative z-10">
        <span className="text-[#636363]">Next Payout</span>
        <span className="font-semibold text-green-600">{nextPayoutDate}</span>
      </div>
    </div>
  );
};

// Payout History Table (Desktop)
const PayoutTable: React.FC<{ payouts: PayoutRecord[] }> = ({ payouts }) => {
  return (
    <div className="hidden md:block bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E5E5E5]">
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Issued on</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Payout ID</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Reward</th>
            <th className="text-left px-6 py-4 text-sm font-medium text-[#BCBCBC]">Reward Status</th>
            <th className="text-right px-6 py-4 text-sm font-medium text-[#BCBCBC]"></th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((payout, index) => (
            <tr 
              key={payout.id} 
              className={index !== payouts.length - 1 ? 'border-b border-[#E5E5E5]' : ''}
            >
              <td className="px-6 py-4 text-sm text-[#131313]">{payout.issuedOn}</td>
              <td className="px-6 py-4 text-sm text-[#131313]">{payout.payoutId}</td>
              <td className="px-6 py-4 text-sm font-semibold text-green-600">
                ₹{payout.reward.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={payout.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <a 
                  href={payout.payoutLink} 
                  className="inline-flex items-center gap-1 text-sm text-[#636363] hover:text-[#131313] transition-colors"
                >
                  view Payout Link
                  <ArrowRight className="w-4 h-4" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Payout History Cards (Mobile)
const PayoutCards: React.FC<{ payouts: PayoutRecord[] }> = ({ payouts }) => {
  return (
    <div className="md:hidden space-y-3">
      {payouts.map((payout) => (
        <div 
          key={payout.id}
          className="bg-white border border-[#E5E5E5] rounded-2xl p-4"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#131313] font-medium">ID: {payout.payoutId}</span>
            <StatusBadge status={payout.status} />
          </div>
          
          {/* Dashed Divider */}
          <div className="border-t border-dashed border-[#E5E5E5] my-3"></div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#BCBCBC] mb-1">Issued on</p>
              <p className="text-sm text-[#131313]">{payout.issuedOn}</p>
            </div>
            <div>
              <p className="text-xs text-[#BCBCBC] mb-1">Reward</p>
              <p className="text-sm font-semibold text-green-600">₹{payout.reward.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Wallet Page
export default function WalletPage() {
  const { state } = useProfile();
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  
  // Mock wallet data (will come from API later)
  const [walletBalance] = useState(2200);
  const [nextPayoutDate] = useState('09 Dec 2025');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setPayouts(mockPayouts);
      setLastRefreshed(new Date());
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!state.profile) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-3 border-[#131313] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#BCBCBC]">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-3 border-[#131313] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#BCBCBC]">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header - Desktop only */}
        <WalletHeader lastRefreshed={lastRefreshed} />

        {/* Balance Card */}
        <BalanceCard balance={walletBalance} nextPayoutDate={nextPayoutDate} />

        {/* Payout History Section */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-[#131313]">Payout History</h2>
          
          {payouts.length === 0 ? (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center">
              <p className="text-[#BCBCBC]">No payout history yet</p>
            </div>
          ) : (
            <>
              <PayoutTable payouts={payouts} />
              <PayoutCards payouts={payouts} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

