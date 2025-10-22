import type { Category } from '@/types/payload';

interface CategoryHeroProps {
  category: Category;
  productCount?: number;
}

export function CategoryHero({ category, productCount }: CategoryHeroProps) {
  const imageUrl =
    category.image && typeof category.image === 'object'
      ? category.image.url
      : null;

  return (
    <section className="category-hero">
      <div className="wrap">
        {imageUrl && (
          <div
            className="category-hero-image"
            style={{ backgroundImage: `url('${imageUrl}')` }}
            aria-hidden
          />
        )}
        <div className="category-hero-content">
          <h1 className="category-title">{category.title}</h1>
          {category.description && (
            <p className="category-description">{category.description}</p>
          )}
          {typeof productCount === 'number' && (
            <p className="category-count">
              {productCount} {productCount === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
