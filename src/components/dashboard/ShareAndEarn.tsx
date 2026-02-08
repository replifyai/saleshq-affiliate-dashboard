'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useSnackbar } from '@/components/snackbar';
import { Copy } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { ActiveCoupon, ReferralLink } from '@/types/api';

export interface ShareAndEarnProps {
  activeCoupon?: ActiveCoupon | null;
  referralLink?: ReferralLink | null;
  className?: string;
}

const ShareAndEarn: React.FC<ShareAndEarnProps> = ({ activeCoupon, referralLink: referralLinkData, className }) => {
  const { showSuccess } = useSnackbar();
  const { state } = useProfile();

  // Use shopDomain from profile, fallback to env variable
  const storeHost = state.profile?.shopDomain || process.env.NEXT_PUBLIC_STORE_HOST || 'https://myfrido.com';

  // Use activeCoupon from dashboard summary if available, fallback to profile data
  const couponCode = activeCoupon?.code || state.profile?.uniqueReferralCode?.toUpperCase() || 'N/A';
  
  // Use referralLink from dashboard summary if available
  const referralCode = referralLinkData?.referralCode || state.profile?.uniqueReferralCode || 'affiliatedisco';
  const referralLink = `${storeHost}?ref=${referralCode}`;

  // Format discount from activeCoupon
  const formatDiscount = (): string => {
    if (!activeCoupon) return 'N/A';
    if (activeCoupon.discountType === 'percentage') {
      return `${activeCoupon.discountValue}%`;
    }
    return `₹${activeCoupon.discountValue}`;
  };

  // Format commission - prefer activeCoupon, fallback to referralLink
  const formatCommission = (): string => {
    if (activeCoupon) {
      if (activeCoupon.commissionType === 'percentage') {
        return `${activeCoupon.commissionValue}%`;
      }
      return `₹${activeCoupon.commissionValue}`;
    }
    if (referralLinkData) {
      if (referralLinkData.commissionType === 'percentage') {
        return `${referralLinkData.commissionValue}%`;
      }
      return `₹${referralLinkData.commissionValue}`;
    }
    return 'N/A';
  };

  const yourDiscount = formatDiscount();
  const yourCommission = formatCommission();

  // Get commission basis for tooltip
  const getCommissionBasis = (): string => {
    const basis = activeCoupon?.commissionBasis || referralLinkData?.commissionBasis;
    if (!basis) return '';
    return basis.replace(/_/g, ' ');
  };

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    showSuccess(message);
  };

  return (
    <div className={cn('bg-white border border-[#E5E5E5] rounded-2xl p-5 sm:p-6', className)}>
      {/* Header */}
      <span className="inline-block px-[6px] py-[6px] border border-[#EAEAEA] rounded-full text-[14px] text-[#636363] mb-5">
        Share and Earn
      </span>

      {/* Coupon Code and Referral Link */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Coupon Code */}
        <div>
          <label className="block text-sm text-[#BCBCBC] mb-2">Coupon Code</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#131313] font-semibold">
              {couponCode}
            </div>
            <button
              onClick={() => handleCopy(couponCode, 'Coupon code copied!')}
              className="p-3 rounded-xl bg-[#FFE887] hover:bg-[#FFD54F] transition-colors"
              aria-label="Copy coupon code"
            >
              <Copy className="w-5 h-5 text-[#131313]" />
            </button>
          </div>
        </div>

        {/* Referral Link */}
        <div>
          <label className="block text-sm text-[#BCBCBC] mb-2">Referral Link</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#131313] truncate">
              {referralLink}
            </div>
            <button
              onClick={() => handleCopy(referralLink, 'Referral link copied!')}
              className="p-3 rounded-xl bg-[#FFE887] hover:bg-[#FFD54F] transition-colors"
              aria-label="Copy referral link"
            >
              <Copy className="w-5 h-5 text-[#131313]" />
            </button>
          </div>
        </div>
      </div>

      {/* Discount and Commission Info */}
      <div className="flex flex-wrap gap-6 text-sm">
        <p className="text-[#BCBCBC]">
          <span className="text-[#131313]">*</span> Your Discount: <span className="font-semibold text-[#131313]">{yourDiscount}</span>
        </p>
        <p className="text-[#BCBCBC]">
          <span className="text-[#131313]">*</span> Your Commission: <span className="font-semibold text-[#131313]">{yourCommission}</span>
          {getCommissionBasis() && (
            <span className="text-[#BCBCBC] text-xs ml-1">({getCommissionBasis()})</span>
          )}
        </p>
        {referralLinkData && !referralLinkData.active && (
          <p className="text-red-500 text-xs">
            Referral link is currently inactive
          </p>
        )}
      </div>
    </div>
  );
};

export default ShareAndEarn;

