'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useSnackbar } from '@/components/snackbar';
import { useProfile } from '@/contexts/ProfileContext';

interface Product {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: string;
  shareLink: string;
}

interface FeaturedProductsProps {
  products?: Product[];
  isLoading?: boolean;
  className?: string;
}

const ProductSkeleton = () => (
  <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200"></div>
    <div className="p-3 sm:p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
    </div>
  </div>
);

const ProductCard: React.FC<{ product: Product; onShare: (link: string) => void }> = ({ product, onShare }) => {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Rating Badge */}
      <div className="relative">
        <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-[10px] z-10">
          <Star className="w-2.5 h-2.5 fill-[#FFE887] text-[#FFE887]" />
          <span className="font-medium text-[#131313]">{product.rating}</span>
          <span className="text-[#BCBCBC]">({product.reviewCount})</span>
        </div>

        {/* Product Image */}
        <div className="aspect-square bg-[#F5F5F5] flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-[#131313] font-medium line-clamp-2 mb-1.5 sm:mb-2 min-h-[32px] sm:min-h-[40px]">
          {product.name}
        </p>

        {/* Category Tag */}
        <span className="inline-block px-1.5 sm:px-2 py-0.5 bg-[#FFE887] text-[#131313] text-[9px] sm:text-[10px] font-medium rounded mb-1.5 sm:mb-3">
          {product.category}
        </span>

        {/* Price - Stack on mobile, inline on larger screens */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 mb-2 sm:mb-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-sm sm:text-lg font-bold text-[#131313]">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="text-[10px] sm:text-sm text-[#BCBCBC] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-[9px] sm:text-xs font-semibold text-green-600 bg-green-50 px-1 sm:px-1.5 py-0.5 rounded w-fit">
            {product.discount}
          </span>
        </div>

        {/* Share Button */}
        <button
          onClick={() => onShare(product.shareLink)}
          className="w-full py-2 sm:py-3 bg-[#FFE887] hover:bg-[#FFD54F] text-[#131313] text-sm font-semibold rounded-xl transition-colors"
        >
          Share
        </button>
      </div>
    </div>
  );
};

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products: propProducts,
  isLoading = false,
  className
}) => {
  const { showSuccess } = useSnackbar();

  const products = propProducts || [];

  const handleShare = (link: string) => {
    navigator.clipboard.writeText(link);
    showSuccess('Product link copied!');
  };

  return (
    <div className={cn('bg-white border border-[#E5E5E5] rounded-2xl p-4 sm:p-6', className)}>
      <span className="inline-block px-[6px] py-[6px] border border-[#EAEAEA] rounded-full text-[14px] text-[#636363] mb-4 sm:mb-5">
        Featured Products
      </span>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : products.length === 0 ? (
          <div className="col-span-full py-8 text-center text-gray-400 text-sm">
            No products available
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onShare={handleShare}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;

