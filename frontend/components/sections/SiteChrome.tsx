'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { marqueeText } from '@/lib/constants';

const BRAND_LETTERS = Array.from('OUTRAGEOUS');

interface NavItem {
  label: string;
  href: string;
}

interface SiteHeaderProps {
  marqueeItems?: string[];
  cartItemCount?: number;
  navItems?: NavItem[];
  className?: string;
  sticky?: boolean;
}

export function SiteHeader({
  marqueeItems = [],
  cartItemCount = 0,
  navItems,
  className = '',
  sticky = true,
}: SiteHeaderProps) {
  const items = navItems ?? [
    { label: 'Shop', href: '#' },
    { label: 'Stories', href: '#' },
    { label: 'Club', href: '#' },
  ];

  const headerClass = [
    'site-header',
    sticky ? '' : 'site-header--static',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const tickerItems = useMemo(() => {
    if (!marqueeItems || marqueeItems.length === 0) return [];
    const minItems = 6;
    const maxLoops = 6;
    const loops = Math.min(maxLoops, Math.max(2, Math.ceil(minItems / marqueeItems.length)));
    return Array.from({ length: loops }).flatMap(() => marqueeItems);
  }, [marqueeItems]);

  return (
    <header className={headerClass}>
      <nav className="wrap nav">
        <Link href="/" className="brand keith-logo" aria-label="Outrageous Store logo">
          {BRAND_LETTERS.map((char, index) => (
            <span className="logo-letter" key={`${char}-${index}`}>
              {char}
            </span>
          ))}
        </Link>
        <div className="links">
          {items.map((item) => (
            <Link className="pill" href={item.href} key={item.label}>
              {item.label}
            </Link>
          ))}
          <Link className="pill" href="/cart">
            Cart ({cartItemCount})
          </Link>
        </div>
      </nav>
      {tickerItems.length > 0 && (
        <div className="ticker" aria-hidden>
          <div className="wrap ticker-wrap">
            <div className="marquee-track ticker-track">
              {[0, 1].map((copyIndex) => (
                <div
                  className="marquee-segment"
                  key={`ticker-segment-${copyIndex}`}
                  aria-hidden={copyIndex > 0}
                >
                  {tickerItems.map((text, index) => (
                    <span key={`ticker-${copyIndex}-${index}`}>{text}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="checker" aria-hidden />
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
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
            OUTRAGEOUS  ✺  ZINE-POWERED  ✺  BOUTIQUE  ✺  DEMO
          </textPath>
        </text>
      </svg>
      <p className="fine">© 2025 Outrageous Store — Images via Unsplash.</p>
      <section className="final-marquee" aria-hidden>
        <div className="marquee-track final-marquee-track">
          {[0, 1].map((copyIndex) => (
            <div
              className="marquee-segment"
              key={`fm-segment-${copyIndex}`}
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
