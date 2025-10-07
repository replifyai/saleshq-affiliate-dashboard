import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Order } from './types';
import StatusBadge from './StatusBadge';
import ChannelBadge from './ChannelBadge';
import Pagination from './Pagination';

interface OrdersTableProps {
  orders: Order[];
  currentPage: number;
  itemsPerPage: number;
  sortField: keyof Order;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Order) => void;
  onPageChange: (page: number) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  currentPage,
  itemsPerPage,
  sortField,
  sortDirection,
  onSort,
  onPageChange,
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

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl blur-xl"></div>
      <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-border/50 bg-card/50">
          <h2 className="text-xl font-semibold text-foreground">Order History</h2>
          <p className="text-sm text-muted-foreground">Track your earnings and order performance</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-card/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => onSort('orderNumber')}
                    className="flex items-center space-x-1 hover:text-foreground transition-colors"
                  >
                    <span>Order #</span>
                    {sortField === 'orderNumber' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => onSort('productName')}
                    className="flex items-center space-x-1 hover:text-foreground transition-colors"
                  >
                    <span>Product</span>
                    {sortField === 'productName' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => onSort('orderValue')}
                    className="flex items-center space-x-1 hover:text-foreground transition-colors"
                  >
                    <span>Order Value</span>
                    {sortField === 'orderValue' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => onSort('commission')}
                    className="flex items-center space-x-1 hover:text-foreground transition-colors"
                  >
                    <span>Commission</span>
                    {sortField === 'commission' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button
                    onClick={() => onSort('date')}
                    className="flex items-center space-x-1 hover:text-foreground transition-colors"
                  >
                    <span>Date</span>
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Channel
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-card/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <div className="max-w-xs truncate" title={order.productName}>
                      {order.productName}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ChannelBadge channel={order.channel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={orders.length}
        />
      </div>
    </div>
  );
};

export default OrdersTable;