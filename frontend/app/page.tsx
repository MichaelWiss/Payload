/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './page.css';
import { fetchCategories, fetchFeaturedProducts } from '@/lib/payload';
import { formatPrice } from '@/lib/utils';
import { mapProductToCard } from '@/lib/mappers';
import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/types/cart';
import {
  fallbackCategories,
  fallbackNewProducts,
  fallbackBestProducts,
  stages,
  badges,
  marqueeText,
  type ProductCardData,
} from '@/lib/constants';

type StageStyle = CSSProperties & { '--stage-bg'?: string };

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { addItem, items } = useCart();
  const [categoryLabels, setCategoryLabels] = useState<string[]>(fallbackCategories);
  const [newProducts, setNewProducts] = useState<ProductCardData[]>(fallbackNewProducts);
  const [bestProducts, setBestProducts] = useState<ProductCardData[]>(fallbackBestProducts);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [categories, products] = await Promise.all([
          fetchCategories(),
          fetchFeaturedProducts(16),
        ]);

        if (cancelled) return;

        if (categories.length) {
          setCategoryLabels(categories.map((category) => category.title).filter(Boolean));
        }

        if (products.length) {
          const cards = products.map(mapProductToCard);
          const newSlice = cards.slice(0, 8);
          const bestSlice = cards.slice(8, 16);

          if (newSlice.length) {
            setNewProducts(newSlice);
          }

          if (bestSlice.length) {
            setBestProducts(bestSlice);
          } else if (newSlice.length) {
            setBestProducts(newSlice);
          }
        }
      } catch (error) {
        console.error("Failed to load storefront data", error);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    if (!root) return;

    const progressEl = root.querySelector<HTMLElement>(".progress");
    const updateProgress = () => {
      if (!progressEl) return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const ratio = scrollable <= 0 ? 0 : doc.scrollTop / scrollable;
      progressEl.style.setProperty("--p", ratio.toString());
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    root.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
      revealObserver.observe(el);
    });

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".sticker").forEach((el, index) => {
        const y = index % 2 ? -80 : 80;
        const rotation = index % 2 ? -6 : 6;
        gsap.to(el, {
          y,
          rotation,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".badge-round").forEach((badge) => {
        const svg = badge.querySelector<SVGElement>("svg");
        const inner = badge.querySelector<HTMLElement>(".in");
        const dir = Number(badge.dataset.rotate || 1);
        if (svg) {
          gsap.to(svg, {
            rotation: 360 * dir,
            transformOrigin: "50% 50%",
            ease: "none",
            scrollTrigger: {
              trigger: badge,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
        if (inner) {
          gsap.fromTo(
            inner,
            { scale: 0.9 },
            {
              scale: 1,
              duration: 0.6,
              scrollTrigger: {
                trigger: badge,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      const stageTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#stages",
          start: "top top",
          end: `+=${stages.length * 100}%`,
          pin: true,
          scrub: true,
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>("#stages .stage .card");
      cards.forEach((card, index) => {
        stageTimeline.fromTo(
          card,
          { y: 60, opacity: 0, rotate: -1 },
          { y: 0, opacity: 1, rotate: 0, duration: 0.8, ease: "expo.inOut" },
          index === 0 ? 0.02 : index / stages.length + 0.02
        );
      });

      stageTimeline
        .to("#stages .slides", { yPercent: -100, ease: "expo.inOut" }, 0.33)
        .to("#stages .slides", { yPercent: -200, ease: "expo.inOut" }, 0.66);
    }, rootRef);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      revealObserver.disconnect();
      ctx.revert();
    };
  }, [categoryLabels, newProducts, bestProducts]);

  const marqueeItems = categoryLabels.length ? categoryLabels : fallbackCategories;

  const handleAddToCart = (product: ProductCardData) => {
    // Create a cart item from the product card data
    // Using the product ID as variant ID since we're showing the default variant
    const cartItem: CartItem = {
      productId: product.id,
      productSlug: product.slug,
      title: product.title,
      variantId: product.id, // Using product ID as variant for now
      variantTitle: 'Default', // Could be enhanced with actual variant data
      price: product.priceCents || 0,
      quantity: 1,
    };
    
    addItem(cartItem);
    
    // Optional: Show a brief confirmation (you could add a toast notification here)
    console.log('Added to cart:', product.title);
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div ref={rootRef}>
      <div className="progress" aria-hidden />
      <header>
        <nav className="wrap nav">
          <div className="brand keith-logo" aria-label="Outrageous Store logo">
            {Array.from("OUTRAGEOUS").map((char, index) => (
              <span key={`${char}-${index}`}>{char}</span>
            ))}
          </div>
          <div className="links">
            <button className="pill" type="button">
              Shop
            </button>
            <button className="pill" type="button">
              Stories
            </button>
            <button className="pill" type="button">
              Club
            </button>
            <button className="pill" type="button" onClick={() => window.location.href = '/cart'}>
              Cart ({cartItemCount})
            </button>
          </div>
        </nav>
        <div className="ticker" aria-hidden>
          <div className="wrap">
            <div className="row">
              {[...marqueeItems, ...marqueeItems].map((text, index) => (
                <span key={`ticker-${index}`}>{text}</span>
              ))}
            </div>
          </div>
          <div className="checker" aria-hidden />
        </div>
      </header>

      <section className="hero">
        <div className="wrap">
          <div className="collage">
            <div className="sticker s1">
              <img
                src="https://images.unsplash.com/photo-1520975922203-b6b8406f9a72?q=80&w=600&auto=format&fit=crop"
                alt="Sticker collage"
              />
            </div>
            <div className="sticker s2">
              <img
                src="https://images.unsplash.com/photo-1524594081293-190a2fe0baae?q=80&w=600&auto=format&fit=crop"
                alt="Sticker collage"
              />
            </div>
            <div className="sticker s3">
              <img
                src="https://images.unsplash.com/photo-1541976076755-3192f9a8a3c2?q=80&w=600&auto=format&fit=crop"
                alt="Sticker collage"
              />
            </div>
            <div className="sticker s4">
              <img
                src="https://images.unsplash.com/photo-1541976076753-7f2d4b0c7a5e?q=80&w=600&auto=format&fit=crop"
                alt="Sticker collage"
              />
            </div>
          </div>
          <div>
            <span className="kicker">Indie bottles · zines · snacks</span>
            <h1>
              <span className="h1-highlight">Let the Season Unfold</span> — loud, niche, and
              tasty.
            </h1>
            <p>
              Hand-picked curios with a side of attitude. Scroll for hot drops and pizza-paper
              opinions. No beige minimalism here.
            </p>
            <div className="cta">
              <button className="btn alt" type="button">
                Shop New Arrivals
              </button>
              <button className="btn" type="button">
                Join The Club
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="wrap" id="main">
        <section className="chips reveal">
          <div className="marquee" aria-hidden>
            {[...marqueeItems, ...marqueeItems].map((chip, index) => (
              <div className="chip" key={`chip-${index}`}>
                {chip}
              </div>
            ))}
          </div>
        </section>

        <h2 className="title reveal">New Arrivals</h2>
        <section className="grid" id="products-new" style={{ margin: "16px 0 28px" }}>
          {newProducts.map((product) => (
            <article className="product reveal" key={product.id}>
              <Link href={`/products/${product.slug}`}>
                <div
                  className="img"
                  style={{ backgroundImage: `url('${product.image}')` }}
                  aria-hidden
                />
                <h3>{product.title}</h3>
                <div className="meta">{product.tag}</div>
              </Link>
              <div className="buy">
                <span className="price">{formatPrice(product.priceCents)}</span>
                <button className="btn" type="button" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="badges reveal">
          {badges.map((badge, index) => (
            <div className="badge-round" data-rotate={badge.rotate} key={badge.label}>
              <div className="in">{badge.label}</div>
              <svg viewBox="0 0 100 100" aria-hidden>
                <defs>
                  <path
                    id={`badge-circle-${index}`}
                    d="M50 50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                  />
                </defs>
                <text fontSize="8" fontWeight="900">
                  <textPath href={`#badge-circle-${index}`}>{badge.copy}</textPath>
                </text>
              </svg>
            </div>
          ))}
        </section>

        <section className="zine reveal">
          <div className="row">
            <div>
              <span className="snipe">Newspaper of Taste</span>
              <h3 style={{ fontSize: "clamp(22px,3.2vw,36px)", margin: ".4rem 0 0" }}>
                Get the next <u>issue</u> — deep dives, hot takes, zero spam.
              </h3>
              <p>One spicy email a month about the culture around pizza and pours.</p>
            </div>
            <form
              className="signup"
              onSubmit={(event) => {
                event.preventDefault();
                window.alert("Subscribed! ✉️");
              }}
              style={{ display: "flex", gap: "10px" }}
            >
              <input className="input" placeholder="Email address" required />
              <button className="btn" style={{ background: "var(--pool)" }} type="submit">
                Sign Up
              </button>
            </form>
          </div>
        </section>

        <h2 className="title reveal">Best Sellers</h2>
        <section className="grid" id="products-best" style={{ margin: "16px 0 28px" }}>
          {bestProducts.map((product) => (
            <article className="product reveal" key={product.id}>
              <Link href={`/products/${product.slug}`}>
                <div
                  className="img"
                  style={{ backgroundImage: `url('${product.image}')` }}
                  aria-hidden
                />
                <h3>{product.title}</h3>
                <div className="meta">{product.tag}</div>
              </Link>
              <div className="buy">
                <span className="price">{formatPrice(product.priceCents)}</span>
                <button className="btn" type="button" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="bleed reveal">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop"
            alt="Storefront"
          />
        </section>

        <section className="stages" id="stages" style={{ marginTop: 0 }}>
          <div className="stage-track">
            <div className="slides">
              {stages.map((stage) => {
                const stageStyle: StageStyle = {
                  "--stage-bg": `url('${stage.background}')`,
                };

                return (
                <div
                  className="stage"
                  key={stage.title}
                    style={stageStyle}
                >
                  <div className="card">
                    <h3 className="title">{stage.title}</h3>
                    <p>{stage.copy}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

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
          <div className="fm-track">{`${marqueeText} ${marqueeText}`}</div>
        </section>
      </footer>
    </div>
  );
}
