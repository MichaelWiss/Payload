import '../../page.css';
import '../collections.css';
import type { Metadata } from 'next';
import { fetchCategories, fetchFeaturedProducts } from '@/lib/payload/server';
import { mapProductToCard } from '@/lib/mappers';
import { CollectionPageClient } from '@/components/sections/CollectionPageClient';

export const metadata: Metadata = {
  title: 'New Arrivals — Outrageous Store',
  description: 'Fresh drops from indie producers. Limited allocations, bold flavors, zero compromise.',
};

export default async function NewArrivalsPage() {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchFeaturedProducts(24),
  ]);

  const productCards = products.map((product, index) => mapProductToCard(product, index));
  const marqueeItems = categories.map((category) => category.title).filter(Boolean);

  return (
    <CollectionPageClient
      title="New Arrivals"
      description="Fresh drops from indie producers. Limited allocations, bold flavors, and zero-compromise quality. These are the bottles and goods we’re hyped about right now."
      products={productCards}
      sourceProducts={products}
      marqueeItems={marqueeItems}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Collections', href: '/collections/new-arrivals' },
        { label: 'New Arrivals' },
      ]}
    />
  );
}
