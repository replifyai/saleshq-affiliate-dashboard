import React from 'react';
import { Package } from 'lucide-react';

const OrdersEmptyState: React.FC = () => {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl overflow-hidden p-12">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">No Orders Yet</h3>
        <p className="text-muted-foreground max-w-md">
          You haven&apos;t received any orders yet. Share your coupon codes and referral links to start earning commissions!
        </p>
      </div>
    </div>
  );
};

export default OrdersEmptyState;

