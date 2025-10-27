import "../../page.css";
import "../../collections/collections.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchCategories,
  fetchCategoryBySlug,
  fetchProductsByCategoryId,
} from "@/lib/payload/server";
import { mapProductToCard } from "@/lib/mappers";
import { CollectionPageClient } from "@/components/sections/CollectionPageClient";
import { fallbackCategories } from "@/lib/constants";
import { SiteHeader, SiteFooter } from "@/components/sections/SiteChrome";
import { Suspense } from "react";
import Link from "next/link";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[]>>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await fetchCategoryBySlug(slug);

    if (!category) {
      return {
        title: "Category Not Found",
      };
    }

    return {
      title: `${category.title} — Outrageous Store`,
      description: category.description || `Shop our collection of ${category.title} products.`,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Category temporarily unavailable";
    return {
      title: "Category Unavailable — Outrageous Store",
      description: message,
    };
  }
}

function getQueryParam(
  params: Record<string, string | string[]>,
  key: string
): string | null {
  const value = params[key];
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({}),
  ]);

  const limit = 12;
  const sortOptions = [
    { value: "-createdAt", label: "Newest" },
    { value: "title", label: "Alphabetical" },
    { value: "createdAt", label: "Oldest" },
  ];

  const pageParam = getQueryParam(resolvedSearchParams, "page");
  const sortParam = getQueryParam(resolvedSearchParams, "sort");
  const searchTermParam = getQueryParam(resolvedSearchParams, "search");

  const page = pageParam && Number(pageParam) > 0 ? Number(pageParam) : 1;
  const sort = sortOptions.some((option) => option.value === sortParam)
    ? sortParam!
    : "-createdAt";
  const searchTerm = searchTermParam ? searchTermParam.trim() : "";

  let category;

  try {
    category = await fetchCategoryBySlug(slug);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "We couldn't load this category. Please try again later.";

    return (
      <div className="collection-layout">
        <SiteHeader marqueeItems={fallbackCategories} />
        <main className="wrap collection-body">
          <section className="collection-hero reveal">
            <div>
              <span className="snipe">Curated selection</span>
              <h1>Category unavailable</h1>
              <p>{message}</p>
            </div>
          </section>
          <section className="collection-empty">
            <p>We couldn't load this category right now.</p>
            <Link href="/" className="btn">
              Back to Home
            </Link>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  const [categoriesResult, productsResult] = await Promise.allSettled([
    fetchCategories(),
    fetchProductsByCategoryId(category.id, {
      page,
      limit,
      sort,
      search: searchTerm,
    }),
  ]);

  const loadErrors: string[] = [];

  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  if (categoriesResult.status === "rejected") {
    const message =
      categoriesResult.reason instanceof Error
        ? categoriesResult.reason.message
        : "We couldn't load the category list.";
    loadErrors.push(message);
  }

  const productResponse =
    productsResult.status === "fulfilled" ? productsResult.value : undefined;

  if (productsResult.status === "rejected") {
    const message =
      productsResult.reason instanceof Error
        ? productsResult.reason.message
        : "Products are unavailable at the moment.";
    loadErrors.push(message);
  }

  const products = productResponse?.docs ?? [];
  const productCards = products.map((product, index) =>
    mapProductToCard(product, index)
  );
  const marqueeItems = categories.length
    ? categories.map((item) => item.title).filter(Boolean)
    : fallbackCategories;

  const description = category.description
    ? category.description
    : `Explore the latest from our ${category.title} collection.`;

  const pagination = {
    page: productResponse?.page ?? page,
    totalPages: productResponse?.totalPages ?? 1,
    totalDocs: productResponse?.totalDocs,
  };

  const emptyMessage = searchTerm
    ? `No products matched “${searchTerm}”. Try a different keyword or filter.`
    : `No products found in ${category.title}. Check back soon!`;

  return (
    <Suspense fallback={<CollectionFallback title={category.title ?? "Category"} /> }>
      <CollectionPageClient
        title={category.title ?? "Category"}
        description={description}
        products={productCards}
        sourceProducts={products}
        marqueeItems={marqueeItems}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.title ?? "Category" },
        ]}
        emptyMessage={emptyMessage}
        loadErrors={loadErrors}
        pagination={pagination}
        pageSize={limit}
        sortOptions={sortOptions}
        selectedSort={sort}
        searchTerm={searchTerm}
      />
    </Suspense>
  );
}

function CollectionFallback({ title }: { title: string }) {
  return (
    <section className="collection-loading" aria-busy>
      <h2 className="sr-only">Loading {title}</h2>
      <p>Loading collection…</p>
    </section>
  );
}
