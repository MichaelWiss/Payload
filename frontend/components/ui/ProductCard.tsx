'use client';

import Link from 'next/link';
import type { ProductCardData } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: ProductCardData;
  href?: string;
  onAddToCart?: (product: ProductCardData) => void;
}

export function ProductCard({ product, href, onAddToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  const cardContent = (
    <>
      <div
        className="img"
        style={{ backgroundImage: `url('${product.image}')` }}
        aria-hidden
      />
      <h3>{product.title}</h3>
      <div className="meta">{product.tag}</div>
    </>
  );

  return (
    <article className="product reveal">
      {href ? <Link href={href}>{cardContent}</Link> : cardContent}
      <div className="buy">
        <span className="price">{formatPrice(product.priceCents)}</span>
        <button
          className="btn"
          type="button"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
