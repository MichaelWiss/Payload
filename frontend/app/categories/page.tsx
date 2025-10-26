import '../page.css';
import './collections.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchCategories } from '@/lib/payload';
import { SiteHeader, SiteFooter } from '@/components/sections/SiteChrome';

export const metadata: Metadata = {
  title: 'Shop by Category — Outrageous Store',
  description: 'Browse our curated collection of products by category.',
};

export default async function CategoriesPage() {
  const categories = await fetchCategories();
  const marqueeItems = categories.map((category) => category.title).filter(Boolean);

  return (
    <div className="collection-layout">
      <SiteHeader marqueeItems={marqueeItems} />
      <main className="wrap collection-body">
        <nav className="breadcrumb">
          <span className="breadcrumb-item">
            <Link href="/">Home</Link>
            <span className="breadcrumb-separator">/</span>
          </span>
          <span className="breadcrumb-item">Categories</span>
        </nav>

        <section className="collection-hero reveal">
          <div>
            <span className="snipe">Explore everything</span>
            <h1>Shop by Category</h1>
            <p>Discover artisan products, zines, and tasty curios tailored to every palate.</p>
          </div>
        </section>

        {categories.length > 0 ? (
          <div className="grid home-products">
            {categories.map((category) => {
              const imageUrl =
                category.image && typeof category.image === 'object'
                  ? category.image.url
                  : null;

              return (
                <article className="product reveal" key={category.id}>
                  <Link href={`/categories/${category.slug}`}>
                    <div
                      className="img"
                      style={{
                        backgroundImage: imageUrl ? `url('${imageUrl}')` : 'none',
                        backgroundColor: imageUrl ? 'transparent' : 'var(--cream)',
                      }}
                      aria-hidden
                    />
                    <h3>{category.title}</h3>
                    {category.description && <div className="meta">{category.description}</div>}
                  </Link>
                  <div className="buy">
                    <span className="price">Explore</span>
                    <Link className="btn" href={`/categories/${category.slug}`}>
                      View
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="collection-empty">
            <p>No categories available yet. Check back soon!</p>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
