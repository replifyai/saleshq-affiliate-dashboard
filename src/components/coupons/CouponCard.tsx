'use client';

import React, { useState } from 'react';
import { Coupon } from '@/types/api';
import { useSnackbar } from '@/components/snackbar/use-snackbar';
import CouponStatusBadge from './CouponStatusBadge';
import { CURRENCY_SYMBOLS } from './constants';
import { Calendar, Hash, TrendingUp, AlertCircle, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CouponCardProps {
  coupon: Coupon;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon }) => {
  const { showSuccess, showError } = useSnackbar();
  const [copied, setCopied] = useState(false);

  const getCurrencySymbol = (currencyCode: string) => {
    return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      showSuccess('Coupon code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showError('Failed to copy coupon code. Please try again.');
    }
  };

  const discountText =
    coupon.value.type === 'percentage'
      ? `${coupon.value.percentage}% OFF`
      : `${getCurrencySymbol(coupon.value.currencyCode)}${coupon.value.amount} OFF${coupon.value.appliesOnEachItem ? ' (per item)' : ''}`;

  const isPending = coupon.status === 'PENDING';

  return (
    <div className="bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-1">{coupon.title}</h3>
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <code className="text-lg font-mono font-bold text-primary">{coupon.code}</code>
            <button
              onClick={handleCopyCode}
              className={cn(
                'p-1.5 rounded-lg transition-all duration-200 hover:bg-primary/10 active:scale-95',
                copied ? 'text-success' : 'text-muted-foreground hover:text-primary'
              )}
              aria-label="Copy coupon code"
              title="Copy coupon code"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          {coupon.description && (
            <p className="text-sm text-muted-foreground mb-3">{coupon.description}</p>
          )}
        </div>
        <CouponStatusBadge status={coupon.status} />
      </div>

      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-2 w-full min-w-0">
          <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-sm text-muted-foreground flex-shrink-0">Discount:</span>
          <span className="text-sm font-semibold text-foreground truncate">{discountText}</span>
        </div>
        {coupon.usageLimit > 0 && (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground">Limit:</span>
            <span className="text-sm font-semibold text-foreground">{coupon.usageLimit}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 flex-wrap">
        <div className="flex items-center gap-1 min-w-0 flex-shrink-0">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">Starts: {new Date(coupon.startsAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-1 min-w-0 flex-shrink-0">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">Ends: {new Date(coupon.endsAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {isPending && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-xs text-warning">
            This coupon is pending admin approval. It will become active once approved.
          </p>
        </div>
      )}
    </div>
  );
};

export default CouponCard;

