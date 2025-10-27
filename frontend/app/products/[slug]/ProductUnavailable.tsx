import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { SiteHeader, SiteFooter } from "@/components/sections/SiteChrome";
import type { ProductCardData } from "@/lib/constants";
import "../../page.css";
import "./product-detail.css";

interface ProductUnavailableProps {
  slug: string;
  marqueeItems: string[];
  suggestedProducts?: ProductCardData[];
  message?: string;
  loadErrors?: string[];
}

export function ProductUnavailable({
  slug,
  marqueeItems,
  suggestedProducts = [],
  message,
  loadErrors = [],
}: ProductUnavailableProps) {
  const loadErrorMessages = Array.from(new Set(loadErrors.filter(Boolean)));
  const hasLoadErrors = loadErrorMessages.length > 0;
  const heading = message ? "Product Temporarily Unavailable" : "Product Not Found";

  const defaultBody = (
    <p>
      Sorry, we couldn’t find the product “<span className="pdp-slug">{slug}</span>”. It may have been
      removed or is taking a quick break from the shelf.
    </p>
  );

  const customBody = message ? (
    <>
      <p>{message}</p>
      <p>
        Reference slug: <span className="pdp-slug">{slug}</span>
      </p>
    </>
  ) : null;

  return (
    <div className="pdp-layout">
      <SiteHeader marqueeItems={marqueeItems} sticky={false} />
      <main className="wrap pdp-body">
        {hasLoadErrors && (
          <section className="alert alert--error" role="status">
            <ul>
              {loadErrorMessages.map((text, index) => (
                <li key={`pdp-unavailable-error-${index}`}>{text}</li>
              ))}
            </ul>
          </section>
        )}
        <section className="pdp-empty">
          <div className="pdp-unavailable-card">
            <h1>{heading}</h1>
            {customBody ?? defaultBody}
            <div className="pdp-unavailable-actions">
              <Link href="/" className="btn">
                Back to Home
              </Link>
              <Link href="/collections/new-arrivals" className="btn alt">
                Explore New Arrivals
              </Link>
            </div>
          </div>
        </section>

        {suggestedProducts.length > 0 && (
          <section className="pdp-related">
            <h2>Editors’ Picks</h2>
            <p className="pdp-related-copy">
              While we track it down, here are a few bottles and curiosities we’re loving right now.
            </p>
            <div className="grid home-products">
              {suggestedProducts.map((card) => (
                <ProductCard key={card.id} product={card} href={`/products/${card.slug}`} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
