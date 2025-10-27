import type { Variant } from '@/types/payload';

export function resolveVariant(variant: Variant | string | undefined | null): Variant | null {
  if (!variant) return null;
  if (typeof variant === 'string') {
    return null;
  }
  return variant;
}

export function resolveVariants(
  variants: Array<Variant | string | undefined> | undefined | null
): Variant[] {
  if (!variants) return [];
  return variants.filter((variant): variant is Variant => typeof variant !== 'string' && !!variant);
}
