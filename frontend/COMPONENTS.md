# Component Library - Step 1

This document describes the reusable components created for Phase 3.

## Context & State Management

### CartContext (`contexts/CartContext.tsx`)
Global cart state management with localStorage persistence.

**Features:**
- Add, remove, and update cart items
- Automatic localStorage sync
- Quantity management
- Subtotal calculation
- Hydration safety for SSR

**Usage:**
```tsx
import { useCart } from '@/contexts/CartContext';

function MyComponent() {
  const { items, addItem, subtotal } = useCart();
  // ...
}
```

## UI Components

### ImprovedProductCard (`components/ui/ImprovedProductCard.tsx`)
Enhanced product card with Next.js routing and cart integration.

**Features:**
- Links to product detail page
- Displays primary image, title, price, category tags
- "Add to Cart" button with callback
- Fallback styling for missing images

**Usage:**
```tsx
import { ImprovedProductCard } from '@/components/ui';

<ImprovedProductCard 
  product={product} 
  onAddToCart={(product, variant) => addToCart(product, variant)}
/>
```

### ProductGrid (`components/ui/ProductGrid.tsx`)
Reusable grid layout for product listings.

**Features:**
- Responsive grid layout
- Empty state handling
- Cart integration support

**Usage:**
```tsx
import { ProductGrid } from '@/components/ui';

<ProductGrid 
  products={products}
  onAddToCart={(product, variant) => addToCart(product, variant)}
  emptyMessage="No products in this category."
/>
```

### VariantSelector (`components/ui/VariantSelector.tsx`)
Interactive variant selector for product detail pages.

**Features:**
- Single variant display (non-interactive)
- Multiple variant selection buttons
- Out-of-stock state handling
- Price display per variant
- Accessible (ARIA labels)

**Usage:**
```tsx
import { VariantSelector } from '@/components/ui';

<VariantSelector
  variants={variants}
  selectedVariantId={selectedId}
  onSelectVariant={(id) => setSelectedVariantId(id)}
/>
```

### ProductBlockRenderer (`components/ui/ProductBlockRenderer.tsx`)
Renders Payload's flexible content blocks.

**Supported Block Types:**
- `feature`: Heading, body text, optional media
- `specs`: Label/value specification list

**Usage:**
```tsx
import { ProductBlockRenderer } from '@/components/ui';

<ProductBlockRenderer blocks={product.blocks} />
```

### CategoryHero (`components/ui/CategoryHero.tsx`)
Hero section for category pages.

**Features:**
- Category title, description, image
- Product count display
- Responsive layout

**Usage:**
```tsx
import { CategoryHero } from '@/components/ui';

<CategoryHero category={category} productCount={products.length} />
```

## Hooks

### useAddToCart (`lib/hooks/useAddToCart.ts`)
Utility hook that wraps cart context for easy product-to-cart conversion.

**Usage:**
```tsx
import { useAddToCart } from '@/lib/hooks/useAddToCart';

function ProductPage() {
  const { addToCart } = useAddToCart();
  
  return (
    <button onClick={() => addToCart(product, selectedVariant, 1)}>
      Add to Cart
    </button>
  );
}
```

## Styling

All component styles are in `components/ui/components.css` and imported globally in the root layout.

**CSS Variables Used:**
- `--smoke`: Light gray borders/backgrounds
- `--ink`: Dark text/borders
- `--cream`: Selected state background
- `--slate`: Muted text color
- `--error`: Error/out-of-stock color

## Integration

The `CartProvider` is wrapped around the entire app in `app/layout.tsx`, making cart state available everywhere.

## Next Steps

These components will be used in:
- Step 2: Product detail pages (`/products/[slug]`)
- Step 3: Category collection pages (`/categories/[slug]`)
- Step 4: Cart page/drawer and checkout flow
