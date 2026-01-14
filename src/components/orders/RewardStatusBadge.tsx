'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type RewardStatus = 'cancelled' | 'pending' | 'issued' | 'payout_processed' | 'days_left';

interface RewardStatusBadgeProps {
  status: RewardStatus;
  daysLeft?: number;
  className?: string;
}

const RewardStatusBadge: React.FC<RewardStatusBadgeProps> = ({ status, daysLeft, className }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'bg-red-500 text-white',
        };
      case 'pending':
        return {
          label: 'Pending',
          className: 'text-[#BCBCBC]',
        };
      case 'issued':
        return {
          label: 'Issued',
          className: 'text-green-600 border border-green-200',
        };
      case 'payout_processed':
        return {
          label: 'Payout Processed',
          className: 'text-green-600',
        };
      case 'days_left':
        return {
          label: `${daysLeft || 7} days left`,
          className: 'text-[#D97706] border border-[#FCD34D] bg-[#FEF3C7]',
        };
      default:
        return {
          label: 'Unknown',
          className: 'text-[#BCBCBC]',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default RewardStatusBadge;

