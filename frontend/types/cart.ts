export interface CartItem {
  productId: string;
  productSlug: string;
  title: string;
  variantId: string;
  variantTitle: string;
  price: number;
  quantity: number;
}

export interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
}
