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
          'bg-gradient-to-br from-[#FFFAE6]/50 to-white text-foreground',
          'border-[#FFD100]/50 focus:border-[#FFD100] focus:outline-none focus:ring-1 focus:ring-[#FFD100]/30',
          'hover:border-[#FFD100]'
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
          'bg-gradient-to-br from-[#FFFAE6]/50 to-white text-foreground border-[#FFD100]/50',
          'hover:border-[#FFD100] hover:bg-[#FFFAE6]',
          'focus:outline-none focus:ring-1 focus:ring-[#FFD100]/30'
        )}
        title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
      >
        {sortDirection === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
};

export default OrdersSort;
