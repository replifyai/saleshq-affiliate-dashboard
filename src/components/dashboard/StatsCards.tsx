'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  tooltip?: string;
  valueClassName?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, tooltip, valueClassName, className }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className={cn(
      'bg-white border border-[#E5E5E5] rounded-2xl p-4 sm:p-5 hover:shadow-sm transition-shadow',
      className
    )}>
      <div className="flex items-center gap-1 mb-4">
        <span className="inline-block px-[6px] py-[6px] border border-[#EAEAEA] rounded-full text-[14px] text-[#636363]">
          {label}
        </span>
        {tooltip && (
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setShowTooltip(!showTooltip)}
              className="text-[#BCBCBC] hover:text-[#636363] transition-colors p-1"
              aria-label="More information"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {showTooltip && (
              <div
                ref={tooltipRef}
                className="absolute z-50 left-0 top-full mt-2 w-64 p-3 bg-[#131313] text-white text-xs rounded-lg shadow-lg"
              >
                <div className="absolute -top-1 left-3 w-2 h-2 bg-[#131313] transform rotate-45" />
                <p className="relative z-10">{tooltip}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <p className={cn('text-xl sm:text-2xl font-semibold text-[#131313]', valueClassName)}>{value}</p>
    </div>
  );
};

export interface StatsCardsProps {
  // Earnings metrics
  totalEarnings: string;
  pendingEarnings: string;
  paidEarnings: string;
  voidedEarnings: string;
  // Sales metrics
  netSales: string;
  totalOrders: string;
  averageOrderValue: string;
  // Order health metrics
  paidOrders: string;
  refundedOrders: string;
  returnRatio: string;
  className?: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalEarnings,
  pendingEarnings,
  paidEarnings,
  voidedEarnings,
  netSales,
  totalOrders,
  averageOrderValue,
  paidOrders,
  refundedOrders,
  returnRatio,
  className,
}) => {
  const refundRateValue = parseFloat(returnRatio);
  const refundRateClass = !isNaN(refundRateValue) && refundRateValue > 0 ? 'text-destructive/80' : '';

  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      <StatCard 
        label="Total Earnings" 
        value={totalEarnings} 
        tooltip="Your total commission earned from all successful orders to date"
        valueClassName="text-success/80"
      />
      <StatCard 
        label="Pending Payout" 
        value={pendingEarnings} 
        tooltip="Commission amount waiting to be paid out to you in the next payment cycle"
        valueClassName="text-success/70"
      />
      <StatCard 
        label="Already Paid" 
        value={paidEarnings} 
        tooltip="Total commission amount already transferred to your account"
        valueClassName="text-success/80"
      />
      <StatCard 
        label="Lost to Refunds" 
        value={voidedEarnings} 
        tooltip="Commission you would have earned but lost because customers requested refunds on their orders"
        valueClassName="text-destructive/80"
      />
      <StatCard 
        label="Net Sales" 
        value={netSales} 
        tooltip="Total revenue from your referrals after subtracting refunded amounts"
        valueClassName="text-success/80"
      />
      <StatCard 
        label="Total Orders" 
        value={totalOrders} 
        tooltip="Total number of orders placed using your coupon code or referral link"
      />
      <StatCard 
        label="Avg Order Value" 
        value={averageOrderValue} 
        tooltip="Average amount customers spend per order"
      />
      <StatCard 
        label="Successful Orders" 
        value={paidOrders} 
        tooltip="Orders that were completed and paid for"
        valueClassName="text-success/80"
      />
      <StatCard 
        label="Refund Rate" 
        value={returnRatio} 
        tooltip="Percentage of orders that were refunded. Industry average is typically 5-15%."
        valueClassName={refundRateClass}
      />
    </div>
  );
};

export default StatsCards;

