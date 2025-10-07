export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  orderValue: number;
  commission: number;
  commissionRate: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  channel: 'facebook' | 'instagram' | 'youtube' | 'coupon';
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export interface OrderSummaryData {
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  averageOrderValue: number;
}