import React from 'react';
import { Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import TextField from '@/components/common/TextField';

interface OrdersFiltersProps {
  paymentStatus: string;
  orderNumber: string;
  onPaymentStatusChange: (value: string) => void;
  onOrderNumberChange: (value: string) => void;
  onClearFilters: () => void;
}

const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  paymentStatus,
  orderNumber,
  onPaymentStatusChange,
  onOrderNumberChange,
  onClearFilters,
}) => {
  const hasActiveFilters = paymentStatus || orderNumber;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Filter Icon/Indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </div>

        {/* Payment Status Filter */}
        <div className="flex-1 min-w-[180px] max-w-[220px]">
          <select
            value={paymentStatus}
            onChange={(e) => onPaymentStatusChange(e.target.value)}
            className={cn(
              'w-full px-3 py-2 text-sm rounded-lg border-2 transition-all',
              'bg-card text-foreground',
              'border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20',
              'hover:border-primary/50',
              paymentStatus && 'border-primary/50 bg-primary/5'
            )}
          >
            <option value="">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Order Number Filter */}
        <div className="flex-1 min-w-[200px] max-w-[280px]">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => onOrderNumberChange(e.target.value)}
            placeholder="Search by order number..."
            className={cn(
              'w-full px-3 py-2 text-sm rounded-lg border-2 transition-all',
              'bg-card text-foreground placeholder:text-muted-foreground',
              'border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20',
              'hover:border-primary/50',
              orderNumber && 'border-primary/50 bg-primary/5'
            )}
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border-2 transition-all',
              'bg-card text-muted-foreground border-border',
              'hover:border-primary/50 hover:text-foreground hover:bg-primary/5'
            )}
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default OrdersFilters;
