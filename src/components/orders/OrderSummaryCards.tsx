import React from 'react';
import { cn } from '@/lib/utils';
import { ShoppingBag, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

interface OrderSummaryCardsProps {
  data: {
    totalOrders: number;
    totalRevenue: number;
    totalCommission: number;
    averageOrderValue: number;
  };
}

const OrderSummaryCards: React.FC<OrderSummaryCardsProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Total Orders',
      value: data.totalOrders,
      icon: ShoppingBag,
      color: 'primary',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(data.totalRevenue),
      icon: DollarSign,
      color: 'success',
    },
    {
      title: 'Total Commission',
      value: formatCurrency(data.totalCommission),
      icon: TrendingUp,
      color: 'accent',
    },
    {
      title: 'Avg. Order Value',
      value: formatCurrency(data.averageOrderValue),
      icon: BarChart3,
      color: 'secondary',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
            </div>
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              card.color === 'primary' && 'bg-primary/20',
              card.color === 'success' && 'bg-success/20',
              card.color === 'accent' && 'bg-accent/20',
              card.color === 'secondary' && 'bg-primary/20'
            )}>
              <card.icon className={cn(
                'w-5 h-5',
                card.color === 'primary' && 'text-primary',
                card.color === 'success' && 'text-success',
                card.color === 'accent' && 'text-accent',
                card.color === 'secondary' && 'text-primary'
              )} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSummaryCards;