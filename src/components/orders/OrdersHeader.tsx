'use client';

import React from 'react';

interface OrdersHeaderProps {
  lastRefreshed?: Date;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ lastRefreshed }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex items-center gap-3">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#131313]">Orders</h1>
      {lastRefreshed && (
        <span className="text-sm text-[#BCBCBC]">
          Last refreshed: {formatTime(lastRefreshed)}
        </span>
      )}
    </div>
  );
};

export default OrdersHeader;
