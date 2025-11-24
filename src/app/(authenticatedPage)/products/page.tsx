'use client';

import React, { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useSnackbar } from '@/components/snackbar/use-snackbar';
import { mockProducts, mockCategories } from '@/components/products/mockData';
import { Share2, ArrowLeft, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---

interface SimpleProductCardProps {
  product: typeof mockProducts[0];
  showShare?: boolean;
  onShare?: (product: typeof mockProducts[0]) => void;
}

interface SimpleCategoryCardProps {
  category: typeof mockCategories[0];
  onClick: () => void;
}

// --- Components ---

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product, showShare = true, onShare }) => {
  return (
    <div className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Area - Using emoji/placeholder logic from mock data */}
      <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center relative overflow-hidden">
        <div className="text-6xl transform group-hover:scale-110 transition-transform duration-500">
          {product.image}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5">
        <div className="mb-4">
          <div className="text-xs font-medium text-primary mb-1 uppercase tracking-wider opacity-80">
            {product.category}
          </div>
          <h3 className="font-bold text-lg text-foreground leading-tight line-clamp-2">
            {product.name}
          </h3>
        </div>

        {showShare && (
          <button
            onClick={() => onShare?.(product)}
            className="w-full flex items-center justify-center gap-2 bg-primary text-black py-2.5 px-4 rounded-xl font-medium transition-transform active:scale-95 hover:bg-primary/90"
          >
            <Share2 size={18} />
            <span>Share Product</span>
          </button>
        )}
      </div>
    </div>
  );
};

const SimpleCategoryCard: React.FC<SimpleCategoryCardProps> = ({ category, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-card border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/20 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Package size={64} />
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {category.name}
      </h3>
      <p className="text-muted-foreground mb-4">
        {category.productCount} Products
      </p>
      
      <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        View Collection <ArrowLeft className="ml-2 rotate-180" size={16} />
      </div>
    </div>
  );
};

// --- Main Page Component ---

const ProductsPage: React.FC = () => {
  const { state: profileState } = useProfile();
  const { showSuccess, showError } = useSnackbar();
  
  const [activeTab, setActiveTab] = useState<'all' | 'categories'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Helper to generate slug
  const getSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

  // Generate Link Logic
  const generateLink = (type: 'product' | 'category', slug: string) => {
    if (typeof window === 'undefined') return '';
    const baseUrl = window.location.origin;
    const refId = profileState.profile?.id || 'guest';
    return `${baseUrl}/${type}/${slug}?ref=${refId}`;
  };

  const handleShare = (text: string, type: 'Product' | 'Collection') => {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess(`${type} link copied to clipboard!`);
    }).catch(() => {
      showError('Failed to copy link');
    });
  };

  const handleProductShare = (product: typeof mockProducts[0]) => {
    const link = generateLink('product', getSlug(product.name));
    handleShare(link, 'Product');
  };

  const handleCategoryShare = (categoryName: string) => {
    const link = generateLink('category', getSlug(categoryName));
    handleShare(link, 'Collection');
  };

  // Filter products for category view
  const categoryProducts = selectedCategory 
    ? mockProducts.filter(p => p.category === selectedCategory)
    : [];

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
            Marketplace
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover and share premium products with your audience.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted/30 p-1 rounded-xl w-fit mb-8">
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedCategory(null);
            }}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === 'all' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            All Products
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === 'categories'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            Categories
          </button>
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* ALL PRODUCTS TAB */}
          {activeTab === 'all' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockProducts.map((product) => (
                <SimpleProductCard 
                  key={product.id} 
                  product={product} 
                  onShare={handleProductShare}
                />
              ))}
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <>
              {/* Category List View */}
              {!selectedCategory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockCategories.map((category) => (
                    <SimpleCategoryCard 
                      key={category.name} 
                      category={category} 
                      onClick={() => setSelectedCategory(category.name)}
                    />
                  ))}
                </div>
              ) : (
                /* Category Detail View */
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/50 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSelectedCategory(null)}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                      >
                        <ArrowLeft size={24} />
                      </button>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{selectedCategory}</h2>
                        <p className="text-muted-foreground text-sm">
                          {categoryProducts.length} Products in this collection
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleCategoryShare(selectedCategory)}
                      className="flex items-center justify-center gap-2 bg-primary text-black py-3 px-6 rounded-xl font-medium transition-transform active:scale-95 hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                      <Share2 size={20} />
                      <span>Share Collection</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryProducts.map((product) => (
                      <SimpleProductCard 
                        key={product.id} 
                        product={product} 
                        showShare={false} // Requirement: Creator can only share the whole collection link
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductsPage;
