'use client';

import React from 'react';

interface AccountStatisticsSectionProps {
  totalEarnings: number;
  commissionRate: number;
  joiningDate: string;
}

const AccountStatisticsSection: React.FC<AccountStatisticsSectionProps> = ({
  totalEarnings,
  commissionRate,
  joiningDate,
}) => {
  // Calculate days since joining
  const calculateDaysSinceJoined = (joiningDate: string): number => {
    const joinedDate = new Date(joiningDate);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - joinedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysSinceJoined = calculateDaysSinceJoined(joiningDate);

  return (
    <div className="bg-gradient-to-br from-[#FFFAE6]/60 to-white rounded-xl border border-[#FFD100]/40 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-foreground mb-6">Account Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFAE6]/60 border border-[#FFD100]/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent">{totalEarnings.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Earnings (₹)</div>
        </div>
        <div className="bg-[#FFFAE6]/60 border border-[#FFD100]/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{commissionRate}%</div>
          <div className="text-sm text-muted-foreground">Commission Rate</div>
        </div>
        <div className="bg-[#FFFAE6]/60 border border-[#FFD100]/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">{daysSinceJoined}</div>
          <div className="text-sm text-muted-foreground">Days Since Joined</div>
        </div>
      </div>
    </div>
  );
};

export default AccountStatisticsSection;