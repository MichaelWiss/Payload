'use client';

import { useState } from 'react';
import Link from 'next/link';
import { VariantSelector, ProductBlockRenderer } from '@/components/ui';
import { useAddToCart } from '@/lib/hooks/useAddToCart';
import { resolveVariants } from '@/lib/payload';
import { formatPrice } from '@/lib/utils';
import type { Product, Media } from '@/types/payload';
import './product-detail.css';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const variants = resolveVariants(product.variants);
  const { addToCart } = useAddToCart();

  // Get default variant or first available
  const defaultVariant =
    typeof product.defaultVariant === 'object' && product.defaultVariant !== null
      ? product.defaultVariant
      : variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState(
    defaultVariant?.id || variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];

  if (!selectedVariant) {
    return (
      <div className="wrap pdp-error">
        <p>This product is currently unavailable.</p>
        <Link href="/" className="btn">
          Back to Home
        </Link>
      </div>
    );
  }

  // Get product images
  const images: Media[] = (product.images || []).filter(
    (img): img is Media => typeof img === 'object' && img !== null
  );

  // Get category breadcrumbs
  const categories = (product.categories || [])
    .map((cat) => (typeof cat === 'string' ? null : cat))
    .filter((cat): cat is NonNullable<typeof cat> => cat !== null);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    // Optional: Show toast notification
    alert(`Added ${quantity}x ${product.title} (${selectedVariant.title}) to cart!`);
  };

  const isOutOfStock = selectedVariant.inventory <= 0;
  const maxQuantity = Math.min(selectedVariant.inventory, 10);

  return (
    <div className="pdp-container">
      {/* Breadcrumb */}
      <nav className="wrap pdp-breadcrumb">
        <Link href="/">Home</Link>
        {categories[0] && (
          <>
            <span>/</span>
            <Link href={`/categories/${categories[0].slug}`}>{categories[0].title}</Link>
          </>
        )}
        <span>/</span>
        <span>{product.title}</span>
      </nav>

      <div className="wrap pdp-grid">
        {/* Image Gallery */}
        <div className="pdp-gallery">
          {images.length > 0 ? (
            <>
              <div className="pdp-main-image">
                <img
                  src={images[activeImageIndex].url}
                  alt={images[activeImageIndex].alt || product.title}
                />
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
            </>
          ) : (
            <div className="pdp-no-image">
              <p>No image available</p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="pdp-info">
          <h1 className="pdp-title">{product.title}</h1>

          {categories.length > 0 && (
            <div className="pdp-categories">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="pdp-category-tag">
                  {cat.title}
                </Link>
              ))}
            </div>
          )}

          <div className="pdp-price">{formatPrice(selectedVariant.price)}</div>

          {product.description && <p className="pdp-description">{product.description}</p>}

          {/* Variant Selector */}
          {variants.length > 0 && (
            <VariantSelector
              variants={variants}
              selectedVariantId={selectedVariantId}
              onSelectVariant={setSelectedVariantId}
            />
          )}

          {/* Quantity & Add to Cart */}
          <div className="pdp-actions">
            <div className="pdp-quantity">
              <label htmlFor="quantity">Quantity</label>
              <div className="quantity-controls">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) {
                      setQuantity(Math.max(1, Math.min(maxQuantity, val)));
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              className="btn pdp-add-to-cart"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {!isOutOfStock && selectedVariant.inventory < 10 && (
            <p className="pdp-stock-warning">Only {selectedVariant.inventory} left in stock!</p>
          )}

          {/* SKU & Meta */}
          <div className="pdp-meta">
            <p>
              <strong>SKU:</strong> {selectedVariant.sku}
            </p>
          </div>
        </div>
      </div>

      {/* Product Blocks (Features, Specs, etc.) */}
      {product.blocks && product.blocks.length > 0 && (
        <div className="wrap pdp-blocks">
          <ProductBlockRenderer blocks={product.blocks} />
        </div>
      )}

      {/* Back Link */}
      <div className="wrap pdp-back">
        <Link href="/" className="pill">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
