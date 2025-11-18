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

  // If there are no items, don't render pagination
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 sm:gap-3 items-stretch sm:items-center sm:flex-row sm:justify-between px-3 sm:px-4 py-3 sm:py-4 bg-card/50 border-t border-border/50 rounded-b-3xl">
      <div className="text-[11px] sm:text-sm text-muted-foreground text-center sm:text-left">
        Showing {startItem} to {endItem} of {totalItems} orders
      </div>

      <div className="flex flex-col xs:flex-row items-center justify-center gap-1.5 sm:gap-2">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2.5 sm:px-3 py-1 text-xs sm:text-sm"
          >
            Prev
          </Button>

          {/* Compact info on very small screens */}
          <div className="flex sm:hidden items-center justify-center px-1 text-[11px] text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>

          {/* Numbered pages on sm+ screens */}
          <div className="hidden sm:flex items-center space-x-1">
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
            className="px-2.5 sm:px-3 py-1 text-xs sm:text-sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;