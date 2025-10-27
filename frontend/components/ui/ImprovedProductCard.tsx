'use client';

import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import type { Product, Variant } from '@/types/payload';
import { resolveVariants } from '@/lib/payload/utils';

interface ImprovedProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, variant: Variant) => void;
  className?: string;
}

export function ImprovedProductCard({ product, onAddToCart, className = '' }: ImprovedProductCardProps) {
  const variants = resolveVariants(product.variants);
  
  // Get primary variant for display
  const primaryVariant =
    typeof product.defaultVariant === 'object' && product.defaultVariant !== null
      ? product.defaultVariant
      : variants[0];

  if (!primaryVariant) {
    return null;
  }

  // Get primary image
  const primaryImage =
    product.images && product.images.length > 0
      ? typeof product.images[0] === 'object' && product.images[0] !== null
        ? product.images[0].url
        : null
      : null;

  // Get category labels for tag
  const categoryLabels = (product.categories ?? [])
    .map((cat) => (typeof cat === 'string' ? null : cat?.title))
    .filter(Boolean);
  
  const tag = categoryLabels.slice(0, 2).join(' • ') || primaryVariant.title;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product, primaryVariant);
  };

  return (
    <Link href={`/products/${product.slug}`} className={`product reveal ${className}`}>
      <article>
        <div
          className="img"
          style={{
            backgroundImage: primaryImage ? `url('${primaryImage}')` : 'none',
            backgroundColor: primaryImage ? 'transparent' : 'var(--smoke)',
          }}
          aria-hidden
        />
        <h3>{product.title}</h3>
        <div className="meta">{tag}</div>
        <div className="buy">
          <span className="price">{formatPrice(primaryVariant.price)}</span>
          <button
            className="btn"
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add ${product.title} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </article>
    </Link>
  );
}
