import type { ProductCardData } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: ProductCardData;
  onAddToCart?: (product: ProductCardData) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="product reveal">
      <div
        className="img"
        style={{ backgroundImage: `url('${product.image}')` }}
        aria-hidden
      />
      <h3>{product.title}</h3>
      <div className="meta">{product.tag}</div>
      <div className="buy">
        <span className="price">{formatPrice(product.priceCents)}</span>
        <button
          className="btn"
          type="button"
          onClick={() => onAddToCart?.(product)}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
