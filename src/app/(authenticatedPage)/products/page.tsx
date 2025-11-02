'use client';

import React, { useState, useMemo } from 'react';
import { useSnackbar } from '@/components/snackbar/use-snackbar';
import { Package, DollarSign, Target, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
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