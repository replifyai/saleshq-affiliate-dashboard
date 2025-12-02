import React from 'react';
import { Tag, Plus } from 'lucide-react';
import Button from '@/components/common/Button';

interface CouponsEmptyStateProps {
  onCreateClick: () => void;
}

const CouponsEmptyState: React.FC<CouponsEmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="bg-gradient-to-br from-[#FFFAE6]/60 to-white rounded-2xl border border-[#FFD100]/40 p-6 sm:p-10 text-center">
      <Tag className="w-10 h-10 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4 opacity-50" />
      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">No coupons yet</h3>
      <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
        Create your first coupon to start offering discounts to your audience
      </p>
      <Button
        variant="primary"
        onClick={onCreateClick}
        className="w-full sm:w-auto flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        Create Your First Coupon
      </Button>
    </div>
  );
};

export default CouponsEmptyState;

