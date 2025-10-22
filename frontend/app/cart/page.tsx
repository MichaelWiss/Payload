'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import './cart.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleUpdateQuantity = (variantId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(variantId);
    } else {
      updateQuantity(variantId, quantity);
    }
  };

  const handleCheckout = async () => {
    setError('');

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerEmail: email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const error = err as Error;
      console.error('Checkout error:', error);
      setError(error.message || 'Failed to start checkout');
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="wrap">
          <nav className="cart-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Cart</span>
          </nav>

          <div className="cart-empty">
            <h1>Your Cart is Empty</h1>
            <p>Add some amazing products to get started!</p>
            <Link href="/" className="btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="wrap">
        <nav className="cart-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Cart</span>
        </nav>

        <h1 className="cart-title">Shopping Cart</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.variantId} className="cart-item">
                <div className="cart-item-info">
                  <Link href={`/products/${item.productSlug}`} className="cart-item-title">
                    {item.title}
                  </Link>
                  <div className="cart-item-variant">{item.variantTitle}</div>
                  <div className="cart-item-price">{formatPrice(item.price)}</div>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-quantity-controls">
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.variantId, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.variantId, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>

                  <button
                    type="button"
                    className="cart-item-remove"
                    onClick={() => removeItem(item.variantId)}
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="cart-summary-row">
              <span>Subtotal ({items.length} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="cart-email">
              <label htmlFor="customer-email">Email Address</label>
              <input
                id="customer-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <div className="cart-error">{error}</div>}

            <button
              className="btn cart-checkout-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <button
              type="button"
              className="cart-clear"
              onClick={clearCart}
              disabled={isCheckingOut}
            >
              Clear Cart
            </button>

            <Link href="/" className="cart-continue">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
