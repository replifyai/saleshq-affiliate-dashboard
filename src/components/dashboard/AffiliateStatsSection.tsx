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

interface AffiliateStatsSectionProps {
  totalEarnings?: string;
  monthlyEarnings?: string;
  conversionRate?: string;
  totalClicks?: string;
  totalSales?: string;
  nextPayout?: string;
  className?: string;
}

const AffiliateStatsSection: React.FC<AffiliateStatsSectionProps> = ({
  totalEarnings = '₹1,24,300',
  monthlyEarnings = '₹18,900',
  conversionRate = '4.8%',
  totalClicks = '12,340',
  totalSales = '238',
  nextPayout = '₹0',
  className,
}) => {
	const { state } = useProfile();
	const completion = state.completionScore;
	const totalSteps = (completion?.completedCount || 0) + (completion?.leftCount || 0);
	const completionPercentage = totalSteps > 0 ? Math.round(((completion?.completedCount || 0) / totalSteps) * 100) : 0;
	const isLocked = completionPercentage < 100;

  return (
    <div className={cn('space-y-8', className)}>
      

      {/* Stats Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl"></div>
        <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
          <LockOverlay isLocked={isLocked} message="Complete all profile steps to unlock Your Performance." roundedClassName="rounded-3xl" />
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Your Performance</h2>
              <p className="text-muted-foreground">Track your affiliate performance trends</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-success/10 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-success font-medium">Live Tracking</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatItem
              label="Total Earnings"
              value={totalEarnings}
              tooltip="Total amount earned from all affiliate commissions since joining the program"
            />
            <StatItem 
              label="This Month's Earnings"
              value={monthlyEarnings}
              tooltip="Commission earned in the current calendar month from affiliate sales"
            />
            <StatItem 
              label="Conversion Rate"
              value={conversionRate}
              tooltip="Percentage of visitors who clicked your affiliate links and made a purchase"
            />
            <StatItem 
              label="Total Clicks"
              value={totalClicks}
              tooltip="Total number of clicks on your affiliate links across all channels"
            />
            <StatItem 
              label="Total Sales"
              value={totalSales}
              tooltip="Total number of purchases made through your affiliate links"
            />
            <StatItem 
              label="Next Payout"
              value={nextPayout}
              tooltip="Amount scheduled to be paid in the next commission payout cycle"
            />
          </div>
        </div>
      </div>

      {/* Tooltips */}
      <Tooltip id="tooltip-total-earnings" place="top" className="!bg-gray-900 !text-white !text-xs !max-w-xs !z-[9999]" />
      <Tooltip id="tooltip-this-month's-earnings" place="top" className="!bg-gray-900 !text-white !text-xs !max-w-xs !z-[9999]" />
      <Tooltip id="tooltip-conversion-rate" place="top" className="!bg-gray-900 !text-white !text-xs !max-w-xs !z-[9999]" />
      <Tooltip id="tooltip-total-clicks" place="top" className="!bg-gray-900 !text-white !text-xs !max-w-xs !z-[9999]" />
      <Tooltip id="tooltip-total-sales" place="top" className="!bg-gray-900 !text-white !text-xs !max-w-xs !z-[9999]" />
      <Tooltip id="tooltip-next-payout" place="top" className="!bg-gray-900 !text-white !text-xs !max-w-xs !z-[9999]" />

    </div>
  );
};

export default AffiliateStatsSection;
