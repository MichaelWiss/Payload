import type { ProductCardData } from '@/lib/constants';
import { ProductCard } from '../ui/ProductCard';

interface ProductGridProps {
  title: string;
  products: ProductCardData[];
  onAddToCart?: (product: ProductCardData) => void;
}

export function ProductGrid({ title, products, onAddToCart }: ProductGridProps) {
  return (
    <>
      <h2 className="title reveal">{title}</h2>
      <section className="grid" style={{ margin: '16px 0 28px' }}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            href={`/products/${product.slug}`}
            onAddToCart={onAddToCart}
          />
        ))}
      </section>
    </>
  );
}
