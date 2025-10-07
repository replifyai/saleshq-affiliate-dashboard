import React from 'react';
import { cn } from '@/lib/utils';
import { Facebook, Instagram, Youtube, Ticket } from 'lucide-react';
import { Order } from './types';

interface ChannelBadgeProps {
  channel: Order['channel'];
}

const ChannelBadge: React.FC<ChannelBadgeProps> = ({ channel }) => {
  const channelConfig = {
    facebook: { label: 'Facebook', icon: Facebook, color: 'bg-blue-500/20 text-blue-600 border-blue-500/30' },
    instagram: { label: 'Instagram', icon: Instagram, color: 'bg-pink-500/20 text-pink-600 border-pink-500/30' },
    youtube: { label: 'YouTube', icon: Youtube, color: 'bg-red-500/20 text-red-600 border-red-500/30' },
    coupon: { label: 'Coupon', icon: Ticket, color: 'bg-green-500/20 text-green-600 border-green-500/30' },
  };

  const config = channelConfig[channel];
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.color
    )}>
      <config.icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

export default ChannelBadge;