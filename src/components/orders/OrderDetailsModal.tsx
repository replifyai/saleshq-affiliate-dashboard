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

  // Helper function to safely get value or show N/A
  const getValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

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
      <div className="absolute inset-0 bg-[#231F20]/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-[#E5E5E5] w-full h-full max-h-full rounded-none shadow-2xl overflow-y-auto scrollbar-hide-mobile sm:h-auto sm:max-h-[85vh] sm:max-w-4xl sm:rounded-2xl sm:mx-4">
        {/* Header */}
        <div className="flex items-start justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E5E5E5] bg-gradient-to-br from-[#FFFAE6]/60 to-white">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-2xl font-semibold text-[#131313]">
                Order #{order.orderNumber}
              </h2>
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
            <p className="text-xs sm:text-sm text-[#BCBCBC] mt-1.5">
              Created on {formatDateTime(order.rawEvent?.created_at ?? order.createdAt)}
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
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
              <div className="text-xs text-[#BCBCBC] uppercase tracking-wide mb-2">Total Amount</div>
              <div className="text-xl sm:text-2xl font-semibold text-[#131313] mb-1">
                {formatCurrency(order.totalAmount)}
              </div>
              <div className="text-xs text-[#BCBCBC] space-y-0.5">
                <div>Subtotal: {formatCurrency(order.subtotalAmount)}</div>
                <div>Shipping: {formatCurrency(order.shippingAmount)}</div>
                <div>Tax: {formatCurrency(order.taxAmount)}</div>
              </div>
            </div>
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
              <div className="text-xs text-[#BCBCBC] uppercase tracking-wide mb-2">Commission</div>
              <div className="text-xl sm:text-2xl font-semibold text-[#10B981] mb-1">
                {formatCurrency(order.commissionAmount)}
              </div>
              <div className="text-xs text-[#BCBCBC]">
                {order.commissionRateValue}% · {order.commissionBasis}
              </div>
            </div>
          </div>

          {/* Attribution Card */}
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
            {order.appliedCoupons?.length > 0 && (
              <div className="text-xs text-[#BCBCBC] mt-2">
                Applied Coupons: {order.appliedCoupons.join(', ')}
              </div>
            )}
          </div>

          {/* Customer & Payment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-[#131313] mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-xs text-[#BCBCBC] mb-0.5">Name</div>
                  <div className="font-medium text-[#131313]">
                    {rawCustomer.first_name || rawCustomer.last_name
                      ? `${getValue(rawCustomer.first_name)} ${getValue(rawCustomer.last_name)}`.trim()
                      : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#BCBCBC] mb-0.5">Email</div>
                  <div className="font-medium text-[#131313] break-all">{getValue(order.customerEmail)}</div>
                </div>
                {order.rawEvent?.phone && (
                  <div>
                    <div className="text-xs text-[#BCBCBC] mb-0.5">Phone</div>
                    <div className="font-medium text-[#131313]">{getValue(order.rawEvent.phone)}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-[#131313] mb-3">Payment Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-xs text-[#BCBCBC] mb-0.5">Method</div>
                  <div className="font-medium text-[#131313]">{getValue(order.paymentMethod)}</div>
                </div>
                <div>
                  <div className="text-xs text-[#BCBCBC] mb-0.5">Status</div>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
                {order.rawEvent?.order_status_url && (
                  <div className="pt-1">
                    <a
                      href={order.rawEvent.order_status_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#3B82F6] hover:underline"
                    >
                      View order status page →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#131313] mb-4">Order Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Order ID:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.orderId)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Order Number:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.orderNumber)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Checkout Token:</span>
                <span className="font-medium text-[#131313] text-right break-all">{getValue(order.checkoutToken)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Pixel Event ID:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.pixelEventId)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Customer ID:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.customerId)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Currency:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.currencyCode)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Created At:</span>
                <span className="font-medium text-[#131313] text-right">{formatDateTime(order.createdAt)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Updated At:</span>
                <span className="font-medium text-[#131313] text-right">{formatDateTime(order.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#131313] mb-4">Financial Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Subtotal:</span>
                <span className="font-medium text-[#131313] text-right">{formatCurrency(order.subtotalAmount)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Shipping:</span>
                <span className="font-medium text-[#131313] text-right">{formatCurrency(order.shippingAmount)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Tax:</span>
                <span className="font-medium text-[#131313] text-right">{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Discounts Total:</span>
                <span className="font-medium text-[#131313] text-right">{formatCurrency(order.discountsTotal)}</span>
              </div>
              <div className="flex justify-between col-span-1 sm:col-span-2 border-t-2 border-[#E5E5E5] pt-3 mt-2">
                <span className="text-[#BCBCBC] font-semibold">Total Amount:</span>
                <span className="font-bold text-[#131313] text-lg text-right">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Commission Details */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#131313] mb-4">Commission Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Commission Amount:</span>
                <span className="font-medium text-[#10B981] text-right">{formatCurrency(order.commissionAmount)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Commission Currency:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.commissionCurrency)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Commission Rate Value:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.commissionRateValue)}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Commission Rate Type:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.commissionRateType)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Commission Basis:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.commissionBasis)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Commission Source:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.commissionSource)}</span>
              </div>
            </div>
          </div>

          {/* Attribution Details */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#131313] mb-4">Attribution Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Attributed Creator ID:</span>
                <span className="font-medium text-[#131313] text-right break-all">{getValue(order.attributedCreatorId)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Attribution Type:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.attributionType)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Attributed Coupon Code:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.attributedCouponCode)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Referral Code:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.referralCode)}</span>
              </div>
              <div className="flex justify-between col-span-1 sm:col-span-2 py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Applied Coupons:</span>
                <span className="font-medium text-[#131313] text-right">
                  {order.appliedCoupons && order.appliedCoupons.length > 0
                    ? order.appliedCoupons.join(', ')
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Refund Details */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#131313] mb-4">Payment & Refund Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Payment Status:</span>
                <div className="text-right">
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Payment Method:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.paymentMethod)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Refunded Amount:</span>
                <span className="font-medium text-[#131313] text-right">{formatCurrency(order.refundedAmount)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                <span className="text-[#BCBCBC]">Refund Reason:</span>
                <span className="font-medium text-[#131313] text-right">{getValue(order.refundReason)}</span>
              </div>
            </div>
          </div>

          {/* Customer Address Details */}
          {rawCustomer.default_address && (
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-[#131313] mb-4">Customer Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                  <span className="text-[#BCBCBC]">Address:</span>
                  <span className="font-medium text-[#131313] text-right">
                    {getValue(rawCustomer.default_address.address1)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                  <span className="text-[#BCBCBC]">City:</span>
                  <span className="font-medium text-[#131313] text-right">{getValue(rawCustomer.default_address.city)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                  <span className="text-[#BCBCBC]">State:</span>
                  <span className="font-medium text-[#131313] text-right">{getValue(rawCustomer.default_address.province)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                  <span className="text-[#BCBCBC]">Country:</span>
                  <span className="font-medium text-[#131313] text-right">{getValue(rawCustomer.default_address.country)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#E5E5E5] last:border-0">
                  <span className="text-[#BCBCBC]">ZIP:</span>
                  <span className="font-medium text-[#131313] text-right">{getValue(rawCustomer.default_address.zip)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Line Items */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5">
            <h3 className="text-sm font-semibold text-[#131313] mb-4">Order Items</h3>

            {/* Compact list on mobile */}
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
                        <div className="text-xs text-[#BCBCBC] mt-0.5">
                          {item.variant_title}
                        </div>
                      )}
                      <div className="text-xs text-[#BCBCBC] mt-1">
                        Qty: {quantity} × {formatCurrency(price)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-[#131313]">{formatCurrency(lineTotal)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full table on larger screens */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-[#BCBCBC] border-b border-[#E5E5E5]">
                    <th className="text-left py-3 pr-4 font-medium">Product</th>
                    <th className="text-left py-3 pr-4 font-medium">Quantity</th>
                    <th className="text-left py-3 pr-4 font-medium">Price</th>
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
                        <td className="py-3 pr-4 text-sm text-[#131313]">{formatCurrency(price)}</td>
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


