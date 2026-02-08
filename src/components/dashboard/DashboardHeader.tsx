'use client';

import React from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Calendar, Store } from 'lucide-react';

interface DashboardHeaderProps {
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ className }) => {
  const { state } = useProfile();
  
  const creatorName = state.profile?.name?.split(' ')[0] || 'there';
  const shopDomain = state.profile?.shopDomain;

  // Format shop domain for display (remove protocol if present)
  const formatShopDomain = (domain?: string) => {
    if (!domain) return null;
    return domain.replace(/^https?:\/\//, '');
  };
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
        <div>
        <p className="text-[#BCBCBC] text-sm">Hi {creatorName}!</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#131313]">{getGreeting()}</h1>
      </div>

      {/* Shop Domain and Date Filter */}
      <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
        {/* Shop Domain Badge */}
        {shopDomain && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#FFFAE6] border border-[#FFD100]/40 rounded-lg text-sm text-[#131313]">
            <Store className="w-4 h-4 text-[#FFD100]" />
            <span className="font-medium">{formatShopDomain(shopDomain)}</span>
          </div>
        )}

        {/* Date Filter */}
        <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E5E5] rounded-lg text-sm text-[#131313] hover:bg-[#F5F5F5] transition-colors">
          <Calendar className="w-4 h-4 text-[#BCBCBC]" />
          <span>Last 30 days</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
