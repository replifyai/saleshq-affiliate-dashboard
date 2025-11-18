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
    } catch {
      showError('Failed to copy coupon code. Please try again.');
    }
  };

  const discountText =
    coupon.value.type === 'percentage'
      ? `${coupon.value.percentage}% OFF`
      : `${getCurrencySymbol(coupon.value.currencyCode)}${coupon.value.amount} OFF${coupon.value.appliesOnEachItem ? ' (per item)' : ''}`;

  const isPending = coupon.status === 'PENDING';

  return (
    <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 hover:border-primary/50 transition-all duration-300">
      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 sm:gap-3 mb-1">
            <h3 className="text-base sm:text-lg font-semibold sm:font-bold text-foreground flex-1 min-w-0 line-clamp-2">
              {coupon.title}
            </h3>
            <div className="flex-shrink-0 mt-0.5">
              <CouponStatusBadge status={coupon.status} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <Hash className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <code className="text-sm sm:text-base font-mono font-semibold sm:font-bold text-primary truncate">
              {coupon.code}
            </code>
            <button
              onClick={handleCopyCode}
              className={cn(
                'p-1.5 rounded-lg transition-all duration-200 hover:bg-primary/10 active:scale-95 flex-shrink-0 ml-1',
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
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
              {coupon.description}
            </p>
          )}
        </div>
      </div>

      <div className="mb-3 sm:mb-4 space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2 w-full min-w-0">
          <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">Discount:</span>
          <span className="text-xs sm:text-sm font-semibold text-foreground truncate">{discountText}</span>
        </div>
        {coupon.usageLimit > 0 && (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground">Limit:</span>
            <span className="text-xs sm:text-sm font-semibold text-foreground">
              {coupon.usageLimit}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-muted-foreground mb-3 sm:mb-4 flex-wrap">
        <div className="flex items-center gap-1 min-w-0 flex-shrink-0 max-w-full">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            Starts:{' '}
            {new Date(coupon.startsAt).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        {coupon.endsAt ? (
          <div className="flex items-center gap-1 min-w-0 flex-shrink-0 max-w-full">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">
              Ends:{' '}
              {new Date(coupon.endsAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 min-w-0 flex-shrink-0 max-w-full">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">No expiry</span>
          </div>
        )}
      </div>

      {isPending && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-2.5 sm:p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-[11px] sm:text-xs text-warning text-left">
            This coupon is pending admin approval. It will become active once approved.
          </p>
        </div>
      )}
    </div>
  );
};

export default CouponCard;

