/**
 * Currency formatter for USD
 */
export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/**
 * Format price from cents to currency string
 * @param cents - Price in cents (e.g., 2499 = $24.99)
 * @returns Formatted currency string or "—" if invalid
 */
export function formatPrice(cents: number | null | undefined): string {
  if (typeof cents !== 'number') {
    return '—';
  }
  return currencyFormatter.format(cents / 100);
}

/**
 * Get a fallback image by index from an array
 * @param images - Array of image URLs
 * @param index - Index to select (wraps around)
 * @returns Image URL
 */
export function getFallbackImage(images: string[], index: number): string {
  return images[index % images.length];
}
