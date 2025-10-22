import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchCategories } from '@/lib/payload';
import './categories-index.css';

export const metadata: Metadata = {
  title: 'Shop by Category — Outrageous Store',
  description: 'Browse our curated collection of products by category.',
};

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="categories-index">
      <div className="wrap">
        <nav className="categories-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Categories</span>
        </nav>

        <header className="categories-header">
          <h1>Shop by Category</h1>
          <p>Explore our curated collections of artisan products, zines, and more.</p>
        </header>

        {categories.length > 0 ? (
          <div className="categories-grid">
            {categories.map((category) => {
              const imageUrl =
                category.image && typeof category.image === 'object'
                  ? category.image.url
                  : null;

              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="category-card"
                >
                  {imageUrl && (
                    <div
                      className="category-card-image"
                      style={{ backgroundImage: `url('${imageUrl}')` }}
                      aria-hidden
                    />
                  )}
                  <div className="category-card-content">
                    <h2>{category.title}</h2>
                    {category.description && <p>{category.description}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="categories-empty">
            <p>No categories available yet. Check back soon!</p>
          </div>
        )}

        <div className="categories-back">
          <Link href="/" className="pill">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
