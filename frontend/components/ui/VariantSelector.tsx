'use client';

import { formatPrice } from '@/lib/utils';
import type { Variant } from '@/types/payload';

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariantId: string;
  onSelectVariant: (variantId: string) => void;
  className?: string;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelectVariant,
  className = '',
}: VariantSelectorProps) {
  if (variants.length === 0) {
    return null;
  }

  // If only one variant, show it but don't make it interactive
  if (variants.length === 1) {
    const variant = variants[0];
    return (
      <div className={`variant-selector single ${className}`}>
        <div className="variant-option selected">
          <span className="variant-title">{variant.title}</span>
          <span className="variant-price">{formatPrice(variant.price)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`variant-selector ${className}`}>
      <label htmlFor="variant-select" className="variant-label">
        Select Size / Option
      </label>
      <div className="variant-options">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          const isOutOfStock = variant.inventory <= 0;
          
          return (
            <button
              key={variant.id}
              type="button"
              className={`variant-option ${isSelected ? 'selected' : ''} ${
                isOutOfStock ? 'out-of-stock' : ''
              }`}
              onClick={() => !isOutOfStock && onSelectVariant(variant.id)}
              disabled={isOutOfStock}
              aria-pressed={isSelected}
              aria-label={`${variant.title} - ${formatPrice(variant.price)}${
                isOutOfStock ? ' - Out of stock' : ''
              }`}
            >
              <span className="variant-title">{variant.title}</span>
              <span className="variant-price">{formatPrice(variant.price)}</span>
              {isOutOfStock && <span className="stock-badge">Out of Stock</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
