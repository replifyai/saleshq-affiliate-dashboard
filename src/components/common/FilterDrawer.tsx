import React from 'react';
import { X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ isOpen, onClose, title = 'Filters', children }) => {
  return (
    <>
      {/* Trigger button is expected to be rendered by the parent. This component is only the drawer & overlay. */}

      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
          !isOpen && 'pointer-events-none opacity-0',
          isOpen && 'opacity-100'
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-md transform bg-card shadow-2xl border-l border-border',
          'transition-transform duration-300 ease-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Filters"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-medium sm:text-base">{title}</h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Refine the data without losing your place.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-colors"
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-4">
          {children}
        </div>

        {/* Subtle bottom shadow */}
        <div className="h-4 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
      </aside>
    </>
  );
};

export default FilterDrawer;


