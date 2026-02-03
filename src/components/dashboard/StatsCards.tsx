'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  subLabel?: string;
  subValue?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subLabel, subValue, className }) => {
  return (
    <div className={cn(
      'bg-white border border-[#E5E5E5] rounded-2xl p-4 sm:p-5 hover:shadow-sm transition-shadow',
      className
    )}>
      <span className="inline-block px-[6px] py-[6px] border border-[#EAEAEA] rounded-full text-[14px] text-[#636363] mb-4">
        {label}
      </span>
      <p className="text-xl sm:text-2xl font-semibold text-[#131313]">{value}</p>
      {subLabel && subValue && (
        <p className="text-xs text-[#636363] mt-2">
          {subLabel}: <span className="text-red-500 font-medium">{subValue}</span>
        </p>
      )}
    </div>
  );
};

export interface StatsCardsProps {
  yourSales: string;
  totalOrders: string;
  commissionOnSales: string;
  payoutsIssued: string;
  nextPayout: string;
  nextPayoutDate: string;
  // Sub values for first row
  refundedAmount?: string;
  returnedOrders?: string;
  commissionLoss?: string;
  className?: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  yourSales,
  totalOrders,
  commissionOnSales,
  payoutsIssued,
  nextPayout,
  nextPayoutDate,
  refundedAmount,
  returnedOrders,
  commissionLoss,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      <StatCard 
        label="Your Sales" 
        value={yourSales} 
        subLabel="Refunded"
        subValue={refundedAmount}
      />
      <StatCard 
        label="Total Orders" 
        value={totalOrders} 
        subLabel="Returned"
        subValue={returnedOrders}
      />
      <StatCard 
        label="Commission On Sales" 
        value={commissionOnSales} 
        subLabel="Lost"
        subValue={commissionLoss}
      />
      <StatCard label="Payouts Issued" value={payoutsIssued} />
      <StatCard label="Next Payout" value={nextPayout} />
      <StatCard label="Next Payout Date" value={nextPayoutDate} />
    </div>
  );
};

export default StatsCards;
