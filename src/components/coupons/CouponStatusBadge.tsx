import React from 'react';
import { cn } from '@/lib/utils';
import { Coupon } from '@/types/api';

interface CouponStatusBadgeProps {
  status: Coupon['status'];
}

const CouponStatusBadge: React.FC<CouponStatusBadgeProps> = ({ status }) => {
  const statusStyles = {
    ACTIVE: 'bg-success/20 text-success border-success',
    INACTIVE: 'bg-muted text-muted-foreground border-[#FFD100]/30',
    PENDING: 'bg-warning/20 text-warning border-warning',
    EXPIRED: 'bg-destructive/20 text-destructive border-destructive',
  };

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-semibold border',
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
};

export default CouponStatusBadge;

