import React from 'react';
import { cn } from '@/lib/utils';
import Button from '@/components/common/Button';
import { PaginationProps } from './types';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    // Handle single page case
    if (totalPages <= 1) {
      return [1];
    }

    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      // Only add totalPages if it's different from 1
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-card/50 border-t border-border/50">
      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} orders
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1"
        >
          Previous
        </Button>
        
        <div className="flex items-center space-x-1">
          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={cn(
                'px-3 py-1 text-sm rounded-lg transition-colors',
                page === currentPage
                  ? 'bg-primary text-white'
                  : page === '...'
                  ? 'text-muted-foreground cursor-default'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/20'
              )}
            >
              {page}
            </button>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;