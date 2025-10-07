'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  product: string;
  amount: string;
  commission: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface RecentOrdersSectionProps {
  orders?: Order[];
  className?: string;
}

const RecentOrdersSection: React.FC<RecentOrdersSectionProps> = ({
  orders = [],
  className,
}) => {
  return (
    <div className={cn('relative overflow-hidden h-full rounded-3xl', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl blur-xl"></div>
      <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50 shadow-2xl h-full flex flex-col">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-gradient flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Recent Orders</h2>
            <p className="text-muted-foreground">Track your referral success</p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-16 text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-sm">📈</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Orders from your referral links will appear here once customers start purchasing
            </p>
            <div className="flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm text-primary font-medium">Waiting for orders...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="group relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{order.product}</h3>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground text-lg">{order.amount}</p>
                      <p className="text-sm text-success font-medium">Commission: {order.commission}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersSection;
