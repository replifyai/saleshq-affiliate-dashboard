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
    <div className="flex items-center gap-1.5">
      <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
      
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value, sortDirection)}
        className={cn(
          'px-2 py-1.5 text-xs rounded-lg border transition-all',
          'bg-card text-foreground',
          'border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30',
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
          'px-2 py-1.5 text-xs rounded-lg border transition-all',
          'bg-card text-foreground border-border',
          'hover:border-primary hover:bg-primary/5',
          'focus:outline-none focus:ring-1 focus:ring-primary/30'
        )}
        title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
      >
        {sortDirection === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
};

export default OrdersSort;
