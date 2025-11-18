import React, { useEffect, useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import FilterDrawer from '@/components/common/FilterDrawer';

interface OrdersFiltersProps {
  paymentStatus: string;
  orderNumber: string;
  onPaymentStatusChange: (value: string) => void;
  onOrderNumberChange: (value: string) => void;
  onClearFilters: () => void;
}

const OrdersFilters: React.FC<OrdersFiltersProps> = (props) => {
  const { paymentStatus, orderNumber, onPaymentStatusChange, onOrderNumberChange, onClearFilters } = props;
  const hasActiveFilters = paymentStatus || orderNumber;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [draftPaymentStatus, setDraftPaymentStatus] = useState(paymentStatus);
  const [draftOrderNumber, setDraftOrderNumber] = useState(orderNumber);

  // Keep local draft state in sync when external filters change (e.g. clear from parent)
  useEffect(() => {
    setDraftPaymentStatus(paymentStatus);
  }, [paymentStatus]);

  useEffect(() => {
    setDraftOrderNumber(orderNumber);
  }, [orderNumber]);

  const handleApply = () => {
    onPaymentStatusChange(draftPaymentStatus);
    onOrderNumberChange(draftOrderNumber);
    setIsDrawerOpen(false);
  };

  return (
    <div className="mb-4 sm:mb-6">
      {/* Top bar with trigger and compact summary */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 sm:px-4 py-1.5 text-xs sm:text-sm',
            'shadow-sm hover:border-primary/60 hover:bg-primary/5 hover:text-foreground transition-colors'
          )}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Filter className="h-3.5 w-3.5" />
          </span>
          <span className="font-medium tracking-tight">Filters</span>
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              Active
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Drawer with full filter controls */}
      <FilterDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Order filters">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Payment status</label>
            <div className="relative">
              <select
                value={draftPaymentStatus}
                onChange={(e) => setDraftPaymentStatus(e.target.value)}
                className={cn(
                  'w-full appearance-none rounded-xl border border-border bg-input/80 px-3 py-2.5 pr-9 text-sm text-foreground shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60',
                  'transition-colors duration-150',
                  paymentStatus && 'border-primary/70 bg-primary/10'
                )}
              >
                <option value="">All payment status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Order number</label>
            <input
              type="text"
              value={draftOrderNumber}
              onChange={(e) => setDraftOrderNumber(e.target.value)}
              placeholder="Search by order number…"
              className={cn(
                'w-full rounded-lg border border-border bg-input px-3 py-2 text-sm',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/40',
                orderNumber && 'border-primary/70 bg-primary/5'
              )}
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  onClearFilters();
                  setDraftPaymentStatus('');
                  setDraftOrderNumber('');
                  setIsDrawerOpen(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:border-primary/60 hover:bg-primary/5 hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </button>
            )}

            <button
              type="button"
              onClick={handleApply}
              className="ml-auto inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold tracking-tight text-black hover:bg-primary-hover transition-colors"
            >
              Apply filters
            </button>
          </div>
        </div>
      </FilterDrawer>
    </div>
  );
};

export default OrdersFilters;
