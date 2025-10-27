import '../../page.css';
import '../collections/collections.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  fetchCategories,
  fetchCategoryBySlug,
  fetchProductsByCategoryId,
} from '@/lib/payload/server';
import { mapProductToCard } from '@/lib/mappers';
import { CollectionPageClient } from '@/components/sections/CollectionPageClient';

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await fetchCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.title} — Outrageous Store`,
    description: category.description || `Shop our collection of ${category.title} products.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await fetchCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProductsByCategoryId(category.id),
  ]);

  const productCards = products.map((product, index) => mapProductToCard(product, index));
  const marqueeItems = categories.map((item) => item.title).filter(Boolean);

  const description = category.description
    ? category.description
    : `Explore the latest from our ${category.title} collection.`;

  return (
    <CollectionPageClient
      title={category.title ?? 'Category'}
      description={description}
      products={productCards}
      sourceProducts={products}
      marqueeItems={marqueeItems}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Categories', href: '/categories' },
        { label: category.title ?? 'Category' },
      ]}
      emptyMessage={`No products found in ${category.title}. Check back soon!`}
    />
  );
}
