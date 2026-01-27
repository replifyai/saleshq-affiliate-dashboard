'use client';

import React from 'react';

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
    return `₹${amount.toLocaleString('en-IN')}`;
  };
  const formatNumber = (value?: number | string | null): string => {
    if (value === undefined || value === null) {
      return '0';
    }
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    if (isNaN(numValue)) return '0';
    return numValue.toLocaleString('en-IN');
  };

  const cards = [
    { label: 'Your sales', value: formatCurrency(data.totalRevenue) },
    { label: 'Total Orders', value: formatNumber(data.totalOrders) },
    { label: 'Commission on sales', value: formatCurrency(data.totalCommission) },
    { label: 'Avg. Order value', value: formatCurrency(data.averageOrderValue) },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white border border-[#E5E5E5] rounded-2xl p-4 sm:p-5"
        >
          <span className="inline-block px-[6px] py-[6px] border border-[#EAEAEA] rounded-full text-[14px] text-[#636363] mb-4">
            {card.label}
          </span>
          <p className="text-xl sm:text-2xl font-semibold text-[#131313]">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderSummaryCards;
