'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/services/apiClient';
import { CreatorOrder } from '@/types/api';
import { useSnackbar } from '@/components/snackbar/use-snackbar';
import {
  OrdersHeader,
  OrderSummaryCards,
  OrdersTable,
  OrdersTabs,
  OrdersEmptyState,
  OrderDetailsModal,
  Order,
} from '@/components/orders';
import { OrderTab } from '@/components/orders/OrdersTabs';

// Helper function to map API order to display order
const mapApiOrderToOrder = (apiOrder: CreatorOrder): Order => {
  const orderValue = parseFloat(apiOrder.totalAmount) || 0;
  const commissionAmount = parseFloat(apiOrder.commissionAmount) || 0;
  const commissionRateValue = parseFloat(apiOrder.commissionRateValue) || 0;
  const discountAmount = parseFloat(apiOrder.discountsTotal) || 0;
  
  let productName = 'Multiple Items';
  if (apiOrder.lineItems && apiOrder.lineItems.length > 0) {
    const firstItem = apiOrder.lineItems[0];
    productName = firstItem.title || firstItem.name || 'Product';
    if (apiOrder.lineItems.length > 1) {
      productName += ` +${apiOrder.lineItems.length - 1} more`;
    }
  }

  const channelMap: Record<string, Order['channel']> = {
    coupon: 'coupon',
    facebook: 'facebook',
    instagram: 'instagram',
    youtube: 'youtube',
  };
  const channel = channelMap[apiOrder.attributionType?.toLowerCase()] || 
                  channelMap[apiOrder.commissionSource?.toLowerCase()] || 
                  'coupon';

  let status: Order['status'] = 'processing';
  if (apiOrder.paymentStatus === 'paid') {
    status = 'delivered';
  } else if (apiOrder.paymentStatus === 'refunded') {
    status = 'refunded';
  } else if (apiOrder.paymentStatus === 'failed') {
    status = 'cancelled';
  } else {
    status = 'pending';
  }

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
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  // Tab and filter state
  const [activeTab, setActiveTab] = useState<OrderTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [orderNumberFilter, setOrderNumberFilter] = useState('');
  const [debouncedOrderNumber, setDebouncedOrderNumber] = useState('');
  
  // Sort state
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Details modal state
  const [selectedOrder, setSelectedOrder] = useState<CreatorOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce order number filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedOrderNumber(orderNumberFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [orderNumberFilter]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const filters: { paymentStatus?: string; orderNumber?: string } = {};
      
      // Apply tab filter (overrides payment status filter)
      if (activeTab === 'payout_pending') {
        filters.paymentStatus = 'pending';
      } else if (activeTab === 'payout_done') {
        filters.paymentStatus = 'paid';
      } else if (paymentStatusFilter) {
        filters.paymentStatus = paymentStatusFilter;
      }
      
      // Use order number filter from filter drawer, or search query from search bar
      if (debouncedOrderNumber) {
        filters.orderNumber = debouncedOrderNumber;
      } else if (debouncedSearch) {
        filters.orderNumber = debouncedSearch;
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

      const ordersArray = Array.isArray(response.orders) ? response.orders : [];
      const mappedOrders = ordersArray.map(mapApiOrderToOrder);
      setOrders(mappedOrders);
      setRawOrders(ordersArray);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalItems(response.pagination?.total || 0);
      setLastRefreshed(new Date());
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
  }, [currentPage, activeTab, debouncedSearch, debouncedOrderNumber, paymentStatusFilter, sortBy, sortDirection]);

  const handleSort = (field: keyof Order) => {
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
    setCurrentPage(1);
  };

  const handleSortChange = (by: string, direction: 'asc' | 'desc') => {
    setSortBy(by);
    setSortDirection(direction);
    setCurrentPage(1);
  };

  const handleViewDetails = (orderId: string) => {
    const fullOrder = rawOrders.find((o) => o.id === orderId);
    if (fullOrder) {
      setSelectedOrder(fullOrder);
      setIsDetailsOpen(true);
    }
  };

  const handleTabChange = (tab: OrderTab) => {
    setActiveTab(tab);
    setPaymentStatusFilter(''); // Reset payment filter when changing tabs
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setPaymentStatusFilter('');
    setOrderNumberFilter('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Calculate summary data
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

  const sortFieldMap: Record<string, keyof Order> = {
    createdAt: 'date',
    totalAmount: 'orderValue',
    commissionAmount: 'commission',
    orderNumber: 'orderNumber',
  };
  const displaySortField = sortFieldMap[sortBy] || 'date';

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-3 border-[#131313] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#BCBCBC]">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <OrdersHeader lastRefreshed={lastRefreshed} />

        {/* Summary Cards */}
        <OrderSummaryCards data={summaryData} />

        {/* Tabs and Filters */}
        <OrdersTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          paymentStatus={paymentStatusFilter}
          onPaymentStatusChange={setPaymentStatusFilter}
          orderNumberFilter={orderNumberFilter}
          onOrderNumberFilterChange={setOrderNumberFilter}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
        />
        
        {totalItems === 0 ? (
          <OrdersEmptyState />
        ) : (
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
