'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  iconBg?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconBg = 'bg-primary',
  className,
}) => {
  return (
    <div className={cn('bg-gradient-to-br from-[#FFFAE6]/60 to-white rounded-2xl p-6 shadow-md border border-[#FFD100]/40 hover:border-[#FFD100]/60 transition-all', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', iconBg)}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
