'use client';

import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import './success.css';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on successful checkout
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="success-content">
      <div className="success-icon">✓</div>
      <h1>Order Complete!</h1>
      <p className="success-message">
        Thank you for your purchase. Your order has been received and is being processed.
      </p>
      {sessionId && (
        <p className="success-reference">
          Order reference: <code>{sessionId.slice(-12)}</code>
        </p>
      )}
      <p className="success-info">
        You will receive a confirmation email shortly with your order details.
      </p>
      <div className="success-actions">
        <Link href="/" className="btn">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="checkout-success">
      <div className="wrap">
        <Suspense
          fallback={
            <div className="success-content">
              <div className="success-icon">✓</div>
              <h1>Order Complete!</h1>
              <p className="success-message">Loading order details...</p>
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
