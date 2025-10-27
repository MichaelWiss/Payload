import Link from 'next/link';
import { ProductCard } from '@/components/ui/ProductCard';
import { SiteHeader, SiteFooter } from '@/components/sections/SiteChrome';
import type { ProductCardData } from '@/lib/constants';
import '../../page.css';
import './product-detail.css';

interface ProductUnavailableProps {
  slug: string;
  marqueeItems: string[];
  suggestedProducts: ProductCardData[];
}

export function ProductUnavailable({ slug, marqueeItems, suggestedProducts }: ProductUnavailableProps) {
  return (
    <div className="pdp-layout">
      <SiteHeader marqueeItems={marqueeItems} sticky={false} />
      <main className="wrap pdp-body">
        <section className="pdp-empty">
          <div className="pdp-unavailable-card">
            <h1>Product Not Found</h1>
            <p>
              Sorry, we couldn’t find the product “<span className="pdp-slug">{slug}</span>”. It may have been removed
              or is taking a quick break from the shelf.
            </p>
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
