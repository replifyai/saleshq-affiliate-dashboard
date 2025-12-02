'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ChartSectionProps {
  className?: string;
}

const ChartSection: React.FC<ChartSectionProps> = ({ className }) => {
  const chartData = [
    { day: 'Mon', primary: 65, secondary: 80 },
    { day: 'Tue', primary: 75, secondary: 60 },
    { day: 'Wed', primary: 85, secondary: 70 },
    { day: 'Thu', primary: 70, secondary: 90 },
    { day: 'Fri', primary: 55, secondary: 65 },
    { day: 'Sat', primary: 80, secondary: 75 },
    { day: 'Sun', primary: 90, secondary: 95 },
  ];

  return (
    <div className={cn('bg-gradient-to-br from-[#FFFAE6]/60 to-white rounded-2xl p-6 shadow-md border border-[#FFD100]/40 hover:border-[#FFD100]/60 transition-all', className)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Total hours spent</h2>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">32 210</p>
          <p className="text-xs text-muted-foreground">Views</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between space-x-2 md:space-x-3 h-48">
        {chartData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-2">
            <div className="w-full flex items-end justify-center h-full space-x-1">
              {/* Primary Bar */}
              <div
                className="w-[45%] bg-primary rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{ height: `${data.primary}%` }}
              />
              {/* Secondary Bar */}
              <div
                className="w-[45%] bg-accent rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{ height: `${data.secondary}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">{data.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartSection;
