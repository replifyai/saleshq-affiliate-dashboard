import React from 'react';
import { cn } from '@/lib/utils';
import { Order } from './types';

interface PaymentStatusBadgeProps {
  status: Order['paymentStatus'];
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' },
    paid: { label: 'Paid', color: 'bg-green-500/20 text-green-600 border-green-500/30' },
    failed: { label: 'Failed', color: 'bg-red-500/20 text-red-600 border-red-500/30' },
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

export default PaymentStatusBadge;