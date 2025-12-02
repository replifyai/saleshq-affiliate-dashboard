import React from 'react';
import { Tag, Plus } from 'lucide-react';
import Button from '@/components/common/Button';

interface CouponsHeaderProps {
  onCreateClick: () => void;
}

const CouponsHeader: React.FC<CouponsHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="mb-4 sm:mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 md:gap-6 mb-2 sm:mb-3 md:mb-4">
        {/* Title section - hidden on mobile */}
        <div className="hidden lg:block space-y-0.5 sm:space-y-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
            <Tag className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
            My Coupons
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-0.5 sm:mt-1">
            Manage and create your affiliate coupons
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onCreateClick}
          className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Create Coupon
        </Button>
      </div>
    </div>
  );
};

export default CouponsHeader;

