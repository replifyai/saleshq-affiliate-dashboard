import React from 'react';
import { CreatorOrder, OrderLineItem } from '@/types/api';
import PaymentStatusBadge from './PaymentStatusBadge';
import ChannelBadge from './ChannelBadge';

interface OrderDetailsModalProps {
  order: CreatorOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  if (!order || !isOpen) return null;

  const formatCurrency = (amount: string | number | null | undefined) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount ?? 0;
    if (Number.isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: order.currencyCode || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDateTime = (timestamp: number | string | undefined) => {
    if (!timestamp) return 'N/A';
    const date =
      typeof timestamp === 'number'
        ? new Date(timestamp)
        : new Date(timestamp);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const channelMap: Record<string, React.ComponentProps<typeof ChannelBadge>['channel']> = {
    coupon: 'coupon',
    facebook: 'facebook',
    instagram: 'instagram',
    youtube: 'youtube',
  };
  const channelKey =
    order.attributionType?.toLowerCase() ||
    order.commissionSource?.toLowerCase() ||
    'coupon';
  const channel = channelMap[channelKey] || 'coupon';

  const hasRefund =
    (typeof order.refundedAmount === 'number' && order.refundedAmount > 0) ||
    (typeof order.refundedAmount === 'string' && parseFloat(order.refundedAmount) > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-[#231F20]/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-[#E5E5E5] w-full h-full max-h-full rounded-none shadow-2xl overflow-y-auto scrollbar-hide-mobile sm:h-auto sm:max-h-[85vh] sm:max-w-4xl sm:rounded-2xl sm:mx-4">
        {/* Header: order ref, status, date */}
        <div className="flex items-start justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E5E5E5] bg-gradient-to-br from-[#FFFAE6]/60 to-white">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-2xl font-semibold text-[#131313]">
                Order #{order.orderNumber}
              </h2>
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
            <p className="text-xs sm:text-sm text-[#BCBCBC] mt-1.5">
              {formatDateTime(order.rawEvent?.created_at ?? order.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#BCBCBC] hover:text-[#131313] transition-colors text-xl sm:text-2xl leading-none p-1"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5 bg-[#F5F5F5]">
          {/* Affiliate summary: total & commission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
              <div className="text-xs text-[#BCBCBC] uppercase tracking-wide mb-2">Order total</div>
              <div className="text-xl sm:text-2xl font-semibold text-[#131313]">
                {formatCurrency(order.totalAmount)}
              </div>
            </div>
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
              <div className="text-xs text-[#BCBCBC] uppercase tracking-wide mb-2">Your commission</div>
              <div className="text-xl sm:text-2xl font-semibold text-[#10B981] mb-1">
                {formatCurrency(order.commissionAmount)}
              </div>
              <div className="text-xs text-[#BCBCBC]">
                {order.commissionRateValue}% · {order.commissionBasis}
              </div>
            </div>
          </div>

          {/* Attribution: channel + coupon */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
            <div className="text-xs text-[#BCBCBC] uppercase tracking-wide mb-3">Attribution</div>
            <div className="flex items-center gap-2 flex-wrap">
              <ChannelBadge channel={channel} />
              {order.attributedCouponCode && (
                <span className="inline-flex px-3 py-1 rounded-full bg-[#FFFAE6] border border-[#FFD100]/30 text-[#131313] text-xs font-medium">
                  {order.attributedCouponCode}
                </span>
              )}
            </div>
          </div>

          {/* Refund (only when it affects commission) */}
          {hasRefund && (
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
              <div className="text-xs text-[#BCBCBC] uppercase tracking-wide mb-2">Refund</div>
              <div className="text-sm font-medium text-[#131313]">
                {formatCurrency(order.refundedAmount)}
                {order.refundReason && (
                  <span className="text-[#BCBCBC] font-normal ml-1">· {order.refundReason}</span>
                )}
              </div>
            </div>
          )}

          {/* Order items (what was bought) */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#131313] mb-4">Items</h3>

            <div className="space-y-3 sm:hidden">
              {order.lineItems?.map((item: OrderLineItem) => {
                const price = parseFloat(item.price ?? '0') || 0;
                const quantity = item.quantity ?? 1;
                const lineTotal = price * quantity;

                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 border-b border-[#E5E5E5] pb-3 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-[#131313] text-sm">
                        {item.title || item.name}
                      </div>
                      {item.variant_title && (
                        <div className="text-xs text-[#BCBCBC] mt-0.5">{item.variant_title}</div>
                      )}
                      <div className="text-xs text-[#BCBCBC] mt-1">
                        Qty: {quantity} × {formatCurrency(price)}
                      </div>
                    </div>
                    <div className="text-right font-semibold text-[#131313]">
                      {formatCurrency(lineTotal)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-[#BCBCBC] border-b border-[#E5E5E5]">
                    <th className="text-left py-3 pr-4 font-medium">Product</th>
                    <th className="text-left py-3 pr-4 font-medium">Qty</th>
                    <th className="text-right py-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.lineItems?.map((item: OrderLineItem) => {
                    const price = parseFloat(item.price ?? '0') || 0;
                    const quantity = item.quantity ?? 1;
                    const lineTotal = price * quantity;

                    return (
                      <tr key={item.id} className="border-b border-[#E5E5E5] last:border-0">
                        <td className="py-3 pr-4">
                          <div className="font-medium text-[#131313] text-sm">{item.title || item.name}</div>
                          {item.variant_title && (
                            <div className="text-xs text-[#BCBCBC] mt-0.5">{item.variant_title}</div>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-sm text-[#131313]">{quantity}</td>
                        <td className="py-3 text-right font-medium text-[#131313]">{formatCurrency(lineTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;


