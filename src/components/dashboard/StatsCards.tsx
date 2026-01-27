'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, className }) => {
  return (
    <div className={cn(
      'bg-white border border-[#E5E5E5] rounded-2xl p-4 sm:p-5 hover:shadow-sm transition-shadow',
      className
    )}>
      <span className="inline-block px-[6px] py-[6px] border border-[#EAEAEA] rounded-full text-[14px] text-[#636363] mb-4">
        {label}
      </span>
      <p className="text-xl sm:text-2xl font-semibold text-[#131313]">{value}</p>
    </div>
  );
};

interface StatsCardsProps {
  yourSales: string;
  totalOrders: string;
  commissionOnSales: string;
  payoutsIssued: string;
  nextPayout: string;
  nextPayoutDate: string;
  className?: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  yourSales,
  totalOrders,
  commissionOnSales,
  payoutsIssued,
  nextPayout,
  nextPayoutDate,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      <StatCard label="Your sales" value={yourSales} />
      <StatCard label="Total Orders" value={totalOrders} />
      <StatCard label="Your Commission" value={commissionOnSales} />
      <StatCard label="Payouts issued" value={payoutsIssued} />
      <StatCard label="Next Payout" value={nextPayout} />
      <StatCard label="Next payout date" value={nextPayoutDate} />
    </div>
  );
};

export default StatsCards;

