import "../page.css";
import "./collections.css";
import Link from "next/link";
import type { Metadata } from "next";
import { fetchCategories } from "@/lib/payload/server";
import type { Category } from "@/types/payload";
import { SiteHeader, SiteFooter } from "@/components/sections/SiteChrome";
import { fallbackCategories, fallbackProductImages } from "@/lib/constants";
import { getFallbackImage } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Collections — Outrageous Store",
  description:
    "Browse every collection in the shop: fresh drops, best sellers, and genre-defining categories pulled live from Payload.",
};

export default async function CollectionsPage() {
  let categories: Category[] = [];
  let loadError: string | null = null;

  try {
    categories = await fetchCategories();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "We couldn't load categories right now.";
  }

  const marqueeItems = categories.length
    ? categories.map((category) => category.title).filter(Boolean)
    : fallbackCategories;

  const collectionCards = [
    {
      title: "New Arrivals",
      description: "Fresh drops straight from the cellar and studio.",
      href: "/collections/new-arrivals",
      image: getFallbackImage(fallbackProductImages, 0),
    },
    ...categories.map((category, index) => {
      const imageUrl =
        category.image && typeof category.image === "object"
          ? category.image.url
          : null;

      return {
        title: category.title,
        description:
          category.description ||
          "A curated slice of the shop built around this category.",
        href: `/categories/${category.slug}`,
        image: imageUrl || getFallbackImage(fallbackProductImages, index + 1),
      };
    }),
  ];

  return (
    <div className="collection-layout">
      <SiteHeader marqueeItems={marqueeItems} />
      <main className="wrap collection-body">
        <section className="collection-hero reveal">
          <div>
            <span className="snipe">Guided browsing</span>
            <h1>Collections</h1>
            <p>
              Jump into themed collections sourced directly from Payload. Explore
              freshly stocked arrivals, category deep-dives, and curated sets
              built to keep the party loud.
            </p>
          </div>
        </section>

        {loadError && (
          <section className="alert alert--error" role="status">
            <p>{loadError}</p>
            <p>
              The live category list is unavailable, but you can still dive into
              New Arrivals or try again in a moment.
            </p>
          </section>
        )}

        <section className="grid home-products" aria-label="Collection list">
          {collectionCards.map((collection, index) => (
            <article className="product reveal" key={`${collection.href}-${index}`}>
              <Link href={collection.href}>
                <div
                  className="img"
                  style={{
                    backgroundImage: `url('${collection.image}')`,
                    backgroundColor: collection.image ? 'transparent' : 'var(--cream)',
                  }}
                  aria-hidden
                />
                <h3>{collection.title}</h3>
                <div className="meta">{collection.description}</div>
              </Link>
              <div className="buy">
                <span className="price">Explore</span>
                <Link className="btn" href={collection.href}>
                  View
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
