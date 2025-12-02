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
    <div className="w-full max-w-full overflow-hidden grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-[#FFFAE6]/60 to-white backdrop-blur-sm rounded-2xl p-3 md:p-4 border border-[#FFD100]/40 hover:border-[#FFD100]/60 transition-all min-w-0"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] md:text-sm text-muted-foreground truncate">{card.title}</p>
              <p className="text-lg md:text-2xl font-bold text-foreground truncate">
                {card.value}
              </p>
            </div>
            <div
              className={cn(
                'flex items-center justify-center rounded-xl flex-shrink-0',
                'w-8 h-8 md:w-10 md:h-10',
                card.color === 'primary' && 'bg-primary/20',
                card.color === 'success' && 'bg-success/20',
                card.color === 'accent' && 'bg-accent/20',
                card.color === 'secondary' && 'bg-primary/20'
              )}
            >
              <card.icon
                className={cn(
                  'w-4 h-4 md:w-5 md:h-5',
                  card.color === 'primary' && 'text-primary',
                  card.color === 'success' && 'text-success',
                  card.color === 'accent' && 'text-accent',
                  card.color === 'secondary' && 'text-primary'
                )}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSummaryCards;