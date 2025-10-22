'use client';

import { ImprovedProductCard } from './ImprovedProductCard';
import type { Product, Variant } from '@/types/payload';

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product, variant: Variant) => void;
  emptyMessage?: string;
  className?: string;
}

export function ProductGrid({
  products,
  onAddToCart,
  emptyMessage = 'No products found.',
  className = '',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className={`product-grid-empty ${className}`}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <section className={`grid ${className}`}>
      {products.map((product) => (
        <ImprovedProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </section>
  );
}
