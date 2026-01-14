'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useSnackbar } from '@/components/snackbar';
import { Copy } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

interface ShareAndEarnProps {
  className?: string;
}

const ShareAndEarn: React.FC<ShareAndEarnProps> = ({ className }) => {
  const { showSuccess } = useSnackbar();
  const { state } = useProfile();

  const couponCode = state.profile?.uniqueReferralCode?.toUpperCase() || 'AROMAL';
  const referralLink = `https://myfrido.com?ref=${state.profile?.uniqueReferralCode || 'affiliatedisco'}`;
  
  // Mock data for discount and commission (will come from API later)
  const yourDiscount = '10%';
  const yourCommission = '10%';

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
        </p>
      </div>
    </div>
  );
};

export default ShareAndEarn;

