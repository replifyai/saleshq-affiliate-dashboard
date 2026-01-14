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
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#131313] mb-6">Account Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F9F9F9] border border-[#E5E5E5] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[#131313]">{totalEarnings.toLocaleString()}</div>
          <div className="text-sm text-[#636363]">Total Earnings (₹)</div>
        </div>
        <div className="bg-[#F9F9F9] border border-[#E5E5E5] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[#131313]">{commissionRate}%</div>
          <div className="text-sm text-[#636363]">Commission Rate</div>
        </div>
        <div className="bg-[#F9F9F9] border border-[#E5E5E5] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[#131313]">{daysSinceJoined}</div>
          <div className="text-sm text-[#636363]">Days Since Joined</div>
        </div>
      </div>
    </div>
  );
};

export default AccountStatisticsSection;