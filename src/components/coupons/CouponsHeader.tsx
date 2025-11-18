import React from 'react';
import { Tag, Plus } from 'lucide-react';
import Button from '@/components/common/Button';

interface CouponsHeaderProps {
  onCreateClick: () => void;
}

const CouponsHeader: React.FC<CouponsHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
            <Tag className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            My Coupons
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-0.5 sm:mt-1">
            Manage and create your affiliate coupons
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onCreateClick}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Create Coupon
        </Button>
      </div>
    </div>
  );
};

export default CouponsHeader;

