import React from 'react';

const OrdersHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Track and monitor your affiliate orders</p>
        </div>
      </div>
    </div>
  );
};

export default OrdersHeader;