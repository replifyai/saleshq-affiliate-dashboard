'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useSnackbar } from '@/components/snackbar/use-snackbar';
import { Search, SlidersHorizontal, ArrowUpDown, Copy, Star, ArrowLeft, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import apiClient from '@/services/apiClient';
import { Product } from '@/components/products/types';
import { ProductCollection } from '@/types/api';

// --- Product Card Component ---
interface ProductCardProps {
  product: Product;
  onShare: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onShare }) => {
  const images = product.images && product.images.length > 0
    ? product.images
    : (product.image ? [product.image] : []);
  const currentImage = images[0];

  // Mock data for rating and price (replace with actual data when available)
  const rating = 4.7;
  const reviewCount = '786+';
  const price = 2599;
  const originalPrice = 2999;
  const discount = '48% OFF';

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Rating Badge */}
      <div className="relative">
        <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-[10px] z-10">
          <Star className="w-2.5 h-2.5 fill-[#FFE887] text-[#FFE887]" />
          <span className="font-medium text-[#131313]">{rating}</span>
          <span className="text-[#BCBCBC]">({reviewCount})</span>
        </div>

        {/* Product Image */}
        <div className="aspect-square bg-[#F5F5F5] flex items-center justify-center">
          {currentImage && currentImage.startsWith('http') ? (
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-4xl">{currentImage || '📦'}</div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-[#131313] font-medium line-clamp-2 mb-1.5 sm:mb-2 min-h-[32px] sm:min-h-[40px]">
          {product.name}
        </p>

        {/* Category Tag */}
        <span className="inline-block px-2 py-0.5 bg-[#FFE887] text-[#131313] text-[10px] font-medium rounded mb-2 sm:mb-3">
          {product.category || 'Footwear'}
        </span>

        {/* Price */}
        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
          <span className="text-sm sm:text-base font-bold text-[#131313]">₹{price.toLocaleString('en-IN')}</span>
          <span className="text-xs text-[#BCBCBC] line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
          <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1 py-0.5 rounded">
            {discount}
          </span>
        </div>

        {/* Share Button */}
        <button
          onClick={() => onShare(product)}
          className="w-full py-2.5 sm:py-3 bg-[#FFE887] hover:bg-[#FFD54F] text-[#131313] font-semibold text-sm rounded-xl transition-colors"
        >
          Share
        </button>
      </div>
    </div>
  );
};

// --- Collection Card Component ---
interface CollectionCardProps {
  collection: ProductCollection;
  onCopy: (collection: ProductCollection) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onCopy }) => {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 sm:p-5 flex items-center justify-between hover:shadow-sm transition-shadow">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#131313] truncate">{collection.name}</p>
        <p className="text-sm text-[#BCBCBC]">{collection.productIds.length} products</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCopy(collection);
        }}
        className="ml-3 p-2.5 rounded-xl bg-[#FFE887] hover:bg-[#FFD54F] transition-colors flex-shrink-0"
        aria-label="Copy collection link"
      >
        <Copy className="w-4 h-4 text-[#131313]" />
      </button>
    </div>
  );
};

// --- Products Header Component ---
interface ProductsHeaderProps {
  lastRefreshed: Date;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ lastRefreshed }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex items-center gap-3">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#131313]">Featured Products</h1>
      <span className="text-sm text-[#BCBCBC]">
        Last refreshed: {formatTime(lastRefreshed)}
      </span>
    </div>
  );
};

// --- Products Tabs Component ---
type ProductTab = 'products' | 'collections';

interface ProductsTabsProps {
  activeTab: ProductTab;
  onTabChange: (tab: ProductTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  categories: string[];
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (by: string, direction: 'asc' | 'desc') => void;
}

const ProductsTabs: React.FC<ProductsTabsProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  sortBy,
  sortDirection,
  onSortChange,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const sortOptions = [
    { label: 'Name (A-Z)', value: 'name', direction: 'asc' as const },
    { label: 'Name (Z-A)', value: 'name', direction: 'desc' as const },
    { label: 'Category (A-Z)', value: 'category', direction: 'asc' as const },
  ];

  const hasActiveFilters = categoryFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onTabChange('products')}
            className={cn(
              'text-sm font-medium pb-2 border-b-2 transition-colors',
              activeTab === 'products'
                ? 'text-[#131313] border-[#131313]'
                : 'text-[#BCBCBC] border-transparent hover:text-[#636363]'
            )}
          >
            Products
          </button>
          <button
            onClick={() => onTabChange('collections')}
            className={cn(
              'text-sm font-medium pb-2 border-b-2 transition-colors',
              activeTab === 'collections'
                ? 'text-[#131313] border-[#131313]'
                : 'text-[#BCBCBC] border-transparent hover:text-[#636363]'
            )}
          >
            Collections
          </button>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BCBCBC]" />
            <input
              type="text"
              placeholder="Search for an Order"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-[#E5E5E5] rounded-lg text-sm placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#131313] transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="relative">
            <button
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsSortOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors",
                hasActiveFilters
                  ? "border-[#131313] bg-[#F5F5F5] text-[#131313]"
                  : "border-[#E5E5E5] text-[#636363] hover:bg-[#F5F5F5]"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-[100] p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#131313]">Filters</span>
                  <button onClick={() => setIsFilterOpen(false)}>
                    <X className="w-4 h-4 text-[#BCBCBC]" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs text-[#636363] mb-2">Category</label>
                  <div className="relative">
                    <select
                      value={categoryFilter}
                      onChange={(e) => onCategoryFilterChange(e.target.value)}
                      className="w-full appearance-none border border-[#E5E5E5] rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:border-[#131313] bg-white"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BCBCBC] pointer-events-none" />
                  </div>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full mt-4 px-3 py-2.5 bg-[#131313] text-white rounded-full text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFilterOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-[#E5E5E5] rounded-lg text-sm text-[#636363] hover:bg-[#F5F5F5] transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort By</span>
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-[100] py-2">
                {sortOptions.map((option) => (
                  <button
                    key={`${option.value}-${option.direction}`}
                    onClick={() => {
                      onSortChange(option.value, option.direction);
                      setIsSortOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm hover:bg-[#F5F5F5] transition-colors",
                      sortBy === option.value && sortDirection === option.direction
                        ? "text-[#131313] font-medium bg-[#F5F5F5]"
                        : "text-[#636363]"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onTabChange('products')}
              className={cn(
                'text-sm font-medium pb-2 border-b-2 transition-colors',
                activeTab === 'products'
                  ? 'text-[#131313] border-[#131313]'
                  : 'text-[#BCBCBC] border-transparent'
              )}
            >
              Products
            </button>
            <button
              onClick={() => onTabChange('collections')}
              className={cn(
                'text-sm font-medium pb-2 border-b-2 transition-colors',
                activeTab === 'collections'
                  ? 'text-[#131313] border-[#131313]'
                  : 'text-[#BCBCBC] border-transparent'
              )}
            >
              Collections
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className={cn("p-2 rounded-lg transition-colors", showMobileSearch ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]")}
            >
              <Search className="w-5 h-5 text-[#636363]" />
            </button>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn("p-2 rounded-lg transition-colors", hasActiveFilters ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]")}
            >
              <SlidersHorizontal className="w-5 h-5 text-[#636363]" />
            </button>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="p-2 rounded-lg hover:bg-[#F5F5F5] transition-colors"
            >
              <ArrowUpDown className="w-5 h-5 text-[#636363]" />
            </button>
          </div>
        </div>

        {showMobileSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BCBCBC]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E5E5] rounded-lg text-sm placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#131313]"
              autoFocus
            />
          </div>
        )}

        {isFilterOpen && (
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-[#131313]">Filters</span>
              <button onClick={() => setIsFilterOpen(false)}>
                <X className="w-4 h-4 text-[#BCBCBC]" />
              </button>
            </div>
            <div>
              <label className="block text-xs text-[#636363] mb-2">Category</label>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => onCategoryFilterChange(e.target.value)}
                  className="w-full appearance-none border border-[#E5E5E5] rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:border-[#131313] bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BCBCBC] pointer-events-none" />
              </div>
            </div>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full mt-4 px-3 py-2.5 bg-[#131313] text-white rounded-full text-sm font-medium"
            >
              Apply
            </button>
          </div>
        )}

        {isSortOpen && (
          <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-lg py-2">
            {sortOptions.map((option) => (
              <button
                key={`mobile-${option.value}-${option.direction}`}
                onClick={() => {
                  onSortChange(option.value, option.direction);
                  setIsSortOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm transition-colors",
                  sortBy === option.value && sortDirection === option.direction
                    ? "text-[#131313] font-medium bg-[#F5F5F5]"
                    : "text-[#636363] hover:bg-[#F5F5F5]"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Page Component ---
const ProductsPage: React.FC = () => {
  const { state: profileState } = useProfile();
  const { showSuccess, showError } = useSnackbar();

  const [activeTab, setActiveTab] = useState<ProductTab>('products');
  const [selectedCollection, setSelectedCollection] = useState<ProductCollection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCollectionProducts, setIsLoadingCollectionProducts] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Search, Filter, Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Infinite scroll
  const [displayedCount, setDisplayedCount] = useState(20);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const itemsPerLoad = 20;

  // Fetch products and collections
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [productsResponse, collectionsResponse] = await Promise.all([
          apiClient.getAllShopifyProducts(),
          apiClient.getAllProductCollections(),
        ]);

        if (productsResponse.productCollection.success) {
          const mappedProducts: Product[] = productsResponse.productCollection.data.map((p) => ({
            id: p.id,
            name: p.title,
            handle: p.handle,
            category: p.productType || 'Uncategorized',
            commission: 0,
            referralDiscount: 0,
            performance: 0,
            status: p.status === 'ACTIVE' ? 'active' : 'inactive',
            image: p.images?.[0] || '📦',
            images: p.images || [],
            description: '',
            lastUpdated: new Date().toISOString(),
            salesData: [],
          }));

          setProducts(mappedProducts);
        }

        if (collectionsResponse.productCollections) {
          setCollections(collectionsResponse.productCollections);
        }

        setLastRefreshed(new Date());
      } catch (error) {
        console.error('Failed to fetch data:', error);
        showError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'category') {
        comparison = (a.category || '').localeCompare(b.category || '');
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [products, searchQuery, categoryFilter, sortBy, sortDirection]);

  // Displayed products (for infinite scroll)
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayedCount);
  }, [filteredProducts, displayedCount]);

  const hasMoreProducts = displayedCount < filteredProducts.length;

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(20);
  }, [searchQuery, categoryFilter, sortBy, sortDirection]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreProducts) {
          setDisplayedCount((prev) => Math.min(prev + itemsPerLoad, filteredProducts.length));
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMoreProducts, filteredProducts.length, itemsPerLoad]);

  // Generate product share link
  const generateProductLink = useCallback((productHandle: string) => {
    const profile = profileState.profile;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coupon = (profile as any)?.coupons;

    const baseUrl = process.env.NEXT_PUBLIC_STORE_HOST || 'https://myfrido.com';
    const productUrl = `${baseUrl}/products/${productHandle}`;
    const params = new URLSearchParams();

    if (profile?.name) params.set('rfname', profile.name);
    if (coupon?.value?.type === 'percentage' && coupon.value.percentage) {
      params.set('dispc', String(coupon.value.percentage));
    } else if (coupon?.value?.type === 'amount' && coupon.value.amount) {
      params.set('disam', String(coupon.value.amount));
    }
    if (coupon?.code) params.set('discount', coupon.code);
    if (profile?.uniqueReferralCode) params.set('ref', profile.uniqueReferralCode);
    params.set('tt-cart-mod', 'true');

    return `${productUrl}?${params.toString()}`;
  }, [profileState.profile]);

  // Generate collection share link
  const generateCollectionLink = useCallback((collectionHandle: string) => {
    const profile = profileState.profile;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coupon = (profile as any)?.coupons;

    const baseUrl = process.env.NEXT_PUBLIC_STORE_HOST || 'https://myfrido.com';
    const collectionUrl = `${baseUrl}/collections/${collectionHandle}`;
    const params = new URLSearchParams();

    if (profile?.name) params.set('rfname', profile.name);
    if (coupon?.value?.type === 'percentage' && coupon.value.percentage) {
      params.set('dispc', String(coupon.value.percentage));
    } else if (coupon?.value?.type === 'amount' && coupon.value.amount) {
      params.set('disam', String(coupon.value.amount));
    }
    if (coupon?.code) params.set('discount', coupon.code);
    if (profile?.uniqueReferralCode) params.set('ref', profile.uniqueReferralCode);
    params.set('tt-cart-mod', 'true');

    return `${collectionUrl}?${params.toString()}`;
  }, [profileState.profile]);

  const handleProductShare = useCallback((product: Product) => {
    const link = generateProductLink(product.handle);
    navigator.clipboard.writeText(link).then(() => {
      showSuccess('Product link copied!');
    }).catch(() => {
      showError('Failed to copy link');
    });
  }, [generateProductLink, showSuccess, showError]);

  const handleCollectionCopy = useCallback((collection: ProductCollection) => {
    const link = generateCollectionLink(collection.handle);
    navigator.clipboard.writeText(link).then(() => {
      showSuccess('Collection link copied!');
    }).catch(() => {
      showError('Failed to copy link');
    });
  }, [generateCollectionLink, showSuccess, showError]);

  const handleSortChange = (by: string, direction: 'asc' | 'desc') => {
    setSortBy(by);
    setSortDirection(direction);
    setDisplayedCount(20);
  };

  // Fetch collection products
  const handleCollectionClick = useCallback(async (collection: ProductCollection) => {
    setSelectedCollection(collection);
    setCollectionProducts([]);

    if (collection.productIds.length === 0) return;

    try {
      setIsLoadingCollectionProducts(true);
      const response = await apiClient.getShopifyProductsByIds({ ids: collection.productIds });

      if (response.products) {
        const mappedProducts: Product[] = response.products.map((p) => ({
          id: p.id,
          name: p.title,
          handle: p.handle,
          category: p.productType || 'Uncategorized',
          commission: 0,
          referralDiscount: 0,
          performance: 0,
          status: p.status === 'ACTIVE' ? 'active' : 'inactive',
          image: p.images?.[0] || '📦',
          images: p.images || [],
          description: '',
          lastUpdated: new Date().toISOString(),
          salesData: [],
        }));
        setCollectionProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch collection products:', error);
      showError('Failed to load collection products');
    } finally {
      setIsLoadingCollectionProducts(false);
    }
  }, [showError]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-3 border-[#131313] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#BCBCBC]">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header - Desktop only */}
        <div className="hidden lg:block">
          <ProductsHeader lastRefreshed={lastRefreshed} />
        </div>

        {/* Tabs and Filters */}
        <ProductsTabs
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSelectedCollection(null);
            setDisplayedCount(20);
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setDisplayedCount(20);
          }}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={(cat) => {
            setCategoryFilter(cat);
            setDisplayedCount(20);
          }}
          categories={categories}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
        />

        {/* Products Tab Content */}
        {activeTab === 'products' && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center">
                <p className="text-[#BCBCBC]">No products found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onShare={handleProductShare}
                    />
                  ))}
                </div>

                {/* Infinite scroll sentinel */}
                {hasMoreProducts && (
                  <div ref={loadMoreRef} className="flex items-center justify-center py-8">
                    <div className="inline-block w-6 h-6 border-2 border-[#131313] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Collections Tab Content */}
        {activeTab === 'collections' && (
          <>
            {!selectedCollection ? (
              // Collections Grid
              collections.length === 0 ? (
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center">
                  <p className="text-[#BCBCBC]">No collections found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {collections.map((collection) => (
                    <div
                      key={collection.id}
                      onClick={() => handleCollectionClick(collection)}
                      className="cursor-pointer"
                    >
                      <CollectionCard
                        collection={collection}
                        onCopy={(collection) => {
                          handleCollectionCopy(collection);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )
            ) : (
              // Collection Detail View
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedCollection(null);
                      setCollectionProducts([]);
                    }}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-[#131313]" />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-[#131313]">{selectedCollection.name}</h2>
                    <p className="text-sm text-[#BCBCBC]">
                      {isLoadingCollectionProducts ? 'Loading...' : `${collectionProducts.length} products`}
                    </p>
                  </div>
                </div>

                {isLoadingCollectionProducts ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="inline-block w-8 h-8 border-2 border-[#131313] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : collectionProducts.length === 0 ? (
                  <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center">
                    <p className="text-[#BCBCBC]">No products in this collection</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {collectionProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onShare={handleProductShare}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
