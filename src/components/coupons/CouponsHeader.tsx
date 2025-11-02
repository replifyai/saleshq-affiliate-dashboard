import React from 'react';
import { Tag, Plus } from 'lucide-react';
import Button from '@/components/common/Button';

interface CouponsHeaderProps {
  onCreateClick: () => void;
}

const CouponsHeader: React.FC<CouponsHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Tag className="w-8 h-8 text-primary" />
            My Coupons
          </h1>
          <p className="text-muted-foreground mt-1">Manage and create your affiliate coupons</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={onCreateClick}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Coupon
        </Button>
      </div>
    </div>
  );
};

export default CouponsHeader;

