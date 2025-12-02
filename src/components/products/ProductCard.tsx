import React from 'react';
import { cn } from '@/lib/utils';
import { Product } from './types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => (
  <div 
    className="bg-gradient-to-br from-[#FFFAE6]/60 to-white border border-[#FFD100]/40 rounded-xl p-6 hover:shadow-lg hover:border-[#FFD100]/60 transition-all duration-300 hover:translate-y-[-2px] cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="text-3xl">{product.image}</div>
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.category}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {product.isFavorite && (
          <div className="text-accent text-lg">⭐</div>
        )}
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          product.status === 'active' ? "text-success bg-success/10" :
          product.status === 'paused' ? "text-warning bg-warning/10" :
          "text-muted-foreground bg-muted/10"
        )}>
          {product.status}
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-center">
        <div className="text-lg font-bold text-primary">{product.commission}%</div>
        <div className="text-xs text-muted-foreground">Commission</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-primary">{product.referralDiscount}%</div>
        <div className="text-xs text-muted-foreground">Discount</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-foreground">₹{product.performance.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground">Performance</div>
      </div>
    </div>
    
    <div className="text-xs text-muted-foreground">
      Last updated: {product.lastUpdated}
    </div>
  </div>
);

export default ProductCard;