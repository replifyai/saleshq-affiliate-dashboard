// Types
export interface SalesDataPoint {
  date: string;
  sales: number;
  clicks: number;
  conversions: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  commission: number;
  referralDiscount: number;
  performance: number;
  status: 'active' | 'paused' | 'inactive';
  image?: string;
  description?: string;
  lastUpdated: string;
  isFavorite?: boolean;
  recentSales?: number;
  salesGrowth?: number;
  affiliateLink?: string;
  salesData?: SalesDataPoint[];
}

export interface Category {
  name: string;
  avgCommission: number;
  avgDiscount: number;
  topProduct: string;
  revenueShare: number;
  productCount: number;
}

export interface SummaryCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string | React.ReactElement;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}