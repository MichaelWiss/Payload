import "../../page.css";
import "./product-detail.css";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  fetchCategories,
  fetchFeaturedProducts,
  fetchProductBySlug,
  fetchProductsByCategoryId,
} from "@/lib/payload/server";
import { mapProductToCard } from "@/lib/mappers";
import type { Product } from "@/types/payload";
import type { ProductCardData } from "@/lib/constants";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductUnavailable } from "./ProductUnavailable";
import { fallbackCategories } from "@/lib/constants";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function getFriendlyError(reason: unknown, fallback: string): string {
  if (reason instanceof Error && reason.message) {
    return reason.message;
  }

  if (typeof reason === "string") {
    return reason;
  }

  return fallback;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await fetchProductBySlug(slug);

    if (!product) {
      return {
        title: "Product Not Found",
      };
    }

    const title = product.seo?.title || product.title;
    const description =
      product.seo?.description || product.description || undefined;

    return {
      title: `${title} — Outrageous Store`,
      description,
    };
  } catch (error) {
    const message = getFriendlyError(
      error,
      "Product details are temporarily unavailable."
    );
    return {
      title: "Product Unavailable — Outrageous Store",
      description: message,
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [categoriesResult, productResult] = await Promise.allSettled([
    fetchCategories(),
    fetchProductBySlug(slug),
  ]);

  const loadErrors: string[] = [];

  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  if (categoriesResult.status === "rejected") {
    loadErrors.push(
      getFriendlyError(
        categoriesResult.reason,
        "We couldn't load categories. Navigation links may be limited."
      )
    );
  }

  const marqueeItems = categories.length
    ? categories.map((category) => category.title).filter(Boolean)
    : fallbackCategories;

  if (productResult.status === "rejected") {
    const message = getFriendlyError(
      productResult.reason,
      "We couldn't load this product right now."
    );

    const suggested = await loadSuggestedProducts(slug);
    const mergedErrors = mergeErrors(loadErrors, suggested.errors);

    return (
      <ProductUnavailable
        slug={slug}
        marqueeItems={marqueeItems}
        suggestedProducts={suggested.cards}
        message={message}
        loadErrors={mergedErrors}
      />
    );
  }

  const product = productResult.value;

  if (!product) {
    const suggested = await loadSuggestedProducts(slug);
    const mergedErrors = mergeErrors(loadErrors, suggested.errors);

    return (
      <ProductUnavailable
        slug={slug}
        marqueeItems={marqueeItems}
        suggestedProducts={suggested.cards}
        loadErrors={mergedErrors}
      />
    );
  }

  const { products: relatedProducts, errors: relatedErrors } =
    await loadRelatedProducts(product);
  const relatedCards = relatedProducts.map((related, index) =>
    mapProductToCard(related, index)
  );

  const mergedErrors = mergeErrors(loadErrors, relatedErrors);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      relatedProductCards={relatedCards}
      marqueeItems={marqueeItems}
      loadErrors={mergedErrors}
    />
  );
}

function mergeErrors(...collections: string[][]): string[] {
  const merged = collections.flat().filter(Boolean);
  return Array.from(new Set(merged));
}

async function loadSuggestedProducts(
  slug: string
): Promise<{ cards: ProductCardData[]; errors: string[] }> {
  try {
    const suggested = await fetchFeaturedProducts(8);
    const cards = suggested
      .filter((item) => item.slug !== slug)
      .slice(0, 4)
      .map((item, index) => mapProductToCard(item, index));

    return { cards, errors: [] as string[] };
  } catch (error) {
    return {
      cards: [],
      errors: [
        getFriendlyError(
          error,
          "We couldn't load recommended products right now."
        ),
      ],
    };
  }
}

async function loadRelatedProducts(
  product: Product
): Promise<{ products: Product[]; errors: string[] }> {
  const errors: string[] = [];
  let related: Product[] = [];

  const relatedCategory = (product.categories || [])
    .map((cat) => (typeof cat === "string" ? null : cat))
    .find((cat): cat is NonNullable<typeof cat> => Boolean(cat));

  if (relatedCategory) {
    try {
      const response = await fetchProductsByCategoryId(relatedCategory.id, {
        limit: 8,
      });
      related = response?.docs ?? [];
    } catch (error) {
      errors.push(
        getFriendlyError(
          error,
          "Related products are unavailable at the moment."
        )
      );
    }
  }

  if (!related.length) {
    try {
      related = await fetchFeaturedProducts(4);
    } catch (error) {
      errors.push(
        getFriendlyError(
          error,
          "Featured recommendations are temporarily offline."
        )
      );
    }
  }

  const filtered = related
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return { products: filtered, errors };
}
