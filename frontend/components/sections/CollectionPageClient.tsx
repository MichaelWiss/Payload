'use client';

import {
  useEffect,
  useMemo,
  useState,
  useTransition,
  type FormEvent,
  type ChangeEvent,
} from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAddToCart } from '@/lib/hooks/useAddToCart';
import { useToast } from '@/contexts/ToastContext';
import { resolveVariants } from '@/lib/payload/utils';
import type { Product, Variant } from '@/types/payload';
import type { ProductCardData } from '@/lib/constants';
import { fallbackCategories } from '@/lib/constants';
import { ProductCard } from '@/components/ui/ProductCard';
import { SiteHeader, SiteFooter } from './SiteChrome';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CollectionPageClientProps {
  title: string;
  description: string;
  products: ProductCardData[];
  marqueeItems?: string[];
  breadcrumbs?: BreadcrumbItem[];
  emptyMessage?: string;
  sourceProducts?: Product[];
  loadErrors?: string[];
  pagination?: {
    page: number;
    totalPages: number;
    totalDocs?: number;
  };
  pageSize?: number;
  sortOptions?: Array<{ label: string; value: string }>;
  selectedSort?: string;
  searchTerm?: string;
  enableSearch?: boolean;
}

export function CollectionPageClient({
  title,
  description,
  products,
  marqueeItems,
  breadcrumbs,
  emptyMessage = 'No products available at the moment.',
  sourceProducts,
  loadErrors = [],
  pagination,
  pageSize,
  sortOptions,
  selectedSort,
  searchTerm = '',
  enableSearch = true,
}: CollectionPageClientProps) {
  const { items, addItem } = useCart();
  const { addToCart } = useAddToCart();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchTerm);

  useEffect(() => {
    setSearchValue(searchTerm);
  }, [searchTerm]);

  const cartItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const tickerItems = marqueeItems && marqueeItems.length ? marqueeItems : fallbackCategories;
  const loadErrorMessages = useMemo(
    () => Array.from(new Set(loadErrors.filter(Boolean))),
    [loadErrors]
  );
  const hasLoadErrors = loadErrorMessages.length > 0;
  const sortOptionsAvailable = Boolean(sortOptions && sortOptions.length);
  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const totalDocs = pagination?.totalDocs;
  const sortValue = selectedSort ?? sortOptions?.[0]?.value ?? '';

  const updateQuery = (updates: Record<string, string | null>, resetPage = true) => {
    const nextParams = new URLSearchParams(searchParams?.toString() ?? '');
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    if (resetPage) {
      nextParams.delete('page');
    }

    const queryString = nextParams.toString();
    startTransition(() => {
      router.push(queryString ? `?${queryString}` : '?');
    });
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateQuery({ search: searchValue.trim() || null });
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    updateQuery({ sort: event.target.value }, true);
  };

  const navigateToPage = (nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams?.toString() ?? '');
    if (nextPage <= 1) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(nextPage));
    }

    const queryString = nextParams.toString();
    startTransition(() => {
      router.push(queryString ? `?${queryString}` : '?');
    });
  };

  const handleAddToCart = (productCard: ProductCardData) => {
    const product = sourceProducts?.find((item) => item.slug === productCard.slug);

    if (product) {
      const variants = resolveVariants(product.variants);
      const preferredVariant: Variant | undefined =
        typeof product.defaultVariant === 'object' && product.defaultVariant !== null
          ? product.defaultVariant
          : variants[0];

      if (preferredVariant) {
        addToCart(product, preferredVariant, 1);
        showToast(`${product.title} added to cart`, { type: 'success' });
        return;
      }
    }

    addItem({
      productId: productCard.id,
      productSlug: productCard.slug,
      title: productCard.title,
      variantId: productCard.id,
      variantTitle: 'Default',
      price: productCard.priceCents || 0,
      quantity: 1,
    });
    showToast(`${productCard.title} added to cart`, { type: 'success' });
  };

  const renderPaginationMeta = () => {
    if (!pagination || totalPages <= 1 || !pageSize || typeof totalDocs !== 'number') {
      return null;
    }

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalDocs);
    return (
      <span>
        Page {currentPage} of {totalPages} · Showing {start}–{end} of {totalDocs}
      </span>
    );
  };

  const shouldShowToolbar =
    (enableSearch ?? true) || sortOptionsAvailable || Boolean(pagination);

  return (
    <div className="collection-layout">
      <div className="progress" aria-hidden />
      <SiteHeader marqueeItems={tickerItems} cartItemCount={cartItemCount} />
      <main className="wrap collection-body">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="breadcrumb">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <span key={`${crumb.label}-${index}`} className="breadcrumb-item">
                  {crumb.href && !isLast ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
                  {!isLast && <span className="breadcrumb-separator">/</span>}
                </span>
              );
            })}
          </nav>
        )}

        <section className="collection-hero reveal">
          <div>
            <span className="snipe">Curated Selection</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </section>

        {shouldShowToolbar && (
          <section className="collection-toolbar" aria-label="Collection filters">
            {enableSearch && (
              <form className="collection-toolbar__search" onSubmit={handleSearchSubmit}>
                <label htmlFor="collection-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="collection-search"
                  type="search"
                  name="search"
                  placeholder="Search this collection"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  autoComplete="off"
                />
                <button className="btn" type="submit" disabled={isPending}>
                  {isPending ? 'Searching…' : 'Search'}
                </button>
              </form>
            )}

            {sortOptionsAvailable && (
              <div className="collection-toolbar__filters">
                <label htmlFor="collection-sort">Sort by</label>
                <select
                  id="collection-sort"
                  value={sortValue}
                  onChange={handleSortChange}
                  disabled={isPending}
                >
                  {sortOptions!.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </section>
        )}

        {hasLoadErrors && (
          <section className="alert alert--error" role="status">
            <p>Heads up: some data is missing:</p>
            <ul>
              {loadErrorMessages.map((message, index) => (
                <li key={`collection-error-${index}`}>{message}</li>
              ))}
            </ul>
          </section>
        )}

        {products.length > 0 ? (
          <section className="grid home-products">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                href={`/products/${product.slug}`}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </section>
        ) : (
          <div className="collection-empty">
            <p>{emptyMessage}</p>
            <Link href="/" className="btn">
              Back to Home
            </Link>
          </div>
        )}

        {pagination && totalPages > 1 && (
          <nav className="collection-pagination" aria-label="Collection pagination">
            <button
              type="button"
              className="btn"
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={isPending || currentPage <= 1}
            >
              Prev
            </button>
            {renderPaginationMeta() ?? (
              <span>
                Page {currentPage} of {totalPages}
              </span>
            )}
            <button
              type="button"
              className="btn"
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={isPending || currentPage >= totalPages}
            >
              Next
            </button>
          </nav>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
