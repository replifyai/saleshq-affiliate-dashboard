import React from 'react';
import { Tag, Plus } from 'lucide-react';
import Button from '@/components/common/Button';

interface CouponsEmptyStateProps {
  onCreateClick: () => void;
}

const CouponsEmptyState: React.FC<CouponsEmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="bg-card rounded-2xl border border-border p-12 text-center">
      <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
      <h3 className="text-xl font-semibold text-foreground mb-2">No coupons yet</h3>
      <p className="text-muted-foreground mb-6">Create your first coupon to start offering discounts to your audience</p>
      <Button
        variant="primary"
        onClick={onCreateClick}
        className="flex items-center gap-2 mx-auto"
      >
        <Plus className="w-5 h-5" />
        Create Your First Coupon
      </Button>
    </div>
  );
};

export default CouponsEmptyState;

