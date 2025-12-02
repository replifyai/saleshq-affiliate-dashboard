import React, { useEffect, useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import Button from '@/components/common/Button';
import TextField from '@/components/common/TextField';
import FilterDrawer from '@/components/common/FilterDrawer';

interface ProductsFiltersProps {
  activeTab: 'all' | 'products' | 'categories';
  setActiveTab: (tab: 'all' | 'products' | 'categories') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'commission' | 'sales' | 'newest';
  setSortBy: (sort: 'commission' | 'sales' | 'newest') => void;
}

const ProductsFilters: React.FC<ProductsFiltersProps> = (props) => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, sortBy, setSortBy } = props;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [draftSearchQuery, setDraftSearchQuery] = useState(searchQuery);
  const [draftSortBy, setDraftSortBy] = useState<'commission' | 'sales' | 'newest'>(sortBy);

  // Keep local draft state in sync with external state
  useEffect(() => {
    setDraftSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setDraftSortBy(sortBy);
  }, [sortBy]);

  const handleApply = () => {
    setSearchQuery(draftSearchQuery);
    setSortBy(draftSortBy);
    setIsDrawerOpen(false);
  };

  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      {/* Left: tab pills remain visible for quick switching */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'products', 'categories'] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className="capitalize"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Right: single compact filter trigger that opens drawer */}
      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-[#FFD100]/50 bg-gradient-to-br from-[#FFFAE6]/50 to-white px-3 py-1.5 text-xs sm:text-sm shadow-sm hover:border-[#FFD100] hover:bg-[#FFFAE6] hover:text-foreground transition-colors"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Filter className="h-3.5 w-3.5" />
        </span>
        <span className="font-medium tracking-tight hidden xs:inline">Search & sort</span>
        <span className="font-medium tracking-tight xs:hidden">Filters</span>
      </button>

      <FilterDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Product filters">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Search</label>
            <TextField
              placeholder="Search product or category…"
              value={draftSearchQuery}
              onChange={setDraftSearchQuery}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Sort by</label>
            <div className="relative">
              <select
                value={draftSortBy}
                onChange={(e) => setDraftSortBy(e.target.value as 'commission' | 'sales' | 'newest')}
                className="w-full appearance-none rounded-xl border border-border bg-input/80 px-3 py-2.5 pr-9 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-colors duration-150"
              >
                <option value="commission">Highest commission</option>
                <option value="sales">Most sales</option>
                <option value="newest">Newest added</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Adjust your filters, then apply them when you&apos;re ready.
          </p>

          <div className="mt-1 flex justify-end">
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold tracking-tight text-black hover:bg-primary-hover transition-colors"
            >
              Apply filters
            </button>
          </div>
        </div>
      </FilterDrawer>
    </div>
  );
};

export default ProductsFilters;