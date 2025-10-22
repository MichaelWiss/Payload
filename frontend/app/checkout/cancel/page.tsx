import Link from 'next/link';
import './cancel.css';

export default function CheckoutCancelPage() {
  return (
    <div className="checkout-cancel">
      <div className="wrap">
        <div className="cancel-content">
          <div className="cancel-icon">×</div>
          <h1>Checkout Cancelled</h1>
          <p className="cancel-message">
            Your checkout was cancelled. No payment has been processed.
          </p>
          <p className="cancel-info">
            Your cart items have been saved. You can return to complete your purchase anytime.
          </p>
          <div className="cancel-actions">
            <Link href="/cart" className="btn">
              Return to Cart
            </Link>
            <Link href="/" className="pill">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
