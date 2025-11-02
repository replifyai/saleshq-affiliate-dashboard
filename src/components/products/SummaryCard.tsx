import React from 'react';
import { cn } from '@/lib/utils';
import type { SummaryCard } from './types';

type SummaryCardProps = SummaryCard;

const SummaryCardComponent: React.FC<SummaryCardProps> = ({ title, value, subtitle, icon, trend, trendValue }) => (
  <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
    <div className="flex items-center justify-between mb-2">
      <div className="text-2xl">{icon}</div>
      {trend && trendValue && (
        <div className={cn(
          "text-sm font-medium px-2 py-1 rounded-full",
          trend === 'up' ? "text-success bg-success/10" : 
          trend === 'down' ? "text-destructive bg-destructive/10" : 
          "text-muted-foreground bg-muted/10"
        )}>
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
    <div className="text-sm text-muted-foreground">{title}</div>
    {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
  </div>
);

SummaryCardComponent.displayName = 'SummaryCard';

export default SummaryCardComponent;