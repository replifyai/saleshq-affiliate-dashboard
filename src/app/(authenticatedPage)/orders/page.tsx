'use client';

import React, { useState, useMemo } from 'react';
import { OrdersHeader, OrderSummaryCards, OrdersTable, Order } from '@/components/orders';

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Order>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Mock data - In a real app, this would come from an API
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customerName: 'John Smith',
      productName: 'Premium Wireless Headphones',
      orderValue: 12999,
      commission: 1299.9,
      commissionRate: 10,
      date: '2024-01-15',
      status: 'delivered',
      paymentStatus: 'paid',
      channel: 'facebook',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customerName: 'Sarah Johnson',
      productName: 'Smart Fitness Tracker',
      orderValue: 8999,
      commission: 899.9,
      commissionRate: 10,
      date: '2024-01-14',
      status: 'shipped',
      paymentStatus: 'paid',
      channel: 'instagram',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customerName: 'Mike Wilson',
      productName: 'Bluetooth Speaker',
      orderValue: 4999,
      commission: 499.9,
      commissionRate: 10,
      date: '2024-01-13',
      status: 'processing',
      paymentStatus: 'paid',
      channel: 'youtube',
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      customerName: 'Emily Davis',
      productName: 'Gaming Mouse',
      orderValue: 2999,
      commission: 299.9,
      commissionRate: 10,
      date: '2024-01-12',
      status: 'pending',
      paymentStatus: 'pending',
      channel: 'coupon',
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-005',
      customerName: 'David Brown',
      productName: 'Mechanical Keyboard',
      orderValue: 7999,
      commission: 799.9,
      commissionRate: 10,
      date: '2024-01-11',
      status: 'cancelled',
      paymentStatus: 'refunded',
      channel: 'facebook',
    },
    {
      id: '6',
      orderNumber: 'ORD-2024-006',
      customerName: 'Lisa Anderson',
      productName: 'Wireless Charger',
      orderValue: 1999,
      commission: 199.9,
      commissionRate: 10,
      date: '2024-01-10',
      status: 'delivered',
      paymentStatus: 'paid',
      channel: 'instagram',
    },
    {
      id: '7',
      orderNumber: 'ORD-2024-007',
      customerName: 'Tom Miller',
      productName: 'USB-C Hub',
      orderValue: 3999,
      commission: 399.9,
      commissionRate: 10,
      date: '2024-01-09',
      status: 'shipped',
      paymentStatus: 'paid',
      channel: 'youtube',
    },
    {
      id: '8',
      orderNumber: 'ORD-2024-008',
      customerName: 'Anna Garcia',
      productName: 'Laptop Stand',
      orderValue: 2499,
      commission: 249.9,
      commissionRate: 10,
      date: '2024-01-08',
      status: 'delivered',
      paymentStatus: 'paid',
      channel: 'coupon',
    },
    {
      id: '9',
      orderNumber: 'ORD-2024-009',
      customerName: 'Chris Taylor',
      productName: 'Monitor Mount',
      orderValue: 5999,
      commission: 599.9,
      commissionRate: 10,
      date: '2024-01-07',
      status: 'processing',
      paymentStatus: 'paid',
      channel: 'facebook',
    },
    {
      id: '10',
      orderNumber: 'ORD-2024-010',
      customerName: 'Maria Rodriguez',
      productName: 'Desk Organizer',
      orderValue: 1499,
      commission: 149.9,
      commissionRate: 10,
      date: '2024-01-06',
      status: 'delivered',
      paymentStatus: 'paid',
      channel: 'instagram',
    },
    {
      id: '11',
      orderNumber: 'ORD-2024-011',
      customerName: 'James Lee',
      productName: 'Cable Management Kit',
      orderValue: 999,
      commission: 99.9,
      commissionRate: 10,
      date: '2024-01-05',
      status: 'shipped',
      paymentStatus: 'paid',
      channel: 'youtube',
    },
    {
      id: '12',
      orderNumber: 'ORD-2024-012',
      customerName: 'Jennifer White',
      productName: 'Ergonomic Chair',
      orderValue: 24999,
      commission: 2499.9,
      commissionRate: 10,
      date: '2024-01-04',
      status: 'pending',
      paymentStatus: 'pending',
      channel: 'coupon',
    },
  ];

  const sortedOrders = useMemo(() => {
    return [...mockOrders].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [sortField, sortDirection]);

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Calculate summary data
  const summaryData = useMemo(() => ({
    totalOrders: mockOrders.length,
    totalRevenue: mockOrders.reduce((sum, order) => sum + order.orderValue, 0),
    totalCommission: mockOrders.reduce((sum, order) => sum + order.commission, 0),
    averageOrderValue: mockOrders.reduce((sum, order) => sum + order.orderValue, 0) / mockOrders.length,
  }), [mockOrders]);

  return (
    <div className="bg-gradient-to-br from-background via-background to-secondary/5 rounded-3xl h-[100dvh] overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 md:p-12">
        <OrdersHeader />
        <OrderSummaryCards data={summaryData} />
        <OrdersTable
          orders={sortedOrders}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}