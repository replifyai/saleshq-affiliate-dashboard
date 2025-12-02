import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Order } from './types';
import ChannelBadge from './ChannelBadge';
import Pagination from './Pagination';
import PaymentStatusBadge from './PaymentStatusBadge';

interface OrdersTableProps {
  orders: Order[];
  currentPage: number;
  itemsPerPage: number;
  totalPages?: number;
  totalItems?: number;
  sortField: keyof Order;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Order) => void;
  onPageChange: (page: number) => void;
  onViewDetails?: (orderId: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  currentPage,
  itemsPerPage,
  totalPages: propTotalPages,
  totalItems: propTotalItems,
  sortField,
  sortDirection,
  onSort,
  onPageChange,
  onViewDetails,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Use server-side pagination if provided, otherwise fall back to client-side
  const totalPages = propTotalPages ?? Math.ceil(orders.length / itemsPerPage);
  const totalItems = propTotalItems ?? orders.length;
  // Orders are already paginated from server, so use them directly
  const paginatedOrders = orders;

  return (
    <div className="relative w-full max-w-full rounded-3xl overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFD100]/15 via-[#FFFAE6]/25 to-[#FFD100]/10 rounded-3xl blur-xl" />

      <div className="relative bg-gradient-to-br from-[#FFFAE6]/60 to-white rounded-3xl border border-[#FFD100]/40 shadow-2xl">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-[#FFD100]/30 bg-[#FFFAE6]/30">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Order History</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track your earnings and order performance
          </p>
        </div>

        {/* Desktop / tablet table */}
        <div className="hidden md:block">
          <div className="w-full max-w-full overflow-x-auto scrollbar-thin">
            <table className="min-w-full border-separate border-spacing-0">
              <thead className="bg-[#FFFAE6]/40 border-b border-[#FFD100]/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <button
                      onClick={() => onSort('orderNumber')}
                      className="flex items-center space-x-1 hover:text-foreground transition-colors"
                    >
                      <span>Order #</span>
                      {sortField === 'orderNumber' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <span>Customer</span>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <button
                      onClick={() => onSort('orderValue')}
                      className="flex items-center space-x-1 hover:text-foreground transition-colors"
                    >
                      <span>Total</span>
                      {sortField === 'orderValue' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <button
                      onClick={() => onSort('commission')}
                      className="flex items-center space-x-1 hover:text-foreground transition-colors"
                    >
                      <span>Commission</span>
                      {sortField === 'commission' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Coupon
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <button
                      onClick={() => onSort('date')}
                      className="flex items-center space-x-1 hover:text-foreground transition-colors"
                    >
                      <span>Date</span>
                      {sortField === 'date' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFD100]/20">
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FFFAE6]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div className="flex flex-col">
                        <span
                          className="font-medium truncate max-w-[160px]"
                          title={order.customerName}
                        >
                          {order.customerName}
                        </span>
                        {(order.customerCity || order.customerCountry) && (
                          <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                            {[order.customerCity, order.customerCountry].filter(Boolean).join(', ')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                      {formatCurrency(order.orderValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-success">
                      {formatCurrency(order.commission)}
                      <div className="text-xs text-muted-foreground">
                        ({order.commissionRate}%)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {order.couponCode ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {order.couponCode}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ChannelBadge channel={order.channel} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        type="button"
                        onClick={() => onViewDetails?.(order.id)}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 text-xs sm:text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards (no horizontal overflow) */}
        <div className="md:hidden px-4 py-3 space-y-3">
          {paginatedOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-[#FFD100]/40 bg-gradient-to-br from-[#FFFAE6]/50 to-white p-3 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Order #{order.orderNumber}
                  </p>
                  <p
                    className="text-sm font-semibold text-foreground truncate max-w-[180px]"
                    title={order.customerName}
                  >
                    {order.customerName}
                  </p>
                  {(order.customerCity || order.customerCountry) && (
                    <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                      {[order.customerCity, order.customerCountry].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                <ChannelBadge channel={order.channel} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[11px] text-muted-foreground">Total</p>
                  <p className="font-semibold text-foreground">
                    {formatCurrency(order.orderValue)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Commission</p>
                  <p className="font-semibold text-success">
                    {formatCurrency(order.commission)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    ({order.commissionRate}%)
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Coupon</p>
                  {order.couponCode ? (
                    <span className="inline-flex mt-0.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                      {order.couponCode}
                    </span>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">—</p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Date</p>
                  <p className="text-xs text-foreground">{formatDate(order.date)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <PaymentStatusBadge status={order.paymentStatus} />
                <button
                  type="button"
                  onClick={() => onViewDetails?.(order.id)}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium"
                >
                  View details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 pb-4 pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;