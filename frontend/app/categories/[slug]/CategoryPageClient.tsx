'use client';

import Link from 'next/link';
import { CategoryHero, ProductGrid } from '@/components/ui';
import { useAddToCart } from '@/lib/hooks/useAddToCart';
import type { Category, Product, Variant } from '@/types/payload';
import './category-page.css';

interface CategoryPageClientProps {
  category: Category;
  products: Product[];
}

export function CategoryPageClient({ category, products }: CategoryPageClientProps) {
  const { addToCart } = useAddToCart();

  const handleAddToCart = (product: Product, variant: Variant) => {
    addToCart(product, variant, 1);
    // Optional: Show toast notification
    alert(`Added ${product.title} to cart!`);
  };

  return (
    <div className="category-page">
      {/* Breadcrumb */}
      <nav className="wrap category-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/categories">Categories</Link>
        <span>/</span>
        <span>{category.title}</span>
      </nav>

      {/* Category Hero */}
      <CategoryHero category={category} productCount={products.length} />

      {/* Product Grid */}
      <div className="wrap category-products">
        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
          emptyMessage={`No products found in ${category.title}. Check back soon!`}
        />
      </div>

      {/* Back Link */}
      <div className="wrap category-back">
        <Link href="/" className="pill">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
