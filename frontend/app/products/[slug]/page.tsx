import '../../page.css';
import './product-detail.css';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  fetchCategories,
  fetchFeaturedProducts,
  fetchProductBySlug,
  fetchProductsByCategoryId,
} from '@/lib/payload';
import { mapProductToCard } from '@/lib/mappers';
import type { Product } from '@/types/payload';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const title = product.seo?.title || product.title;
  const description = product.seo?.description || product.description || undefined;

  return {
    title: `${title} — Outrageous Store`,
    description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const categories = await fetchCategories();
  const marqueeItems = categories.map((category) => category.title).filter(Boolean);

  const relatedProducts = await getRelatedProducts(product);
  const relatedCards = relatedProducts.map((related, index) => mapProductToCard(related, index));

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      relatedProductCards={relatedCards}
      marqueeItems={marqueeItems}
    />
  );
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
  const relatedCategory = (product.categories || [])
    .map((cat) => (typeof cat === 'string' ? null : cat))
    .find((cat): cat is NonNullable<typeof cat> => Boolean(cat));

  let related: Product[] = [];

  if (relatedCategory) {
    related = await fetchProductsByCategoryId(relatedCategory.id);
  }

  if (!related.length) {
    related = await fetchFeaturedProducts(4);
  }

  return related
    .filter((item) => item.id !== product.id)
    .slice(0, 4);
}
