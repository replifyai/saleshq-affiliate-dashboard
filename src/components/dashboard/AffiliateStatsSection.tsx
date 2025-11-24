'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip } from 'react-tooltip';
import { useProfile } from '@/contexts/ProfileContext';
import LockOverlay from '@/components/LockOverlay';

interface StatItemProps {
  label: string;
  value: string;
  showCopy?: boolean;
  onCopy?: () => void;
  tooltip?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, showCopy, onCopy, tooltip }) => {
  return (
    <div className="relative group rounded-2xl h-full bg-gradient-to-br from-primary/20 to-primary/5">
      <div className="relative bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col justify-between min-h-[120px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">{label}</span>
            {tooltip && (
              <button
                className="p-1 rounded-full hover:bg-muted-foreground/10 transition-colors"
                aria-label="More information"
                data-tooltip-id={`tooltip-${label.replace(/\s+/g, '-').toLowerCase()}`}
                data-tooltip-content={tooltip}
              >
                <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-foreground">{value}</span>
          {showCopy && (
            <button
              onClick={onCopy}
              className="p-2 rounded-xl hover:bg-primary/10 transition-all duration-200 group-hover:scale-110"
              aria-label="Copy code"
            >
              <svg className="w-5 h-5 text-primary group-hover:text-primary-hover" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import { StatusMapEntry } from '@/types/api';

interface AffiliateStatsSectionProps {
  totalOrders?: string;
  totalCoupons?: string;
  totalEarningsTillDate?: string;
  earningsStatusMap?: Record<string, StatusMapEntry>;
  ordersStatusMap?: Record<string, StatusMapEntry>;
  className?: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatLabel = (key: string) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const AffiliateStatsSection: React.FC<AffiliateStatsSectionProps> = ({
  totalOrders = '0',
  totalCoupons = '0',
  totalEarningsTillDate = '₹0',
  earningsStatusMap,
  ordersStatusMap,
  className,
}) => {
	const { state } = useProfile();
	const completion = state.completionScore;
	const totalSteps = (completion?.completedCount || 0) + (completion?.leftCount || 0);
	const completionPercentage = totalSteps > 0 ? Math.round(((completion?.completedCount || 0) / totalSteps) * 100) : 0;
	const isLocked = completionPercentage < 100;

  return (
    <div className={cn('space-y-6 sm:space-y-8', className)}>
      

      {/* Stats Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl"></div>
        <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-border/50">
          <LockOverlay isLocked={isLocked} message="Complete all profile steps to unlock Your Performance." roundedClassName="rounded-3xl" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Your Performance</h2>
              <p className="text-muted-foreground">Track your affiliate performance trends</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-success/10 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-success font-medium">Live Tracking</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatItem
              label="Total Orders"
              value={totalOrders}
              tooltip="Total number of orders placed through your affiliate links"
            />
            <StatItem 
              label="Total Coupons"
              value={totalCoupons}
              tooltip="Total number of coupons created and distributed"
            />
            <StatItem 
              label="Total Earnings"
              value={totalEarningsTillDate}
              tooltip="Total amount earned from all affiliate commissions since joining the program"
            />
            
            {/* Dynamic Earnings Status Items */}
            {earningsStatusMap && Object.entries(earningsStatusMap).map(([key, data]) => (
              <StatItem
                key={`earnings-${key}`}
                label={formatLabel(key)}
                value={data.amount ? formatCurrency(data.amount) : data.count.toString()}
                tooltip={`${data.count} payment${data.count !== 1 ? 's' : ''} ${formatLabel(key).toLowerCase()}`}
              />
            ))}

            {/* Dynamic Orders Status Items */}
            {ordersStatusMap && Object.entries(ordersStatusMap).map(([key, data]) => (
              <StatItem
                key={`orders-${key}`}
                label={`${formatLabel(key)} Orders`}
                value={data.count.toString()}
                tooltip={`Total ${data.count} orders with status ${formatLabel(key).toLowerCase()}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tooltips */}
      <Tooltip id="tooltip-total-orders" place="top" className="!bg-gray-900 !text-white !text-xs !max-w-xs !z-[9999]" />
      <Tooltip id="tooltip-total-coupons" place="top" className="!bg-gray-900 !text-white !text-xs !max-w-xs !z-[9999]" />
      <Tooltip id="tooltip-total-earnings" place="top" className="!bg-gray-900 !text-white !text-xs !max-w-xs !z-[9999]" />
      
      {/* Dynamic Tooltips */}
      {earningsStatusMap && Object.keys(earningsStatusMap).map((key) => (
        <Tooltip key={`tooltip-earnings-${key}`} id={`tooltip-${formatLabel(key).replace(/\s+/g, '-').toLowerCase()}`} place="top" className="!bg-gray-900 !text-white !text-xs !max-w-xs !z-[9999]" />
      ))}
      {ordersStatusMap && Object.keys(ordersStatusMap).map((key) => (
        <Tooltip key={`tooltip-orders-${key}`} id={`tooltip-${formatLabel(key).replace(/\s+/g, '-').toLowerCase()}-orders`} place="top" className="!bg-gray-900 !text-white !text-xs !max-w-xs !z-[9999]" />
      ))}

    </div>
  );
};

export default AffiliateStatsSection;
