# Product Detail Page (PDP) - Step 2

Product detail pages built with Next.js App Router dynamic routes.

## Route Structure

```
/products/[slug]
├── page.tsx              (Server component - data fetching, metadata)
├── ProductDetailClient.tsx (Client component - interactivity)
├── not-found.tsx         (404 page)
└── product-detail.css    (Styles)
```

## Features

### Server Component (`page.tsx`)
- **Dynamic route** with `[slug]` parameter
- **Data fetching** via `fetchProductBySlug()` from Payload API
- **SEO metadata** generation with product-specific title/description
- **404 handling** using Next.js `notFound()` function
- **Async params** for Next.js 15+ compatibility

### Client Component (`ProductDetailClient.tsx`)
Interactive features requiring client-side JavaScript:

1. **Image Gallery**
   - Main image display with thumbnail navigation
   - Active thumbnail highlighting
   - Click to switch between images
   - Fallback for products without images

2. **Variant Selector**
   - Displays all product variants (sizes, options)
   - Shows price per variant
   - Out-of-stock detection and disabled state
   - Auto-selects default variant or first available

3. **Quantity Controls**
   - Increment/decrement buttons
   - Manual input field
   - Max quantity based on inventory (capped at 10)
   - Input validation

4. **Add to Cart**
   - Integrates with CartContext
   - Adds selected variant + quantity
   - Disabled when out of stock
   - Shows alert on successful add (temporary, replace with toast)

5. **Breadcrumb Navigation**
   - Home → Category → Product
   - Clickable category links
   - Current product highlighted

6. **Product Information**
   - Title, price, description
   - Category tags (clickable)
   - SKU display
   - Stock warning for low inventory

7. **Product Blocks**
   - Renders flexible Payload content blocks
   - Supports `feature` and `specs` block types
   - Rendered using `ProductBlockRenderer` component

## Data Flow

```
[User visits /products/artisan-olive-oil]
        ↓
[Server: page.tsx fetches product from Payload]
        ↓
[Server: Generates metadata for SEO]
        ↓
[Server: Passes product to ProductDetailClient]
        ↓
[Client: Renders interactive UI]
        ↓
[User: Selects variant, quantity]
        ↓
[User: Clicks "Add to Cart"]
        ↓
[Client: Calls useAddToCart hook]
        ↓
[CartContext: Updates cart state + localStorage]
```

## Usage Example

The page is automatically accessible at `/products/{slug}` for any product with an active slug.

### Linking to Product Pages

From any component:
```tsx
import Link from 'next/link';

<Link href={`/products/${product.slug}`}>
  {product.title}
</Link>
```

### Testing

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Visit: `http://localhost:3000/products/{any-product-slug}`

Example slugs (if using seed data):
- `/products/artisan-olive-oil`
- `/products/days-non-alc-spritz`

## Styling

All PDP styles are in `product-detail.css`:
- Two-column grid layout (responsive)
- Image gallery with thumbnails
- Quantity controls with +/- buttons
- Category tags and breadcrumbs
- Stock warnings and meta info

### CSS Variables Used
- `--smoke`: Light backgrounds
- `--ink`: Dark text/borders
- `--slate`: Muted text
- `--cream`: Hover/selected states
- `--error`: Out of stock warnings

## Accessibility

- Proper semantic HTML (`<article>`, `<nav>`, `<label>`)
- ARIA labels on buttons
- Keyboard navigable
- Focus states on interactive elements
- Alt text on images

## Next Steps

- Replace `alert()` with toast notifications
- Add related products section
- Add reviews display (if reviews exist)
- Add social sharing buttons
- Implement image zoom on click
