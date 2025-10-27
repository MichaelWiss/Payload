'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { VariantSelector, ProductBlockRenderer } from '@/components/ui';
import { useCart } from '@/contexts/CartContext';
import { useAddToCart } from '@/lib/hooks/useAddToCart';
import { resolveVariants } from '@/lib/payload/utils';
import { useToast } from '@/contexts/ToastContext';
import type { Product, Variant, Media } from '@/types/payload';
import type { ProductCardData } from '@/lib/constants';
import { ProductCard } from '@/components/ui/ProductCard';
import { SiteHeader, SiteFooter } from '@/components/sections/SiteChrome';
import './product-detail.css';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  relatedProductCards: ProductCardData[];
  marqueeItems: string[];
  loadErrors?: string[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
  relatedProductCards,
  marqueeItems,
  loadErrors = [],
}: ProductDetailClientProps) {
  const { items } = useCart();
  const { addToCart } = useAddToCart();

  const variants = resolveVariants(product.variants);
  const defaultVariant =
    typeof product.defaultVariant === 'object' && product.defaultVariant !== null
      ? product.defaultVariant
      : variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant?.id || variants[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { showToast } = useToast();

  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId) || variants[0];
  const announcement =
    product.seo?.description ??
    'Get your corporate gift orders in early! Reserve your gifts now!';

  const cartItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const loadErrorMessages = useMemo(
    () => Array.from(new Set(loadErrors.filter(Boolean))),
    [loadErrors]
  );
  const hasLoadErrors = loadErrorMessages.length > 0;

  if (!selectedVariant) {
    return (
      <div className="pdp-empty">
        <p>This product is currently unavailable.</p>
        <Link href="/" className="btn">
          Back to Home
        </Link>
      </div>
    );
  }

  const images: Media[] = (product.images || []).filter(
    (img): img is Media => typeof img === 'object' && img !== null
  );

  const categories = (product.categories || [])
    .map((cat) => (typeof cat === 'string' ? null : cat))
    .filter((cat): cat is NonNullable<typeof cat> => cat !== null);

  const inventory = typeof selectedVariant.inventory === 'number' ? selectedVariant.inventory : 0;
  const isOutOfStock = inventory <= 0;
  const maxQuantity = isOutOfStock ? 1 : Math.min(inventory, 10);

  const detailItems = selectedVariant.attributes?.filter((attr) => attr?.name && attr?.value) ?? [];

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addToCart(product, selectedVariant, quantity);
    showToast(`Added ${quantity}× ${product.title}`, { type: 'success' });
  };

  const handleAddRelated = (related: Product) => {
    const relatedVariants = resolveVariants(related.variants);
    const primaryVariant =
      typeof related.defaultVariant === 'object' && related.defaultVariant !== null
        ? related.defaultVariant
        : relatedVariants[0];

    if (primaryVariant) {
      addToCart(related, primaryVariant, 1);
      showToast(`Added 1× ${related.title}`, { type: 'success' });
    }
  };

  return (
    <div className="pdp-layout">
      <div className="pdp-banner" role="status">{announcement}</div>
      <SiteHeader marqueeItems={marqueeItems} cartItemCount={cartItemCount} sticky={false} />
      <main className="wrap pdp-body">
        {hasLoadErrors && (
          <section className="alert alert--error" role="status">
            <p>Some product details are unavailable:</p>
            <ul>
              {loadErrorMessages.map((message, index) => (
                <li key={`pdp-error-${index}`}>{message}</li>
              ))}
            </ul>
          </section>
        )}
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          {categories[0] ? (
            <>
              <Link href={`/categories/${categories[0].slug}`}>{categories[0].title}</Link>
              <span className="breadcrumb-separator">/</span>
            </>
          ) : null}
          <span>{product.title}</span>
        </nav>

        <section className="pdp-hero">
          <div className="pdp-gallery">
            <div className="pdp-image-frame">
              {images.length > 0 ? (
                <img
                  src={images[activeImageIndex].url}
                  alt={images[activeImageIndex].alt || product.title}
                />
              ) : (
                <div className="pdp-image-placeholder">No image available</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="pdp-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    className={`pdp-thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={image.url} alt={image.alt || `Product image ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside className="pdp-panel">
            <header className="pdp-panel-header">
              <h1>{product.title}</h1>
              {selectedVariant?.title && (
                <p className="pdp-panel-subhead">{selectedVariant.title}</p>
              )}
              {product.description && <p>{product.description}</p>}
            </header>

            {detailItems.length > 0 && (
              <dl className="pdp-details-list">
                {detailItems.map((attr) => (
                  <div key={`${attr.name}-${attr.value}`}>
                    <dt>{attr.name}</dt>
                    <dd>{attr.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="pdp-panel-divider" aria-hidden />

            <div className="pdp-meta">
              <div className="pdp-price">{formatCurrency(selectedVariant.price)}</div>
              {categories.length > 0 && (
                <div className="pdp-tags">
                  {categories.map((cat) => (
                    <Link href={`/categories/${cat.slug}`} key={cat.id} className="pdp-tag">
                      {cat.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {variants.length > 1 && (
              <VariantSelector
                variants={variants}
                selectedVariantId={selectedVariantId}
                onSelectVariant={setSelectedVariantId}
              />
            )}

            <div className="pdp-actions">
              <div className="quantity-controls" aria-live="polite">
                <span className="sr-only">Selected quantity</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="btn pdp-add-to-cart"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? 'Out of Stock' : `Add to Cart — ${formatCurrency(selectedVariant.price)}`}
              </button>
            </div>
            {!isOutOfStock && inventory < 10 && (
              <p className="pdp-stock-warning">Only {inventory} left in stock!</p>
            )}

            <div className="pdp-meta-grid">
              <div>
                <strong>SKU</strong>
                <span>{selectedVariant.sku}</span>
              </div>
              <div>
                <strong>Inventory</strong>
                <span>{inventory}</span>
              </div>
              <div>
                <strong>Currency</strong>
                <span>{selectedVariant.currency?.toUpperCase?.() || 'USD'}</span>
              </div>
            </div>
          </aside>
        </section>

        {product.blocks && product.blocks.length > 0 && (
          <section className="pdp-blocks">
            <ProductBlockRenderer blocks={product.blocks} />
          </section>
        )}

        {relatedProductCards.length > 0 && (
          <section className="pdp-related">
            <h2>Similar Products</h2>
            <p className="pdp-related-copy">
              Rotating picks from the cellar. Each ships fast and pairs beautifully with a late-night slice.
            </p>
            <div className="grid home-products">
              {relatedProductCards.map((card) => (
                <ProductCard
                  key={card.id}
                  product={card}
                  href={`/products/${card.slug}`}
                  onAddToCart={() => {
                    const match = relatedProducts.find((item) => item.slug === card.slug);
                    if (match) {
                      handleAddRelated(match);
                    }
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function formatCurrency(value?: number | null) {
  if (typeof value !== 'number') return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value / 100);
}
