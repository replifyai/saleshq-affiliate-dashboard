'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Order } from './types';
import RewardStatusBadge, { RewardStatus } from './RewardStatusBadge';

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
  totalPages: propTotalPages,
  totalItems: propTotalItems,
  onPageChange,
  onViewDetails,
}) => {
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Mock function to determine reward status - replace with actual logic
  const getRewardStatus = (order: Order): { status: RewardStatus; daysLeft?: number } => {
    if (order.paymentStatus === 'refunded' || order.status === 'cancelled') {
      return { status: 'cancelled' };
    }
    if (order.paymentStatus === 'paid') {
      // Randomly assign for demo - replace with actual logic
      const statuses: RewardStatus[] = ['issued', 'payout_processed', 'days_left'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      if (randomStatus === 'days_left') {
        return { status: 'days_left', daysLeft: 7 };
      }
      return { status: randomStatus };
    }
    return { status: 'pending' };
  };

  const totalPages = propTotalPages ?? 1;
  const totalItems = propTotalItems ?? orders.length;

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E5E5]">
              <th className="px-6 py-4 text-left text-sm font-medium text-[#BCBCBC]">Order Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#BCBCBC]">Order ID</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#BCBCBC]">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#BCBCBC]">Total Amount</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#BCBCBC]">Reward</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#BCBCBC]">Reward Status</th>
                </tr>
              </thead>
          <tbody>
            {orders.map((order) => {
              const rewardInfo = getRewardStatus(order);
              return (
                <tr
                  key={order.id}
                  className="border-b border-[#E5E5E5] last:border-b-0 hover:bg-[#F5F5F5]/50 cursor-pointer transition-colors"
                        onClick={() => onViewDetails?.(order.id)}
                >
                  <td className="px-6 py-4 text-sm text-[#131313]">{formatDate(order.date)}</td>
                  <td className="px-6 py-4 text-sm text-[#131313]">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-[#131313]">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm text-[#131313]">{formatCurrency(order.orderValue)}</td>
                  <td className="px-6 py-4 text-sm text-[#131313]">{formatCurrency(order.commission)}</td>
                  <td className="px-6 py-4">
                    <RewardStatusBadge status={rewardInfo.status} daysLeft={rewardInfo.daysLeft} />
                    </td>
                  </tr>
              );
            })}
              </tbody>
            </table>
        </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-[#E5E5E5]">
        {orders.map((order) => {
          const rewardInfo = getRewardStatus(order);
          return (
            <div
              key={order.id}
              className="p-4 hover:bg-[#F5F5F5]/50 cursor-pointer transition-colors"
              onClick={() => onViewDetails?.(order.id)}
            >
              {/* Header with ID and Status */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#131313]">ID : {order.orderNumber}</span>
                <RewardStatusBadge status={rewardInfo.status} daysLeft={rewardInfo.daysLeft} />
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-[#E5E5E5] my-3" />

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-[#BCBCBC] text-xs mb-1">Ordered on</p>
                  <p className="text-[#131313]">{formatDate(order.date).split(' ').slice(0, 2).join(' ')}</p>
                </div>
                <div>
                  <p className="text-[#BCBCBC] text-xs mb-1">Total Amount</p>
                  <p className="text-[#131313]">{formatCurrency(order.orderValue)}</p>
                </div>
                <div>
                  <p className="text-[#BCBCBC] text-xs mb-1">Reward</p>
                  <p className="text-green-600">{formatCurrency(order.commission)}</p>
                </div>
              </div>
            </div>
          );
        })}
        </div>

        {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#E5E5E5]">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#BCBCBC]" />
          </button>
          <span className="text-sm text-[#636363]">
            Page {currentPage}/{totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#BCBCBC]" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
