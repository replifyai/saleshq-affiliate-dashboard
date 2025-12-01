import React from 'react';

const OrdersHeader: React.FC = () => {
  return (
    <div className="mb-4 sm:mb-6 md:mb-8">
      <div className="flex items-center space-x-3 mb-2 sm:mb-3 md:mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track and monitor your affiliate orders</p>
        </div>
      </div>
    </div>
  );
};

export default OrdersHeader;