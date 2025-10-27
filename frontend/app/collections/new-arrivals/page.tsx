import "../../page.css";
import "../collections.css";
import type { Metadata } from "next";
import { fetchCategories, fetchFeaturedProducts } from "@/lib/payload/server";
import { mapProductToCard } from "@/lib/mappers";
import { CollectionPageClient } from "@/components/sections/CollectionPageClient";
import { fallbackCategories } from "@/lib/constants";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "New Arrivals — Outrageous Store",
  description:
    "Fresh drops from indie producers. Limited allocations, bold flavors, zero compromise.",
};

export default async function NewArrivalsPage() {
  const [categoriesResult, productsResult] = await Promise.allSettled([
    fetchCategories(),
    fetchFeaturedProducts(24),
  ]);

  const loadErrors: string[] = [];

  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  if (categoriesResult.status === "rejected") {
    loadErrors.push(
      categoriesResult.reason instanceof Error
        ? categoriesResult.reason.message
        : "We couldn't load categories for the ticker."
    );
  }

  const products =
    productsResult.status === "fulfilled" ? productsResult.value : [];
  if (productsResult.status === "rejected") {
    loadErrors.push(
      productsResult.reason instanceof Error
        ? productsResult.reason.message
        : "New arrivals are unavailable right now."
    );
  }

  const productCards = products.map((product, index) =>
    mapProductToCard(product, index)
  );
  const marqueeItems = categories.length
    ? categories.map((category) => category.title).filter(Boolean)
    : fallbackCategories;

  return (
    <Suspense fallback={<CollectionLoading />}>
      <CollectionPageClient
        title="New Arrivals"
        description="Fresh drops from indie producers. Limited allocations, bold flavors, and zero-compromise quality. These are the bottles and goods we’re hyped about right now."
        products={productCards}
        sourceProducts={products}
        marqueeItems={marqueeItems}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Collections", href: "/collections/new-arrivals" },
          { label: "New Arrivals" },
        ]}
        enableSearch={false}
        loadErrors={loadErrors}
      />
    </Suspense>
  );
}

function CollectionLoading() {
  return (
    <section className="collection-loading" aria-busy>
      <p>Loading collection…</p>
    </section>
  );
}
