import '../../page.css';
import './product-detail.css';

export default function LoadingProductPage() {
  return (
    <div className="pdp-layout">
      <div className="pdp-banner" role="status">Loading product…</div>
      <main className="wrap pdp-body" aria-busy="true">
        <div className="pdp-hero">
          <div className="pdp-gallery skeleton-card" />
          <aside className="pdp-panel skeleton-card" />
        </div>
      </main>
    </div>
  );
}
