'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ChannelCardProps {
  name: string;
  handle: string;
  percentage: string;
  trend: 'up' | 'down';
  icon: string;
  iconBg: string;
}

interface ChannelsSectionProps {
  className?: string;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  name,
  handle,
  percentage,
  trend,
  icon,
  iconBg,
}) => {
  return (
    <div className="bg-background rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-border">
      <div className="flex flex-col items-center space-y-4">
        <div className={cn('w-16 h-16 rounded-full flex items-center justify-center', iconBg)}>
          <span className="text-3xl">{icon}</span>
        </div>
        <div className="text-center">
          <h4 className="font-bold text-foreground">{name}</h4>
          <p className="text-sm text-muted-foreground">{handle}</p>
        </div>
        <div className="flex items-center space-x-1">
          <span
            className={cn(
              'text-2xl font-bold',
              trend === 'up' ? 'text-success' : 'text-destructive'
            )}
          >
            {trend === 'up' ? '+' : ''}{percentage}
          </span>
        </div>
      </div>
    </div>
  );
};

const ChannelsSection: React.FC<ChannelsSectionProps> = ({ className }) => {
  const channels = [
    {
      name: 'Dribble',
      handle: '@grantart',
      percentage: '2%',
      trend: 'up' as const,
      icon: '🎨',
      iconBg: 'bg-pink-100',
    },
    {
      name: 'Behance',
      handle: '@grantart',
      percentage: '7%',
      trend: 'down' as const,
      icon: '🎯',
      iconBg: 'bg-blue-100',
    },
    {
      name: 'Envato',
      handle: '@robertgrant',
      percentage: '4%',
      trend: 'up' as const,
      icon: '🍀',
      iconBg: 'bg-green-100',
    },
    {
      name: 'Shopify',
      handle: '@robertgrant',
      percentage: '2%',
      trend: 'up' as const,
      icon: '🛍️',
      iconBg: 'bg-purple-100',
    },
  ];

  return (
    <div className={cn('bg-card rounded-2xl p-6 shadow-md border border-border', className)}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">Channels</h2>
        <p className="text-sm text-muted-foreground">
          Your statistics for<br />1 week period.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {channels.map((channel, index) => (
          <ChannelCard key={index} {...channel} />
        ))}
        
        {/* Full Stats Button */}
        <button className="bg-primary text-white rounded-2xl p-6 hover:opacity-90 transition-all duration-300 flex flex-col items-center justify-center space-y-2 group">
          <span className="text-lg font-bold">Full Stats</span>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ChannelsSection;
