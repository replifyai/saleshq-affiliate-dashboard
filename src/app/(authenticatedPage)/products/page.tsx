'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback, CSSProperties, ReactElement } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useSnackbar } from '@/components/snackbar/use-snackbar';
import { Share2, ArrowLeft, Package, Loader2, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import apiClient from '@/services/apiClient';
import { Product, Category } from '@/components/products/types';
import { ProductCollection } from '@/types/api';
import { List } from 'react-window';

// --- Types ---

interface SimpleProductCardProps {
  product: Product;
  showShare?: boolean;
  onShare?: (product: Product) => void;
}

interface SimpleCollectionCardProps {
  collection: ProductCollection;
  productCount: number;
  onClick: () => void;
}

// --- Components ---

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product, showShare = true, onShare }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : (product.image ? [product.image] : []);

  useEffect(() => {
    if (isHovered && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentImageIndex(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, images.length]);

  const currentImage = images[currentImageIndex];

  return (
    <div 
      className="group relative bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area - Handle actual images vs emoji placeholder */}
      <div className="aspect-square bg-muted/30 flex items-center justify-center relative overflow-hidden">
        {currentImage && currentImage.startsWith('http') ? (
          <img 
            src={currentImage} 
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="text-4xl transform group-hover:scale-110 transition-transform duration-500">
            {currentImage || '📦'}
          </div>
        )}
        
        {/* Slideshow Indicators (dots) */}
        {images.length > 1 && isHovered && (
          <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx}
                className={cn(
                  "w-1 h-1 rounded-full transition-all duration-300",
                  idx === currentImageIndex ? "bg-white scale-110" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      <div className="p-2.5 sm:p-3 flex flex-col flex-1">
        <div className="mb-2 flex-1">
          <div className="text-[10px] sm:text-xs font-medium text-primary mb-0.5 uppercase tracking-wider opacity-80 truncate">
            {product.category}
          </div>
          <h3 className="font-semibold text-xs sm:text-sm text-foreground leading-tight line-clamp-2">
            {product.name}
          </h3>
        </div>

        {showShare && (
          <button
            onClick={() => onShare?.(product)}
            className="w-full flex items-center justify-center gap-1.5 bg-primary text-black py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-transform active:scale-95 hover:bg-primary/90"
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>
        )}
      </div>
    </div>
  );
};

const SimpleCollectionCard: React.FC<SimpleCollectionCardProps> = ({ collection, productCount, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-card border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/20 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Package size={64} />
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {collection.name}
      </h3>
      {collection.description && (
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {collection.description}
        </p>
      )}
      <p className="text-muted-foreground mb-4">
        {productCount} Products
      </p>
      
      <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        View Collection <ArrowLeft className="ml-2 rotate-180" size={16} />
      </div>
    </div>
  );
};

// --- Virtualized Grid Component ---

const GUTTER_SIZE = 16; // gap-4 = 1rem = 16px
const ROW_HEIGHT = 300; // Compact card height + gutter

interface VirtualizedProductGridProps {
  products: Product[];
  onShare: (product: Product) => void;
  showShare?: boolean;
  emptyState: React.ReactNode;
}

// Row component props for react-window v2
interface RowProps {
  products: Product[];
  columnCount: number;
  containerWidth: number;
  showShare: boolean;
  onShare: (product: Product) => void;
}

// Row component for react-window v2
const ProductRow = ({
  index,
  style,
  products,
  columnCount,
  containerWidth,
  showShare,
  onShare,
}: {
  ariaAttributes: { "aria-posinset": number; "aria-setsize": number; role: "listitem" };
  index: number;
  style: CSSProperties;
} & RowProps): ReactElement => {
  const startIndex = index * columnCount;
  const rowProducts = products.slice(startIndex, startIndex + columnCount);
  const itemWidth = (containerWidth - (columnCount - 1) * GUTTER_SIZE) / columnCount;

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        gap: GUTTER_SIZE,
        boxSizing: 'border-box',
      }}
    >
      {rowProducts.map((product) => (
        <div key={product.id} style={{ width: itemWidth, flexShrink: 0, height: ROW_HEIGHT - GUTTER_SIZE }}>
          <SimpleProductCard
            product={product}
            showShare={showShare}
            onShare={onShare}
          />
        </div>
      ))}
      {/* Fill empty slots to maintain grid alignment */}
      {rowProducts.length < columnCount &&
        Array.from({ length: columnCount - rowProducts.length }).map((_, i) => (
          <div key={`spacer-${i}`} style={{ width: itemWidth, flexShrink: 0 }} />
        ))}
    </div>
  );
};

const VirtualizedProductGrid: React.FC<VirtualizedProductGridProps> = ({
  products,
  onShare,
  showShare = true,
  emptyState,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Responsive columns: 4 on desktop, 2 on mobile
  const getColumnCount = useCallback((width: number) => {
    if (width >= 768) return 4;  // Desktop: 4 cards
    return 2;                     // Mobile: 2 cards
  }, []);

  const columnCount = useMemo(() => getColumnCount(containerWidth), [containerWidth, getColumnCount]);
  const rowCount = useMemo(() => Math.ceil(products.length / Math.max(columnCount, 1)), [products.length, columnCount]);

  // Update container width on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      setContainerWidth(container.offsetWidth);
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  if (products.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div ref={containerRef} className="w-full h-full flex-1 overflow-x-hidden" style={{ minHeight: 500 }}>
      {containerWidth > 0 && (
        <List<RowProps>
          style={{ height: '100%', width: containerWidth, overflowX: 'hidden' }}
          rowCount={rowCount}
          rowHeight={ROW_HEIGHT}
          rowComponent={ProductRow}
          rowProps={{
            products,
            columnCount,
            containerWidth,
            showShare,
            onShare,
          }}
          overscanCount={2}
        />
      )}
    </div>
  );
};

// --- Main Page Component ---

const ProductsPage: React.FC = () => {
  const { state: profileState } = useProfile();
  const { showSuccess, showError } = useSnackbar();
  
  const [activeTab, setActiveTab] = useState<'all' | 'collections'>('all');
  const [selectedCollection, setSelectedCollection] = useState<ProductCollection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCollectionProducts, setIsLoadingCollectionProducts] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('all');

  // Fetch products and collections
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch both products and collections in parallel
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
            commission: 0, // Placeholder
            referralDiscount: 0, // Placeholder
            performance: 0,
            status: p.status === 'ACTIVE' ? 'active' : 'inactive', // Map status
            image: p.images?.[0] || '📦', // Use first image or placeholder
            images: p.images || [], // Store all images
            description: '',
            lastUpdated: new Date().toISOString(),
            salesData: [],
          }));
          
          setProducts(mappedProducts);
        }
        
        if (collectionsResponse.productCollections) {
          setCollections(collectionsResponse.productCollections);
        }
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

  // Derive categories from products
  const categories = useMemo(() => {
    const catMap = new Map<string, Category>();
    
    products.forEach(product => {
      const catName = product.category;
      if (!catMap.has(catName)) {
        catMap.set(catName, {
          name: catName,
          productCount: 0,
          avgCommission: 0,
          avgDiscount: 0,
          revenueShare: 0,
          topProduct: product.name,
        });
      }
      
      const cat = catMap.get(catName)!;
      cat.productCount++;
    });
    
    return Array.from(catMap.values());
  }, [products]);

  // Filter products logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = productTypeFilter === 'all' || product.category === productTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [products, searchQuery, productTypeFilter]);

  // Generate product share link with referral info
  // Format: https://myfrido.com/products/{handle}?rfname={name}&dispc={percentage}&discount={code}&tt-cart-mod=true
  // Or for amount: https://myfrido.com/products/{handle}?rfname={name}&disam={amount}&discount={code}&tt-cart-mod=true
  const generateProductLink = (productHandle: string) => {
    const profile = profileState.profile;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coupon = (profile as any)?.coupons;
    
    const baseUrl = 'https://myfrido.com';
    const productUrl = `${baseUrl}/products/${productHandle}`;
    
    // Build query params
    const params = new URLSearchParams();
    
    // Add referral name (URL encoded)
    if (profile?.name) {
      params.set('rfname', profile.name);
    }
    
    // Add discount value based on type
    if (coupon?.value) {
      if (coupon.value.type === 'percentage' && coupon.value.percentage) {
        params.set('dispc', String(coupon.value.percentage));
      } else if (coupon.value.type === 'amount' && coupon.value.amount) {
        params.set('disam', String(coupon.value.amount));
      }
    }
    
    // Add discount code
    if (coupon?.code) {
      params.set('discount', coupon.code);
    }
    
    // Add cart mod flag
    params.set('tt-cart-mod', 'true');
    
    return `${productUrl}?${params.toString()}`;
  };

  const handleShare = (text: string, type: 'Product' | 'Collection') => {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess(`${type} link copied to clipboard!`);
    }).catch(() => {
      showError('Failed to copy link');
    });
  };

  const handleProductShare = (product: Product) => {
    const link = generateProductLink(product.handle);
    handleShare(link, 'Product');
  };

  // Generate collection share link (same format as product but with /collections/)
  const generateCollectionLink = (collectionHandle: string) => {
    const profile = profileState.profile;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coupon = (profile as any)?.coupons;
    
    const baseUrl = 'https://myfrido.com';
    const collectionUrl = `${baseUrl}/collections/${collectionHandle}`;
    
    // Build query params
    const params = new URLSearchParams();
    
    // Add referral name (URL encoded)
    if (profile?.name) {
      params.set('rfname', profile.name);
    }
    
    // Add discount value based on type
    if (coupon?.value) {
      if (coupon.value.type === 'percentage' && coupon.value.percentage) {
        params.set('dispc', String(coupon.value.percentage));
      } else if (coupon.value.type === 'amount' && coupon.value.amount) {
        params.set('disam', String(coupon.value.amount));
      }
    }
    
    // Add discount code
    if (coupon?.code) {
      params.set('discount', coupon.code);
    }
    
    // Add cart mod flag
    params.set('tt-cart-mod', 'true');
    
    return `${collectionUrl}?${params.toString()}`;
  };

  const handleCollectionShare = (collection: ProductCollection) => {
    const link = generateCollectionLink(collection.handle);
    handleShare(link, 'Collection');
  };

  // Fetch collection products when a collection is selected
  const handleCollectionClick = useCallback(async (collection: ProductCollection) => {
    setSelectedCollection(collection);
    setCollectionProducts([]);
    
    if (collection.productIds.length === 0) {
      return;
    }
    
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background p-4 sm:p-6 lg:p-10 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0">
        
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-1 sm:mb-2">
            Marketplace
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Discover and share premium products with your audience.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-0.5 bg-muted/30 p-0.5 rounded-lg w-fit mb-3">
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedCollection(null);
            }}
            className={cn(
              "px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200",
              activeTab === 'all' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={cn(
              "px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200",
              activeTab === 'collections'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            Collections
          </button>
        </div>

        {/* Search and Filter Row */}
        {activeTab === 'all' && (
          <div className="flex flex-row gap-2 mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="relative w-[120px] sm:w-[140px]">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={productTypeFilter}
                onChange={(e) => setProductTypeFilter(e.target.value)}
                className="w-full pl-8 pr-6 py-1.5 rounded-lg border border-border bg-card text-xs appearance-none focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="all">All Types</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-3 w-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* ALL PRODUCTS TAB */}
          {activeTab === 'all' && (
            <VirtualizedProductGrid
              products={filteredProducts}
              onShare={handleProductShare}
              showShare={true}
              emptyState={
                <div className="py-12 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters to find what you&apos;re looking for.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setProductTypeFilter('all');
                    }}
                    className="mt-4 text-primary hover:underline text-sm font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              }
            />
          )}

          {/* COLLECTIONS TAB */}
          {activeTab === 'collections' && (
            <>
              {/* Collection List View */}
              {!selectedCollection ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
                  {collections.length > 0 ? (
                    collections.map((collection) => (
                      <SimpleCollectionCard 
                        key={collection.id} 
                        collection={collection}
                        productCount={collection.productIds.length}
                        onClick={() => handleCollectionClick(collection)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground">No collections yet</h3>
                      <p className="text-muted-foreground">
                        Collections will appear here once they are created.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Collection Detail View */
                <div className="flex flex-col h-full gap-6">
                  <div className="flex-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/50 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => {
                          setSelectedCollection(null);
                          setCollectionProducts([]);
                        }}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                      >
                        <ArrowLeft size={24} />
                      </button>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{selectedCollection.name}</h2>
                        <p className="text-muted-foreground text-sm">
                          {isLoadingCollectionProducts ? 'Loading...' : `${collectionProducts.length} Products in this collection`}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleCollectionShare(selectedCollection)}
                      className="flex items-center justify-center gap-2 bg-primary text-black py-3 px-6 rounded-xl font-medium transition-transform active:scale-95 hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                      <Share2 size={20} />
                      <span>Share Collection</span>
                    </button>
                  </div>

                  <div className="flex-1 min-h-0">
                    {isLoadingCollectionProducts ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin text-primary" size={48} />
                      </div>
                    ) : (
                      <VirtualizedProductGrid
                        products={collectionProducts}
                        onShare={handleProductShare}
                        showShare={false}
                        emptyState={
                          <div className="py-12 text-center">
                            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground">No products in this collection</h3>
                          </div>
                        }
                      />
                    )}
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
