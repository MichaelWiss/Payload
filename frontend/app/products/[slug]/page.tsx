import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchProductBySlug } from '@/lib/payload';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

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
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
