import './page.css';
import { fetchCategories, fetchFeaturedProducts } from '@/lib/payload/server';
import { HomePageClient } from '@/components/sections/HomePageClient';
import type { Category, Product } from '@/types/payload';

async function loadHomeData(): Promise<{ categories: Category[]; products: Product[] }> {
  const [categoriesResult, productsResult] = await Promise.allSettled([
    fetchCategories(),
    fetchFeaturedProducts(16),
  ]);

  const categories =
    categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
  const products =
    productsResult.status === 'fulfilled' ? productsResult.value : [];

  if (categoriesResult.status === 'rejected') {
    console.error('Failed to load categories for home page:', categoriesResult.reason);
  }
  if (productsResult.status === 'rejected') {
    console.error('Failed to load featured products for home page:', productsResult.reason);
  }

  return { categories, products };
}

export default async function HomePage() {
  const { categories, products } = await loadHomeData();

  return <HomePageClient categories={categories} featuredProducts={products} />;
}
