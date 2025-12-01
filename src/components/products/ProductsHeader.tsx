import React from 'react';

const ProductsHeader: React.FC = () => {
  return (
    <div className="mb-4 sm:mb-6 md:mb-8">
      <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2">
        Your Affiliated Products
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-3 sm:mb-4 md:mb-6">
        Track your commissions, discounts, and performance across all your affiliate products.
      </p>
    </div>
  );
};

export default ProductsHeader;