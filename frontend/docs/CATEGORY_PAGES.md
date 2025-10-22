# Category Collection Pages - Step 3

Category pages for browsing products filtered by category.

## Route Structure

```
/categories
├── page.tsx                    (Categories index - all categories)
├── categories-index.css        (Index page styles)
└── [slug]
    ├── page.tsx                (Server component - data fetching, metadata)
    ├── CategoryPageClient.tsx  (Client component - interactivity)
    ├── category-page.css       (Category page styles)
    └── not-found.tsx           (404 page)
```

## Features

### Categories Index Page (`/categories`)

Lists all available categories in a grid layout.

**Features:**
- Grid of category cards
- Category images and descriptions
- Click to navigate to category collection
- Empty state for no categories
- SEO metadata

**Usage:**
```
Visit: http://localhost:3000/categories
```

### Category Collection Page (`/categories/[slug]`)

Shows all products within a specific category.

**Server Component (`page.tsx`):**
- Fetches category by slug
- Fetches all products in that category
- Generates SEO metadata
- Handles 404 for invalid slugs

**Client Component (`CategoryPageClient.tsx`):**
- CategoryHero with image, title, description
- Product count display
- ProductGrid with filtered products
- Add to cart functionality
- Breadcrumb navigation
- Empty state for categories with no products

## Data Flow

```
[User visits /categories/olive-oils]
        ↓
[Server: Fetch category by slug]
        ↓
[Server: Fetch products where category contains category.id]
        ↓
[Server: Generate metadata]
        ↓
[Server: Pass category + products to client]
        ↓
[Client: Render CategoryHero + ProductGrid]
        ↓
[User: Click product → Navigate to PDP]
[User: Click "Add to Cart" → Add to cart]
```

## Component Integration

### CategoryHero
Used in category collection pages to display:
- Category title
- Category description
- Category hero image
- Product count

### ProductGrid
Reusable grid component that:
- Displays filtered products
- Handles empty state
- Integrates with cart via `onAddToCart` callback
- Uses `ImprovedProductCard` components

### ImprovedProductCard
Each product card:
- Links to `/products/[slug]`
- Shows product image, title, price, tags
- Has "Add to Cart" button

## Usage Examples

### Linking to Categories

From any component:
```tsx
import Link from 'next/link';

// Link to category index
<Link href="/categories">Browse Categories</Link>

// Link to specific category
<Link href={`/categories/${category.slug}`}>
  {category.title}
</Link>
```

### In Product Detail Pages

Category tags in PDPs automatically link to category pages:
```tsx
<Link href={`/categories/${category.slug}`} className="pdp-category-tag">
  {category.title}
</Link>
```

## Empty States

### No Products in Category
Shows custom message:
```
"No products found in [Category Name]. Check back soon!"
```

### No Categories Available
Shows on index page if no categories exist:
```
"No categories available yet. Check back soon!"
```

## Testing

1. **Start servers:**
   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

2. **Visit category pages:**
   - All categories: `http://localhost:3000/categories`
   - Specific category: `http://localhost:3000/categories/{slug}`

3. **Test scenarios:**
   - Browse categories index
   - Click into a category
   - View filtered products
   - Add product to cart from category page
   - Navigate to product detail
   - Test breadcrumb navigation
   - Test empty category (create category with no products)
   - Test invalid category slug (should 404)

## Styling

**Categories Index:**
- Responsive grid layout (auto-fill)
- Category cards with hover effects
- Image + title + description
- Mobile-friendly (single column on small screens)

**Category Collection:**
- CategoryHero at top
- Product grid below
- Breadcrumb navigation
- Back link at bottom

**CSS Variables:**
- `--smoke`: Light backgrounds
- `--ink`: Dark text/borders  
- `--slate`: Muted text
- `--cream`: Hover states

## SEO & Metadata

### Categories Index
- Title: "Shop by Category — Outrageous Store"
- Description: "Browse our curated collection of products by category."

### Category Collection
- Title: "[Category Title] — Outrageous Store"
- Description: Category description or fallback

## Accessibility

- Semantic HTML (`<nav>`, `<header>`, `<main>`)
- Proper heading hierarchy
- Descriptive link text
- Alt text for category images
- Keyboard navigation
- Focus states

## API Endpoints Used

From `lib/payload.ts`:

1. **`fetchCategories()`**
   - Fetches all categories
   - Sorted by title
   - Used in categories index

2. **`fetchCategoryBySlug(slug)`**
   - Fetches single category by slug
   - Returns null if not found
   - Used in category collection pages

3. **`fetchProductsByCategoryId(categoryId)`**
   - Fetches products containing categoryId
   - Filters by active status
   - Depth=2 to populate variants
   - Used in category collection pages

## Next Steps

- Add filtering/sorting controls (price, name, date)
- Add pagination for large categories
- Add category-specific content blocks
- Add subcategories support
- Add "Related Categories" section
