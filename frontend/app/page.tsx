import "./page.css";
import { fetchCategories, fetchFeaturedProducts } from "@/lib/payload/server";
import { HomePageClient } from "@/components/sections/HomePageClient";
import type { Category, Product } from "@/types/payload";

type HomeData = {
  categories: Category[];
  products: Product[];
  errors: string[];
};

function getFriendlyError(reason: unknown, fallback: string): string {
  if (reason instanceof Error && reason.message) {
    return reason.message;
  }

  if (typeof reason === "string") {
    return reason;
  }

  return fallback;
}

async function loadHomeData(): Promise<HomeData> {
  const [categoriesResult, productsResult] = await Promise.allSettled([
    fetchCategories(),
    fetchFeaturedProducts(16),
  ]);

  const errors: string[] = [];

  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  if (categoriesResult.status === "rejected") {
    const message = getFriendlyError(
      categoriesResult.reason,
      "We couldn't load categories. Showing a curated mix instead."
    );
    errors.push(message);
    console.error("Failed to load categories for home page:", message);
  }

  const products =
    productsResult.status === "fulfilled" ? productsResult.value : [];
  if (productsResult.status === "rejected") {
    const message = getFriendlyError(
      productsResult.reason,
      "Featured products are unavailable right now."
    );
    errors.push(message);
    console.error("Failed to load featured products for home page:", message);
  }

  return { categories, products, errors };
}

export default async function HomePage() {
  const { categories, products, errors } = await loadHomeData();

  return (
    <HomePageClient
      categories={categories}
      featuredProducts={products}
      loadErrors={errors}
    />
  );
}
