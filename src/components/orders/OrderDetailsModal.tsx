import React from 'react';
import { CreatorOrder } from '@/types/api';
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
    if (Number.isNaN(value)) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: order.currencyCode || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDateTime = (timestamp: number | string | undefined) => {
    if (!timestamp) return '—';
    const date =
      typeof timestamp === 'number'
        ? new Date(timestamp)
        : new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const rawCustomer = order.rawEvent?.customer ?? {};

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border w-full h-full max-h-full rounded-none shadow-2xl overflow-y-auto scrollbar-hide-mobile sm:h-auto sm:max-h-[85vh] sm:max-w-3xl sm:rounded-2xl sm:mx-4">
        <div className="flex items-start justify-between px-3 py-2.5 border-b border-border/50 sm:px-5 sm:py-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-xl font-semibold text-foreground">
                Order #{order.orderNumber}
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
              Created on {formatDateTime(order.rawEvent?.created_at ?? order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PaymentStatusBadge status={order.paymentStatus} />
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-3 py-3 space-y-3 sm:px-5 sm:py-4 sm:space-y-3">
          {/* Compact summary — 2 cards per row, extra text trimmed on mobile */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-background/60 rounded-xl border border-border/60 p-2.5 sm:p-4 text-xs sm:text-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Total</div>
              <div className="text-base sm:text-lg font-semibold text-foreground">
                {formatCurrency(order.totalAmount)}
              </div>
              <div className="hidden sm:block text-xs text-muted-foreground mt-0.5">
                Subtotal {formatCurrency(order.subtotalAmount)} · Shipping {formatCurrency(order.shippingAmount)}
              </div>
            </div>
            <div className="bg-background/60 rounded-xl border border-border/60 p-2.5 sm:p-4 text-xs sm:text-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Commission</div>
              <div className="text-base sm:text-lg font-semibold text-success">
                {formatCurrency(order.commissionAmount)}
              </div>
              <div className="hidden sm:block text-xs text-muted-foreground mt-0.5">
                {order.commissionRateValue}% · {order.commissionBasis}
              </div>
            </div>
            <div className="bg-background/60 rounded-xl border border-border/60 p-2.5 sm:p-4 text-xs sm:text-sm col-span-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Attribution</div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <ChannelBadge channel={channel} />
                {order.attributedCouponCode && (
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {order.attributedCouponCode}
                  </span>
                )}
              </div>
              {order.appliedCoupons?.length > 0 && (
                <div className="hidden sm:block text-xs text-muted-foreground mt-0.5">
                  Coupons: {order.appliedCoupons.join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* Customer & payment cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
            <div className="bg-background/40 rounded-xl border border-border/60 p-3 sm:p-3.5 text-xs sm:text-sm">
              <h3 className="text-sm font-semibold text-foreground mb-1.5 sm:mb-2">Customer</h3>
              <div className="space-y-1">
                <div className="font-medium">
                  {rawCustomer.first_name} {rawCustomer.last_name}
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground break-all">
                  {order.customerEmail}
                </div>
                {order.rawEvent?.phone && (
                  <div className="text-[11px] sm:text-xs text-muted-foreground">
                    {order.rawEvent.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-background/40 rounded-xl border border-border/60 p-3 sm:p-3.5 text-xs sm:text-sm">
              <h3 className="text-sm font-semibold text-foreground mb-1.5 sm:mb-2">Payment</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Method:</span>
                  <span className="font-medium text-foreground">{order.paymentMethod || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
                {order.rawEvent?.order_status_url && (
                  <div>
                    <a
                      href={order.rawEvent.order_status_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] sm:text-xs text-primary underline"
                    >
                      View order status page
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-background/40 rounded-xl border border-border/60 p-3 sm:p-3.5">
            <h3 className="text-sm font-semibold text-foreground mb-2.5 sm:mb-3">Items</h3>

            {/* Compact list on mobile */}
            <div className="space-y-2 sm:hidden text-xs">
              {order.lineItems?.map((item: any) => {
                const price = parseFloat(item.price ?? '0') || 0;
                const quantity = item.quantity ?? 1;
                const lineTotal = price * quantity;

                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-2 border-b border-border/30 pb-1.5 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-foreground truncate max-w-[180px]">
                        {item.title || item.name}
                      </div>
                      {item.variant_title && (
                        <div className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                          {item.variant_title}
                        </div>
                      )}
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Qty {quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(lineTotal)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full table on larger screens */}
            <div className="hidden sm:block overflow-x-auto -mx-2 sm:mx-0 text-[13px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border/50">
                    <th className="text-left py-2 pr-2">Product</th>
                    <th className="text-left py-2 pr-2">Qty</th>
                    <th className="text-left py-2 pr-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.lineItems?.map((item: any) => {
                    const price = parseFloat(item.price ?? '0') || 0;
                    const quantity = item.quantity ?? 1;
                    const lineTotal = price * quantity;

                    return (
                      <tr key={item.id} className="border-b border-border/30 last:border-0">
                        <td className="py-2 pr-2">
                          <div className="font-medium text-foreground">{item.title || item.name}</div>
                          {item.variant_title && (
                            <div className="text-xs text-muted-foreground">{item.variant_title}</div>
                          )}
                        </td>
                        <td className="py-2 pr-2">{quantity}</td>
                        <td className="py-2 pr-2 font-medium">{formatCurrency(lineTotal)}</td>
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


