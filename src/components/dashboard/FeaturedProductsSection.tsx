'use client';

import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { cn } from '@/lib/utils';
import { useSnackbar } from '@/components/snackbar';
import Button from '@/components/common/Button';

interface Product {
  id: string;
  name: string;
  image: string;
  price?: string;
  shareUrl?: string;
}

interface ProductCardProps {
  product: Product;
  onShare: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onShare }) => {
  return (
    <div className="group relative overflow-hidden h-full rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
        <div className="aspect-square bg-gradient-to-br from-secondary/10 to-primary/10 overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
        <div className="p-6 space-y-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2">{product.name}</h3>
            {product.price && (
              <p className="text-xl font-bold text-primary">{product.price}</p>
            )}
          </div>
          <Button
            variant="primary"
            onClick={() => onShare(product)}
            className="w-full hover:opacity-90 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Share Product</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Custom Arrow Components
const CustomLeftArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/95 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-primary/20"
    aria-label="Previous products"
  >
    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

const CustomRightArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/95 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-primary/20"
    aria-label="Next products"
  >
    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

// Custom Dot Component
const CustomDot = ({ onClick, active }: { onClick?: () => void; active?: boolean }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-3 h-3 rounded-full transition-all duration-300 mx-1",
      active 
        ? "bg-primary scale-125" 
        : "bg-primary/30 hover:bg-primary/50"
    )}
    aria-label={`Go to slide ${active ? '(current)' : ''}`}
  />
);

interface FeaturedProductsSectionProps {
  products?: Product[];
  className?: string;
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products = [
    {
      id: '1',
      name: 'Frido Ultimate Wedge Plus Cushion',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
      price: '₹1,499',
      shareUrl: 'https://myfrido.com/products/wedge-cushion',
    },
    {
      id: '2',
      name: 'Frido Ultimate Lap Desk Pillow',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=600&fit=crop',
      price: '₹2,299',
      shareUrl: 'https://myfrido.com/products/lap-desk',
    },
    {
      id: '3',
      name: 'Frido Car Neck Rest Pillow',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=600&fit=crop',
      price: '₹999',
      shareUrl: 'https://myfrido.com/products/neck-rest',
    },
  ],
  className,
}) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { showSuccess } = useSnackbar();

  // Carousel configuration
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
      slidesToSlide: 1,
      partialVisibilityGutter: 40,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1,
      partialVisibilityGutter: 40,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1,
      partialVisibilityGutter: 30,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
      partialVisibilityGutter: 0,
    },
  };

  const handleShare = (product: Product) => {
    setSelectedProduct(product);
    setShareModalOpen(true);
  };

  const handleSocialShare = (platform: string) => {
    if (!selectedProduct?.shareUrl) return;

    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedProduct.shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(selectedProduct.shareUrl)}&text=${encodeURIComponent(selectedProduct.name)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(selectedProduct.shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out ${selectedProduct.name}: ${selectedProduct.shareUrl}`)}`,
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    if (selectedProduct?.shareUrl) {
      navigator.clipboard.writeText(selectedProduct.shareUrl);
      showSuccess('Product link copied to clipboard!');
      setTimeout(() => setShareModalOpen(false), 1000);
    }
  };

  return (
    <>
      <style jsx global>{`
        .carousel-container {
          position: relative;
          padding: 0 1rem;
          margin-bottom: 2rem;
          overflow: hidden;
        }
        .carousel-item-padding-40-px {
          padding: 0 0.5rem;
        }
        .custom-dot-list-style {
          position: absolute;
          bottom: -3rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          z-index: 10;
        }
        .react-multi-carousel-dot-list {
          position: absolute;
          bottom: -3rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          z-index: 10;
        }
        .react-multi-carousel-dot-list li {
          list-style: none;
        }
        .react-multi-carousel-dot-list li button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background-color: rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .react-multi-carousel-dot-list li.react-multi-carousel-dot--active button {
          background-color: #3b82f6;
          transform: scale(1.2);
        }
        .react-multi-carousel-track {
          align-items: stretch;
        }
        .react-multi-carousel-item {
          display: flex;
          height: auto;
        }
        .react-multi-carousel-list {
          overflow: hidden;
        }
        .react-multi-carousel-item > div {
          width: 100%;
          height: 100%;
        }
        .react-multi-carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 30;
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
        .react-multi-carousel-arrow--left {
          left: 0.5rem;
        }
        .react-multi-carousel-arrow--right {
          right: 0.5rem;
        }
        .react-multi-carousel-arrow:hover {
          opacity: 1 !important;
        }
      `}</style>
      <div className={cn('relative overflow-hidden rounded-3xl', className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Featured Products</h2>
                <p className="text-muted-foreground">Share these popular items</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm text-primary font-medium">{products.length} Products</span>
            </div>
          </div>
          
          <div className="relative">
            <Carousel
              responsive={responsive}
              infinite={true}
              autoPlay={false}
              autoPlaySpeed={5000}
              keyBoardControl={true}
              customTransition="all .5s"
              transitionDuration={500}
              containerClass="carousel-container"
              itemClass="carousel-item-padding-40-px"
              removeArrowOnDeviceType={[]}
              showDots={true}
              dotListClass="custom-dot-list-style"
              arrows={true}
              customLeftArrow={<CustomLeftArrow />}
              customRightArrow={<CustomRightArrow />}
              partialVisbile={false}
              centerMode={false}
              swipeable={true}
              draggable={true}
              focusOnSelect={false}
              minimumTouchDrag={80}
            >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="px-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ProductCard product={product} onShare={handleShare} />
              </div>
            ))}
            </Carousel>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShareModalOpen(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Share Product</h3>
              <button
                onClick={() => setShareModalOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary/20 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-foreground mb-6">{selectedProduct.name}</p>

            {/* Share Link */}
            <div className="flex items-center space-x-2 mb-6">
              <input
                type="text"
                value={selectedProduct.shareUrl}
                readOnly
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground"
              />
              <button
                onClick={handleCopyLink}
                className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors"
              >
                Copy
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-4 gap-4">
              {['facebook', 'twitter', 'linkedin', 'whatsapp'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => handleSocialShare(platform)}
                  className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-secondary/20 transition-colors"
                >
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center',
                    platform === 'facebook' && 'bg-blue-600 text-white',
                    platform === 'twitter' && 'bg-gray-900 text-white',
                    platform === 'linkedin' && 'bg-blue-700 text-white',
                    platform === 'whatsapp' && 'bg-green-600 text-white'
                  )}>
                    {platform === 'facebook' && (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )}
                    {platform === 'twitter' && (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    )}
                    {platform === 'linkedin' && (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/>
                      </svg>
                    )}
                    {platform === 'whatsapp' && (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-foreground capitalize">{platform}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedProductsSection;
