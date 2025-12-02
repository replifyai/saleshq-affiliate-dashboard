import React from 'react';
import Button from '@/components/common/Button';
import { Product } from './types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onCopyLink: (link: string, productName: string) => void;
  onViewChart: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  onCopyLink, 
  onViewChart 
}) => {
  if (!product || !isOpen) return null;

  const handleCopyLink = () => {
    if (product.affiliateLink) {
      onCopyLink(product.affiliateLink, product.name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#231F20]/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-[#FFFAE6]/80 to-white border border-[#FFD100]/40 rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{product.image}</div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
              <p className="text-muted-foreground">{product.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {product.description && (
          <p className="text-muted-foreground mb-6">{product.description}</p>
        )}

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-[#FFFAE6]/50 border border-[#FFD100]/30 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Current Commission</div>
            <div className="text-2xl font-bold text-primary">{product.commission}%</div>
          </div>
          <div className="bg-[#FFFAE6]/50 border border-[#FFD100]/30 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Referral Discount</div>
            <div className="text-2xl font-bold text-primary">{product.referralDiscount}%</div>
          </div>
        </div>

        {product.recentSales && (
          <div className="bg-background/50 rounded-lg p-4 mb-6">
            <div className="text-sm text-muted-foreground mb-1">Recent Sales</div>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-foreground">₹{product.recentSales.toLocaleString()}</div>
              {product.salesGrowth && (
                <div className={`text-sm font-medium ${
                  product.salesGrowth > 0 ? "text-success" : "text-destructive"
                }`}>
                  {product.salesGrowth > 0 ? '↗' : '↘'} {Math.abs(product.salesGrowth)}% this week
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-3">Change History</h3>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Aug 21: Commission updated from 10% → 12%
            </div>
            <div className="text-sm text-muted-foreground">
              Sep 02: Discount increased from 5% → 8%
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant='accent' className="flex-1" onClick={handleCopyLink}>
            Copy Affiliate Link
          </Button>
          <Button variant="secondary" onClick={onViewChart}>
            View Performance Chart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;