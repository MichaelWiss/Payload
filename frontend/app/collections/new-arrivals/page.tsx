'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchFeaturedProducts } from '@/lib/payload';
import { mapProductToCard } from '@/lib/mappers';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import type { ProductCardData } from '@/lib/constants';
import type { CartItem } from '@/types/cart';
import './collections.css';

export default function NewArrivalsPage() {
  const { addItem, items } = useCart();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchFeaturedProducts(24);
        const cards = data.map(mapProductToCard);
        setProducts(cards);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load products:', error);
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleAddToCart = (product: ProductCardData) => {
    const cartItem: CartItem = {
      productId: product.id,
      productSlug: product.slug,
      title: product.title,
      variantId: product.id,
      variantTitle: 'Default',
      price: product.priceCents || 0,
      quantity: 1,
    };
    
    addItem(cartItem);
    console.log('Added to cart:', product.title);
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="collection-page">
      <header className="collection-header">
        <nav className="wrap nav">
          <Link href="/" className="brand keith-logo" aria-label="Outrageous Store logo">
            {Array.from('OUTRAGEOUS').map((char, index) => (
              <span key={`${char}-${index}`}>{char}</span>
            ))}
          </Link>
          <div className="links">
            <Link href="/" className="pill">
              Home
            </Link>
            <Link href="/collections/new-arrivals" className="pill active">
              New Arrivals
            </Link>
            <Link href="/cart" className="pill">
              Cart ({cartItemCount})
            </Link>
          </div>
        </nav>
      </header>

      <div className="wrap collection-content">
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>New Arrivals</span>
        </nav>

        <div className="collection-intro">
          <h1>New Arrivals</h1>
          <p>
            Fresh drops from indie producers. Limited allocations, bold flavors, and
            zero-compromise quality. These are the bottles and goods we&apos;re hyped about right now.
          </p>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products available at the moment.</p>
            <Link href="/" className="btn">
              Back to Home
            </Link>
          </div>
        ) : (
          <section className="products-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <Link href={`/products/${product.slug}`} className="product-card-link">
                  <div
                    className="product-image"
                    style={{ backgroundImage: `url('${product.image}')` }}
                    aria-hidden="true"
                  />
                  <h3 className="product-title">{product.title}</h3>
                  <div className="product-tag">{product.tag}</div>
                </Link>
                <div className="product-buy">
                  <span className="product-price">{formatPrice(product.priceCents)}</span>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      <footer className="collection-footer">
        <div className="wrap">
          <p>© 2025 Outrageous Store — Bold taste, soft hearts.</p>
          <Link href="/" className="pill">
            ← Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
