import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="wrap" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: '1rem' }}>
        Product Not Found
      </h1>
      <p style={{ fontSize: '18px', color: 'var(--slate, #666)', marginBottom: '2rem' }}>
        Sorry, we couldn&apos;t find the product you&apos;re looking for.
      </p>
      <Link href="/" className="btn">
        Back to Home
      </Link>
    </div>
  );
}
