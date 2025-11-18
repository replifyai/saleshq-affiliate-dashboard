'use client';

import React, { useState, useMemo } from 'react';
import { useSnackbar } from '@/components/snackbar/use-snackbar';
import { Package, DollarSign, Target, Sparkles, Clock } from 'lucide-react';
import {
  SummaryCard,
  ProductCard,
  CategoryCard,
  ProductsHeader,
  ProductsFilters,
  DynamicInsights,
  ProductDetailModal,
  PerformanceChartModal,
  Product,
} from '@/components/products';
import type { SummaryCard as SummaryCardType } from '@/components/products/types';
import { mockProducts, mockCategories } from '@/components/products/mockData';

// Main Component
const ProductsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'categories'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'commission' | 'sales' | 'newest'>('commission');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const { showSuccess, showError } = useSnackbar();

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'commission':
          return b.commission - a.commission;
        case 'sales':
          return b.performance - a.performance;
        case 'newest':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });
  }, [searchQuery, sortBy]);

  const summaryCards: SummaryCardType[] = [
    {
      title: 'Total Affiliated Products',
      value: mockProducts.length,
      icon: <Package className="w-6 h-6" />,
      trend: 'up',
      trendValue: '+3 this week'
    },
    {
      title: 'Average Commission',
      value: `${(mockProducts.reduce((sum, p) => sum + p.commission, 0) / mockProducts.length).toFixed(1)}%`,
      icon: <DollarSign className="w-6 h-6" />,
      trend: 'up',
      trendValue: '+0.5%'
    },
    {
      title: 'Active Discounts',
      value: mockProducts.filter(p => p.referralDiscount > 0).length,
      icon: <Target className="w-6 h-6" />,
      trend: 'neutral',
      trendValue: 'Stable'
    },
    {
      title: 'Top Earning Category',
      value: 'Beauty',
      icon: <Sparkles className="w-6 h-6" />,
      trend: 'up',
      trendValue: '+12%'
    }
  ];

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCopyLink = async (link: string, productName: string) => {
    try {
      await navigator.clipboard.writeText(link);
      showSuccess(`Affiliate link for "${productName}" copied to clipboard!`, {
        duration: 3000
      });
    } catch {
      showError('Failed to copy link to clipboard. Please try again.', {
        duration: 3000
      });
    }
  };

  const handleViewChart = () => {
    setIsChartModalOpen(true);
  };

  return (
    <div className="relative w-full min-h-screen bg-background">
      {/* Coming Soon Overlay - Only covers products page content */}
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
        <div className="flex flex-col items-center text-center space-y-4 p-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Coming Soon</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Our products page is currently under development. Check back soon for exciting updates!
          </p>
        </div>
      </div>

      {/* Content behind overlay */}
      <div className="opacity-0 pointer-events-none hidden">
        {/* Notification Banner */}
      <div className="bg-primary/10 border-l-4 border-primary p-4 mb-6">
        <div className="flex items-center space-x-2">
          <div className="text-primary text-lg">🪄</div>
          <p className="text-sm text-foreground">
            Commission or discount rates may vary dynamically based on performance, campaign type, or product lifecycle. Updates will be reflected in real time.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <ProductsHeader />

        {/* Hero Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <SummaryCard key={index} {...card} />
          ))}
        </div>

        {/* Filters and Search */}
        <ProductsFilters
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Main Content */}
        {activeTab === 'all' || activeTab === 'products' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCategories.map((category, index) => (
              <CategoryCard key={index} category={category} />
            ))}
          </div>
        )}

        {/* Dynamic Insights */}
        <DynamicInsights />
      </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCopyLink={handleCopyLink}
        onViewChart={handleViewChart}
      />

      {/* Performance Chart Modal */}
      <PerformanceChartModal
        product={selectedProduct}
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
      />
    </div>
  );
};

export default ProductsPage;