/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./page.css";
import { fetchCategories, fetchFeaturedProducts, resolveVariants } from "@/lib/payload";
import type { Media, Product } from "@/types/payload";

interface ProductCard {
  id: string;
  slug: string;
  title: string;
  priceCents: number | null;
  tag: string;
  image: string;
}

type StageStyle = CSSProperties & { "--stage-bg"?: string };

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatPrice = (cents: number | null): string => {
  if (typeof cents !== "number") {
    return "—";
  }
  return currencyFormatter.format(cents / 100);
};

const fallbackCategories = [
  "Champagne 🥂",
  "Orange 🍊",
  "Red 🍒",
  "Gin 🍸",
  "Bitters 🍋",
  "Vermouth 🫒",
  "Non-Alc 🌿",
  "Gift Sets 🎁",
  "Barware 🧊",
];

const fallbackNewProducts: ProductCard[] = [
  {
    id: "placeholder-new-1",
    slug: "days-non-alc-spritz",
    title: "Days — Non-Alc Spritz",
    priceCents: 650,
    tag: "Citrus • Zippy",
    image: "https://images.unsplash.com/photo-1542790595-cb7b95fef7c4?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "placeholder-new-2",
    slug: "public-radio-red-blend",
    title: "Public Radio — Red Blend",
    priceCents: 2200,
    tag: "Plum • Spice",
    image: "https://images.unsplash.com/photo-1566207474742-de921626ad94?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "placeholder-new-3",
    slug: "skin-contact-soft-serve",
    title: "Skin Contact — Soft Serve",
    priceCents: 2800,
    tag: "Apricot • Saline",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "placeholder-new-4",
    slug: "cold-cheese-zine",
    title: "Cold Cheese — Zine #3",
    priceCents: 1400,
    tag: "Pizza Lore",
    image: "https://images.unsplash.com/photo-1532635206-37e9b05b3fd0?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "placeholder-new-5",
    slug: "champagne-pop",
    title: "Champagne Pop!",
    priceCents: 4900,
    tag: "Spark • Toast",
    image: "https://images.unsplash.com/photo-1541976076758-347942db1976?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "placeholder-new-6",
    slug: "negroni-bitters",
    title: "Negroni Bitters",
    priceCents: 1800,
    tag: "Bitter • Orange",
    image: "https://images.unsplash.com/photo-1541976076755-3192f9a8a3c2?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "placeholder-new-7",
    slug: "wild-vermouth",
    title: "Wild Vermouth",
    priceCents: 1900,
    tag: "Herbal • Dry",
    image: "https://images.unsplash.com/photo-1541976076754-95a2a5c7d2b7?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "placeholder-new-8",
    slug: "gift-set-starter-pack",
    title: "Gift Set — Starter Pack",
    priceCents: 3900,
    tag: "Curated • Fun",
    image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=900&auto=format&fit=crop",
  },
];

const fallbackBestProducts: ProductCard[] = [
  {
    id: "placeholder-best-1",
    slug: "citrus-spritz-pack",
    title: "Citrus Spritz Pack",
    priceCents: 2400,
    tag: "4-pack",
    image: "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "placeholder-best-2",
    slug: "vibe-tonic-soda",
    title: "Vibe Tonic & Soda",
    priceCents: 1200,
    tag: "Herbal",
    image: "https://images.unsplash.com/photo-1541976076756-6f45cbf0644b?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "placeholder-best-3",
    slug: "house-vermouth",
    title: "House Vermouth",
    priceCents: 2100,
    tag: "Dry",
    image: "https://images.unsplash.com/photo-1617806118233-18e1df6c5b25?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "placeholder-best-4",
    slug: "club-gift-set",
    title: "Club Gift Set",
    priceCents: 5900,
    tag: "Member favorite",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "placeholder-best-5",
    slug: "red-blend-radio",
    title: "Red Blend — Radio",
    priceCents: 2300,
    tag: "Cherry • Spice",
    image: "https://images.unsplash.com/photo-1541976076757-1b3a3a17cf1f?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "placeholder-best-6",
    slug: "spritz-blood-orange",
    title: "Spritz — Blood Orange",
    priceCents: 1600,
    tag: "Zippy",
    image: "https://images.unsplash.com/photo-1524594081293-190a2fe0baae?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "placeholder-best-7",
    slug: "bitter-aperitivo",
    title: "Bitter Aperitivo",
    priceCents: 1900,
    tag: "Classic",
    image: "https://images.unsplash.com/photo-1541976076753-7f2d4b0c7a5e?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "placeholder-best-8",
    slug: "gift-pack-pizza-night",
    title: "Gift Pack — Pizza Night",
    priceCents: 6900,
    tag: "Bundle",
    image: "https://images.unsplash.com/photo-1541976076752-6a88f4e8f7e3?q=80&w=900&auto=format&fit=crop",
  },
];

const fallbackProductImages = Array.from(
  new Set([...fallbackNewProducts, ...fallbackBestProducts].map((product) => product.image))
);

const stages = [
  {
    title: "Why this shop exists",
    copy: "Because good taste shouldn’t be quiet. We champion lo-fi producers, big flavor, and culture-first stories. Expect sticker chaos and serious product quality.",
    background: "https://images.unsplash.com/photo-1604908554049-2fdefc39f6df?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Small makers, big punches",
    copy: "Limited drops, fresh allocations, and a bias toward indie operations. Join the Club for early access and member pricing.",
    background: "https://images.unsplash.com/photo-1514362544053-4f54f0f3b4d3?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Built for exploration",
    copy: "Use vibe categories, zine reviews, and tasting notes that don’t sound like robots. It’s a store, but it’s also a playground.",
    background: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1600&auto=format&fit=crop",
  },
];

const badges = [
  {
    label: "Member Prices",
    copy: "  ✷  EARLY ALLOCATIONS  ✷  ZINE ACCESS  ✷  ",
    rotate: 1,
  },
  {
    label: "Free Stickers",
    copy: "  ✷  PIZZA ENERGY  ✷  OUTRAGEOUS TASTE  ✷  ",
    rotate: -1,
  },
  {
    label: "Non-Alc Love",
    copy: "  ✷  ZERO PROOF  ✷  FULL FLAVOR  ✷  ",
    rotate: 1.2,
  },
];

const marqueeText = "✷ NO BAD VIBES ✷ ZERO PROOF ✷ FULL FLAVOR ✷";

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [categoryLabels, setCategoryLabels] = useState<string[]>(fallbackCategories);
  const [newProducts, setNewProducts] = useState<ProductCard[]>(fallbackNewProducts);
  const [bestProducts, setBestProducts] = useState<ProductCard[]>(fallbackBestProducts);

  useEffect(() => {
    let cancelled = false;

    const mapProductToCard = (product: Product, index: number): ProductCard => {
      const variants = resolveVariants(product.variants);
      const preferredVariant =
        typeof product.defaultVariant === "object" && product.defaultVariant !== null
          ? product.defaultVariant
          : variants[0];
      const priceCents = preferredVariant?.price ?? null;
      const categoryTitles = (product.categories ?? [])
        .map((category) => (typeof category === "string" ? null : category?.title))
        .filter((title): title is string => Boolean(title));
      const tag = categoryTitles.slice(0, 2).join(" • ") || product.description?.slice(0, 40) || "Limited drop";
      const imageMedia = (product.images ?? []).find(
        (image): image is Media => typeof image !== "string"
      );
      const fallbackImage = fallbackProductImages[index % fallbackProductImages.length];

      return {
        id: product.id,
        slug: product.slug,
        title: product.title,
        priceCents,
        tag,
        image: imageMedia?.url ?? fallbackImage,
      };
    };

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
            <button className="pill" type="button">
              Cart (2)
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
              <div
                className="img"
                style={{ backgroundImage: `url('${product.image}')` }}
                aria-hidden
              />
              <h3>{product.title}</h3>
              <div className="meta">{product.tag}</div>
              <div className="buy">
                <span className="price">{formatPrice(product.priceCents)}</span>
                <button className="btn" type="button">
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
              <div
                className="img"
                style={{ backgroundImage: `url('${product.image}')` }}
                aria-hidden
              />
              <h3>{product.title}</h3>
              <div className="meta">{product.tag}</div>
              <div className="buy">
                <span className="price">{formatPrice(product.priceCents)}</span>
                <button className="btn" type="button">
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
