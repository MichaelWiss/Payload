/**
 * Data transformation utilities for converting Payload types to UI types
 */

import type { Product, Media } from '@/types/payload';
import type { ProductCardData } from './constants';
import { resolveVariants } from './payload';
import { getFallbackImage } from './utils';
import { fallbackProductImages } from './constants';

/**
 * Transform a Payload Product into a ProductCard for display
 * @param product - Product from Payload API
 * @param index - Index for fallback image selection
 * @returns ProductCard data
 */
export function mapProductToCard(product: Product, index: number): ProductCardData {
  const variants = resolveVariants(product.variants);
  
  // Prefer defaultVariant, fallback to first variant
  const preferredVariant =
    typeof product.defaultVariant === 'object' && product.defaultVariant !== null
      ? product.defaultVariant
      : variants[0];
  
  const priceCents = preferredVariant?.price ?? null;
  
  // Extract category titles for tag
  const categoryTitles = (product.categories ?? [])
    .map((category) => (typeof category === 'string' ? null : category?.title))
    .filter((title): title is string => Boolean(title));
  
  const tag = categoryTitles.slice(0, 2).join(' • ') || product.description?.slice(0, 40) || 'Limited drop';
  
  // Get product image or fallback
  const imageMedia = (product.images ?? []).find(
    (image): image is Media => typeof image !== 'string'
  );
  
  const fallbackImage = getFallbackImage(fallbackProductImages, index);
  
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    priceCents,
    tag,
    image: imageMedia?.url ?? fallbackImage,
  };
}
