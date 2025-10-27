'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAddToCart } from '@/lib/hooks/useAddToCart';
import { useToast } from '@/contexts/ToastContext';
import { resolveVariants } from '@/lib/payload/utils';
import type { Product, Variant } from '@/types/payload';
import type { ProductCardData } from '@/lib/constants';
import { fallbackCategories } from '@/lib/constants';
import { ProductCard } from '@/components/ui/ProductCard';
import { SiteHeader, SiteFooter } from './SiteChrome';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CollectionPageClientProps {
  title: string;
  description: string;
  products: ProductCardData[];
  marqueeItems?: string[];
  breadcrumbs?: BreadcrumbItem[];
  emptyMessage?: string;
  sourceProducts?: Product[];
}

export function CollectionPageClient({
  title,
  description,
  products,
  marqueeItems,
  breadcrumbs,
  emptyMessage = 'No products available at the moment.',
  sourceProducts,
}: CollectionPageClientProps) {
  const { items, addItem } = useCart();
  const { addToCart } = useAddToCart();
  const { showToast } = useToast();

  const cartItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const tickerItems = marqueeItems && marqueeItems.length ? marqueeItems : fallbackCategories;

  const handleAddToCart = (productCard: ProductCardData) => {
    const product = sourceProducts?.find((item) => item.slug === productCard.slug);

    if (product) {
      const variants = resolveVariants(product.variants);
      const preferredVariant: Variant | undefined =
        typeof product.defaultVariant === 'object' && product.defaultVariant !== null
          ? product.defaultVariant
          : variants[0];

      if (preferredVariant) {
        addToCart(product, preferredVariant, 1);
        showToast(`${product.title} added to cart`, { type: 'success' });
        return;
      }
    }

    addItem({
      productId: productCard.id,
      productSlug: productCard.slug,
      title: productCard.title,
      variantId: productCard.id,
      variantTitle: 'Default',
      price: productCard.priceCents || 0,
      quantity: 1,
    });
    showToast(`${productCard.title} added to cart`, { type: 'success' });
  };

  return (
    <div className="collection-layout">
      <div className="progress" aria-hidden />
      <SiteHeader marqueeItems={tickerItems} cartItemCount={cartItemCount} />
      <main className="wrap collection-body">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="breadcrumb">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <span key={`${crumb.label}-${index}`} className="breadcrumb-item">
                  {crumb.href && !isLast ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
                  {!isLast && <span className="breadcrumb-separator">/</span>}
                </span>
              );
            })}
          </nav>
        )}

        <section className="collection-hero reveal">
          <div>
            <span className="snipe">Curated Selection</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </section>

        {products.length > 0 ? (
          <section className="grid home-products">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                href={`/products/${product.slug}`}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </section>
        ) : (
          <div className="collection-empty">
            <p>{emptyMessage}</p>
            <Link href="/" className="btn">
              Back to Home
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
