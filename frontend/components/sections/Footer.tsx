import { marqueeText } from '@/lib/constants';

export function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <div>
          <h4>About</h4>
          <p>
            Outrageous Store is an indie bottle and zine shop fused into an internet playground.
            Loud taste, soft hearts.
          </p>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            <li>
              <a href="#">New Arrivals</a>
            </li>
            <li>
              <a href="#">Best Sellers</a>
            </li>
            <li>
              <a href="#">Non-Alc</a>
            </li>
            <li>
              <a href="#">Gift Sets</a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul>
            <li>
              <a href="#">Shipping</a>
            </li>
            <li>
              <a href="#">Returns</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Terms &amp; Privacy</a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Follow</h4>
          <ul>
            <li>
              <a href="#">Instagram</a>
            </li>
            <li>
              <a href="#">TikTok</a>
            </li>
            <li>
              <a href="#">Newsletter</a>
            </li>
          </ul>
        </div>
      </div>
      <svg className="curve" viewBox="0 0 1000 250" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="arc" d="M20,200 C300,20 700,20 980,200" />
        </defs>
        <text dy="10">
          <textPath href="#arc" startOffset="50%" textAnchor="middle">
            OUTRAGEOUS ✺ ZINE-POWERED ✺ BOUTIQUE ✺ DEMO
          </textPath>
        </text>
      </svg>
      <p className="fine">© 2025 Outrageous Store — Images via Unsplash.</p>
      <section className="final-marquee" aria-hidden>
        <div className="marquee-track final-marquee-track">
          {[0, 1].map((copyIndex) => (
            <div
              className="marquee-segment"
              key={`footer-marquee-${copyIndex}`}
              aria-hidden={copyIndex > 0}
            >
              <span>{marqueeText}</span>
            </div>
          ))}
        </div>
      </section>
    </footer>
  );
}
