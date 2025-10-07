import React from 'react';
import { cn } from '@/lib/utils';
import { Order } from './types';

interface StatusBadgeProps {
  status: Order['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' },
    processing: { label: 'Processing', color: 'bg-blue-500/20 text-blue-600 border-blue-500/30' },
    shipped: { label: 'Shipped', color: 'bg-purple-500/20 text-purple-600 border-purple-500/30' },
    delivered: { label: 'Delivered', color: 'bg-green-500/20 text-green-600 border-green-500/30' },
    cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-600 border-red-500/30' },
    refunded: { label: 'Refunded', color: 'bg-gray-500/20 text-gray-600 border-gray-500/30' },
  };

  const config = statusConfig[status];
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config.color
    )}>
      {config.label}
    </span>
  );
};

export default StatusBadge;