import React from 'react';
import { Category } from './types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => (
  <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-foreground">{category.name}</h3>
      <div className="text-sm text-muted-foreground">{category.productCount} products</div>
    </div>
    
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Avg Commission</span>
        <span className="font-medium text-primary">{category.avgCommission}%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Avg Discount</span>
        <span className="font-medium text-primary">{category.avgDiscount}%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Top Product</span>
        <span className="font-medium text-foreground">{category.topProduct}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Revenue Share</span>
        <span className="font-medium text-accent">{category.revenueShare}%</span>
      </div>
    </div>
  </div>
);

export default CategoryCard;