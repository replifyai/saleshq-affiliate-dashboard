'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/services/apiClient';
import { CreatorOrder } from '@/types/api';
import { useSnackbar } from '@/components/snackbar/use-snackbar';
import {
  OrdersHeader,
  OrderSummaryCards,
  OrdersTable,
  OrdersFilters,
  OrdersSort,
  OrdersEmptyState,
  OrderDetailsModal,
  Order,
} from '@/components/orders';

// Helper function to map API order to display order
const mapApiOrderToOrder = (apiOrder: CreatorOrder): Order => {
  const orderValue = parseFloat(apiOrder.totalAmount) || 0;
  const commissionAmount = parseFloat(apiOrder.commissionAmount) || 0;
  const commissionRateValue = parseFloat(apiOrder.commissionRateValue) || 0;
  const discountAmount = parseFloat(apiOrder.discountsTotal) || 0;
  
  // Extract product name from line items
  let productName = 'Multiple Items';
  if (apiOrder.lineItems && apiOrder.lineItems.length > 0) {
    const firstItem = apiOrder.lineItems[0];
    productName = firstItem.title || firstItem.name || 'Product';
    if (apiOrder.lineItems.length > 1) {
      productName += ` +${apiOrder.lineItems.length - 1} more`;
    }
  }

  // Map attribution type to channel
  const channelMap: Record<string, Order['channel']> = {
    coupon: 'coupon',
    facebook: 'facebook',
    instagram: 'instagram',
    youtube: 'youtube',
  };
  const channel = channelMap[apiOrder.attributionType?.toLowerCase()] || 
                  channelMap[apiOrder.commissionSource?.toLowerCase()] || 
                  'coupon';

  // Infer status from payment status and other fields
  let status: Order['status'] = 'processing';
  if (apiOrder.paymentStatus === 'paid') {
    status = 'delivered'; // Default for paid orders
  } else if (apiOrder.paymentStatus === 'refunded') {
    status = 'refunded';
  } else if (apiOrder.paymentStatus === 'failed') {
    status = 'cancelled';
  } else {
    status = 'pending';
  }

  // Extract customer name and location from rawEvent where available
  const rawCustomer = apiOrder.rawEvent?.customer;
  const shippingAddress = apiOrder.rawEvent?.shipping_address;

  const firstName =
    rawCustomer?.first_name ||
    (apiOrder.customerEmail ? apiOrder.customerEmail.split('@')[0] : '') ||
    'Customer';
  const lastName = rawCustomer?.last_name || '';
  const customerName = `${firstName}${lastName ? ` ${lastName}` : ''}`;

  const customerCity = shippingAddress?.city || undefined;
  const customerCountry = shippingAddress?.country || undefined;

  // Coupon code shown to creator – prefer attributed coupon, then applied coupons
  const couponCode =
    apiOrder.attributedCouponCode ||
    (Array.isArray(apiOrder.appliedCoupons) && apiOrder.appliedCoupons.length > 0
      ? apiOrder.appliedCoupons[0]
      : undefined);

  return {
    id: apiOrder.id,
    orderNumber: apiOrder.orderNumber,
    customerName,
    productName,
    customerCity,
    customerCountry,
    orderValue,
    discountAmount,
    couponCode,
    commission: commissionAmount,
    commissionRate: commissionRateValue,
    date: new Date(apiOrder.createdAt).toISOString().split('T')[0],
    status,
    paymentStatus: apiOrder.paymentStatus,
    channel,
  };
};

export default function OrdersPage() {
  const { showError } = useSnackbar();
  const [orders, setOrders] = useState<Order[]>([]);
  const [rawOrders, setRawOrders] = useState<CreatorOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filter state
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [orderNumberFilter, setOrderNumberFilter] = useState('');
  const [debouncedOrderNumber, setDebouncedOrderNumber] = useState('');
  
  // Sort state
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Details modal state
  const [selectedOrder, setSelectedOrder] = useState<CreatorOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Debounce order number filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedOrderNumber(orderNumberFilter);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [orderNumberFilter]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const filters: { paymentStatus?: string; orderNumber?: string } = {};
      if (paymentStatusFilter) {
        filters.paymentStatus = paymentStatusFilter;
      }
      if (debouncedOrderNumber) {
        filters.orderNumber = debouncedOrderNumber;
      }

      const response = await apiClient.getCreatorOrders({
        page: currentPage,
        pageSize: itemsPerPage,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        sort: {
          by: sortBy,
          direction: sortDirection,
        },
      });

      // Handle cases where orders might not be an array
      const ordersArray = Array.isArray(response.orders) ? response.orders : [];
      const mappedOrders = ordersArray.map(mapApiOrderToOrder);
      setOrders(mappedOrders);
      setRawOrders(ordersArray);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalItems(response.pagination?.total || 0);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to fetch orders');
      setOrders([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, paymentStatusFilter, debouncedOrderNumber, sortBy, sortDirection]);

  const handleSort = (field: keyof Order) => {
    // Map display fields to API sort fields
    const sortFieldMap: Record<string, string> = {
      date: 'createdAt',
      orderValue: 'totalAmount',
      commission: 'commissionAmount',
      orderNumber: 'orderNumber',
    };
    
    const apiSortField = sortFieldMap[field] || 'createdAt';
    
    if (sortBy === apiSortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(apiSortField);
      setSortDirection('desc');
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleSortChange = (by: string, direction: 'asc' | 'desc') => {
    setSortBy(by);
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleClearFilters = () => {
    setPaymentStatusFilter('');
    setOrderNumberFilter('');
    setDebouncedOrderNumber('');
    setCurrentPage(1);
  };

  const handleViewDetails = (orderId: string) => {
    const fullOrder = rawOrders.find((o) => o.id === orderId);
    if (fullOrder) {
      setSelectedOrder(fullOrder);
      setIsDetailsOpen(true);
    }
  };

  // Calculate summary data from all orders
  const summaryData = useMemo(() => {
    if (orders.length === 0) {
      return {
        totalOrders: totalItems,
        totalRevenue: 0,
        totalCommission: 0,
        averageOrderValue: 0,
      };
    }

    const totalRevenue = orders.reduce((sum, order) => sum + order.orderValue, 0);
    const totalCommission = orders.reduce((sum, order) => sum + order.commission, 0);
    
    return {
      totalOrders: totalItems,
      totalRevenue,
      totalCommission,
      averageOrderValue: totalRevenue / totalItems || 0,
    };
  }, [orders, totalItems]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-background via-background to-secondary/5 rounded-3xl h-[100dvh] overflow-y-auto scrollbar-hide-mobile">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-12 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-2 sm:mb-4"></div>
            <h2 className="text-base sm:text-xl font-semibold text-foreground">Loading orders...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Map sortBy back to display field for table
  const sortFieldMap: Record<string, keyof Order> = {
    createdAt: 'date',
    totalAmount: 'orderValue',
    commissionAmount: 'commission',
    orderNumber: 'orderNumber',
  };
  const displaySortField = sortFieldMap[sortBy] || 'date';

  return (
    <div className="bg-gradient-to-br from-background via-background to-secondary/5 rounded-3xl h-[100dvh] overflow-y-auto scrollbar-hide-mobile">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-6 sm:space-y-8">
        <OrdersHeader />
        <OrderSummaryCards data={summaryData} />
        
        {totalItems === 0 ? (
          // Show empty state when no orders
          <OrdersEmptyState />
        ) : (
          <>
            {/* Filters */}
            <OrdersFilters
              paymentStatus={paymentStatusFilter}
              orderNumber={orderNumberFilter}
              onPaymentStatusChange={setPaymentStatusFilter}
              onOrderNumberChange={setOrderNumberFilter}
              onClearFilters={handleClearFilters}
            />

            {/* Sort */}
            <OrdersSort
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
            />

            {/* Orders Table */}
            <OrdersTable
              orders={orders}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              totalItems={totalItems}
              sortField={displaySortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onPageChange={setCurrentPage}
              onViewDetails={handleViewDetails}
            />
          </>
        )}

        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedOrder(null);
          }}
        />
      </div>
    </div>
  );
}