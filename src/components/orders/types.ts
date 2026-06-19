export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  customerCity?: string;
  customerCountry?: string;
  orderValue: number;
  discountAmount?: number;
  couponCode?: string;
  commission: number;
  commissionRate: number;
  createdAt: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  channel: 'facebook' | 'instagram' | 'youtube' | 'coupon' | 'referral';
  earningStatus?: 'pending_payment' | 'upcoming_payment' | 'approved' | 'void' | 'paid' | 'partially_voided' | 'deduction_pending' | 'held' | null;
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