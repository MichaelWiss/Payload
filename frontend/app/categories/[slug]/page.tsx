import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchCategoryBySlug, fetchProductsByCategoryId } from '@/lib/payload';
import { CategoryPageClient } from './CategoryPageClient';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);

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
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Fetch products for this category
  const products = await fetchProductsByCategoryId(category.id);

  return <CategoryPageClient category={category} products={products} />;
}
