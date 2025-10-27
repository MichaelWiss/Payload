'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '@/contexts/CartContext';
import { useAddToCart } from '@/lib/hooks/useAddToCart';
import type { Category, Product, Variant } from '@/types/payload';
import type { ProductCardData } from '@/lib/constants';
import {
  fallbackCategories,
  fallbackNewProducts,
  fallbackBestProducts,
  stages,
  badges,
} from '@/lib/constants';
import { ProductGrid as FeaturedProductGrid } from '@/components/ui/ProductGrid';
import { ProductCard } from '@/components/ui/ProductCard';
import { SiteHeader, SiteFooter } from './SiteChrome';
import { useToast } from '@/contexts/ToastContext';

interface HomePageClientProps {
  categories: Category[];
  featuredProducts: Product[];
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  fallbackProducts: ProductCardData[];
  onAddProductToCart: (product: Product, variant: Variant) => void;
  onAddFallbackProduct: (product: ProductCardData) => void;
}

type StageStyle = CSSProperties & { '--stage-bg'?: string };

export function HomePageClient({ categories, featuredProducts }: HomePageClientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { items, addItem } = useCart();
  const { addToCart } = useAddToCart();
  const { showToast } = useToast();

  const marqueeItems = useMemo(() => {
    const labels = categories
      .map((category) => category.title)
      .filter((title): title is string => Boolean(title));

    return labels.length ? labels : fallbackCategories;
  }, [categories]);

  const [newArrivalProducts, bestSellerProducts] = useMemo(() => {
    const arrivals = featuredProducts.slice(0, 8);
    const best = featuredProducts.slice(8, 16);

    if (best.length === 0 && arrivals.length > 0) {
      return [arrivals, arrivals];
    }

    return [arrivals, best];
  }, [featuredProducts]);

  const cartItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    if (!root) return;

    const progressEl = root.querySelector<HTMLElement>('.progress');
    const updateProgress = () => {
      if (!progressEl) return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const ratio = scrollable <= 0 ? 0 : doc.scrollTop / scrollable;
      progressEl.style.setProperty('--p', ratio.toString());
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    root.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
      revealObserver.observe(el);
    });

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.sticker').forEach((el, index) => {
        const y = index % 2 ? -80 : 80;
        const rotation = index % 2 ? -6 : 6;
        gsap.to(el, {
          y,
          rotation,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.badge-round').forEach((badgeEl) => {
        const svg = badgeEl.querySelector<SVGElement>('svg');
        const inner = badgeEl.querySelector<HTMLElement>('.in');
        const dir = Number(badgeEl.dataset.rotate || 1);
        if (svg) {
          gsap.to(svg, {
            rotation: 360 * dir,
            transformOrigin: '50% 50%',
            ease: 'none',
            scrollTrigger: {
              trigger: badgeEl,
              start: 'top bottom',
              end: 'bottom top',
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
                trigger: badgeEl,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });

      const stageTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '#stages',
          start: 'top top',
          end: `+=${stages.length * 100}%`,
          pin: true,
          scrub: true,
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>('#stages .stage .card');
      cards.forEach((card, index) => {
        stageTimeline.fromTo(
          card,
          { y: 60, opacity: 0, rotate: -1 },
          { y: 0, opacity: 1, rotate: 0, duration: 0.8, ease: 'expo.inOut' },
          index === 0 ? 0.02 : index / stages.length + 0.02
        );
      });

      stageTimeline
        .to('#stages .slides', { yPercent: -100, ease: 'expo.inOut' }, 0.33)
        .to('#stages .slides', { yPercent: -200, ease: 'expo.inOut' }, 0.66);
    }, rootRef);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      revealObserver.disconnect();
      ctx.revert();
    };
  }, []);

  const handleAddFeaturedProduct = (product: Product, variant: Variant) => {
    addToCart(product, variant);
    showToast(`${product.title} added to cart`, { type: 'success' });
  };

  const handleAddFallbackProduct = (product: ProductCardData) => {
    addItem({
      productId: product.id,
      productSlug: product.slug,
      title: product.title,
      variantId: product.id,
      variantTitle: 'Default',
      price: product.priceCents || 0,
      quantity: 1,
    });
    showToast(`${product.title} added to cart`, { type: 'success' });
  };

  return (
    <div ref={rootRef}>
      <div className="progress" aria-hidden />
      <SiteHeader marqueeItems={marqueeItems} cartItemCount={cartItemCount} />
      <HeroSection />
      <main className="wrap" id="main">
        <ChipsMarquee marqueeItems={marqueeItems} />
        <HomeProductSection
          title="New Arrivals"
          products={newArrivalProducts}
          fallbackProducts={fallbackNewProducts}
          onAddProductToCart={handleAddFeaturedProduct}
          onAddFallbackProduct={handleAddFallbackProduct}
        />
        <BadgesSection />
        <NewsletterSection />
        <HomeProductSection
          title="Best Sellers"
          products={bestSellerProducts}
          fallbackProducts={fallbackBestProducts}
          onAddProductToCart={handleAddFeaturedProduct}
          onAddFallbackProduct={handleAddFallbackProduct}
        />
        <BleedSection />
        <StagesSection />
      </main>
      <SiteFooter />
    </div>
  );
}
function HeroSection() {
  return (
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
            <span className="h1-highlight">Let the Season Unfold</span> — loud, niche, and tasty.
          </h1>
          <p>
            Hand-picked curios with a side of attitude. Scroll for hot drops and pizza-paper opinions.
            No beige minimalism here.
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
  );
}

function ChipsMarquee({ marqueeItems }: { marqueeItems: string[] }) {
  return (
    <section className="chips reveal">
      <div className="marquee" aria-hidden>
        {[...marqueeItems, ...marqueeItems].map((chip, index) => (
          <div className="chip" key={`chip-${index}`}>
            {chip}
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeProductSection({
  title,
  products,
  fallbackProducts,
  onAddProductToCart,
  onAddFallbackProduct,
}: ProductSectionProps) {
  const hasLiveProducts = products.length > 0;

  return (
    <>
      <h2 className="title reveal">{title}</h2>
      {hasLiveProducts ? (
        <FeaturedProductGrid
          products={products}
          onAddToCart={onAddProductToCart}
          className="home-products"
        />
      ) : (
        <section className="grid home-products">
          {fallbackProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={`/products/${product.slug}`}
              onAddToCart={onAddFallbackProduct}
            />
          ))}
        </section>
      )}
    </>
  );
}

function BadgesSection() {
  return (
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
  );
}

function NewsletterSection() {
  return (
    <section className="zine reveal">
      <div className="row">
        <div>
          <span className="snipe">Newspaper of Taste</span>
          <h3 style={{ fontSize: 'clamp(22px,3.2vw,36px)', margin: '.4rem 0 0' }}>
            Get the next <u>issue</u> — deep dives, hot takes, zero spam.
          </h3>
          <p>One spicy email a month about the culture around pizza and pours.</p>
        </div>
        <form
          className="signup"
          onSubmit={(event) => {
            event.preventDefault();
            showToast('Subscribed! ✉️', { type: 'success' });
          }}
          style={{ display: 'flex', gap: '10px' }}
        >
          <input className="input" placeholder="Email address" required />
          <button className="btn" style={{ background: 'var(--pool)' }} type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
}

function BleedSection() {
  return (
    <section className="bleed reveal">
      <img
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop"
        alt="Storefront"
      />
    </section>
  );
}

function StagesSection() {
  return (
    <section className="stages" id="stages" style={{ marginTop: 0 }}>
      <div className="stage-track">
        <div className="slides">
          {stages.map((stage) => {
            const stageStyle: StageStyle = {
              '--stage-bg': `url('${stage.background}')`,
            };

            return (
              <div className="stage" key={stage.title} style={stageStyle}>
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
  );
}
