import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrdersSortProps {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (by: string, direction: 'asc' | 'desc') => void;
}

const OrdersSort: React.FC<OrdersSortProps> = ({
  sortBy,
  sortDirection,
  onSortChange,
}) => {
  const sortFields = [
    { value: 'createdAt', label: 'Date' },
    { value: 'totalAmount', label: 'Order Value' },
    { value: 'commissionAmount', label: 'Commission' },
    { value: 'orderNumber', label: 'Order Number' },
  ];

  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <ArrowUpDown className="w-4 h-4" />
        <span>Sort by</span>
      </div>
      
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value, sortDirection)}
        className={cn(
          'px-3 py-2 text-sm rounded-lg border-2 transition-all',
          'bg-card text-foreground',
          'border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20',
          'hover:border-primary/50'
        )}
      >
        {sortFields.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => onSortChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc')}
        className={cn(
          'px-3 py-2 text-sm rounded-lg border-2 transition-all',
          'bg-card text-foreground border-border',
          'hover:border-primary hover:bg-primary/5',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20'
        )}
        title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
      >
        {sortDirection === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
};

export default OrdersSort;
