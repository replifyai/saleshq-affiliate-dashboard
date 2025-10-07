import React from 'react';

const ProductsHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-foreground mb-2">
        Your Affiliated Products
      </h1>
      <p className="text-lg text-muted-foreground mb-6">
        Track your commissions, discounts, and performance across all your affiliate products.
      </p>
    </div>
  );
};

export default ProductsHeader;