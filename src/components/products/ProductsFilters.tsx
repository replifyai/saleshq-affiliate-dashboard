import React from 'react';
import Button from '@/components/common/Button';
import TextField from '@/components/common/TextField';

interface ProductsFiltersProps {
  activeTab: 'all' | 'products' | 'categories';
  setActiveTab: (tab: 'all' | 'products' | 'categories') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'commission' | 'sales' | 'newest';
  setSortBy: (sort: 'commission' | 'sales' | 'newest') => void;
}

const ProductsFilters: React.FC<ProductsFiltersProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="flex space-x-2">
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
      
      <div className="flex-1 max-w-md">
        <TextField
          placeholder="Search product or category…"
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full"
        />
      </div>
      
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as 'commission' | 'sales' | 'newest')}
        className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="commission">Sort by: Highest Commission</option>
        <option value="sales">Sort by: Most Sales</option>
        <option value="newest">Sort by: Newest Added</option>
      </select>
    </div>
  );
};

export default ProductsFilters;