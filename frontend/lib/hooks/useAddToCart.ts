'use client';

import { useCart } from '@/contexts/CartContext';
import type { Product, Variant } from '@/types/payload';
import type { CartItem } from '@/types/cart';

export function useAddToCart() {
  const { addItem } = useCart();

  const addToCart = (product: Product, variant: Variant, quantity = 1) => {
    const cartItem: CartItem = {
      productId: product.id,
      productSlug: product.slug,
      title: product.title,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
    };

    addItem(cartItem);
  };

  return { addToCart };
}
