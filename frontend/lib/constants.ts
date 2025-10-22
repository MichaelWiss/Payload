/**
 * Static data and constants for the storefront
 */

export interface ProductCardData {
  id: string;
  slug: string;
  title: string;
  priceCents: number | null;
  tag: string;
  image: string;
}

export interface Stage {
  title: string;
  copy: string;
  background: string;
}

export interface Badge {
  label: string;
  copy: string;
  rotate: number;
}

/**
 * Fallback category labels when API data is unavailable
 */
export const fallbackCategories = [
  'Champagne 🥂',
  'Orange 🍊',
  'Red 🍒',
  'Gin 🍸',
  'Bitters 🍋',
  'Vermouth 🫒',
  'Non-Alc 🌿',
  'Gift Sets 🎁',
  'Barware 🧊',
];

/**
 * Fallback "New Arrivals" products for initial render
 */
export const fallbackNewProducts: ProductCardData[] = [
  {
    id: 'placeholder-new-1',
    slug: 'days-non-alc-spritz',
    title: 'Days — Non-Alc Spritz',
    priceCents: 650,
    tag: 'Citrus • Zippy',
    image: 'https://images.unsplash.com/photo-1542790595-cb7b95fef7c4?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'placeholder-new-2',
    slug: 'public-radio-red-blend',
    title: 'Public Radio — Red Blend',
    priceCents: 2200,
    tag: 'Plum • Spice',
    image: 'https://images.unsplash.com/photo-1566207474742-de921626ad94?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'placeholder-new-3',
    slug: 'skin-contact-soft-serve',
    title: 'Skin Contact — Soft Serve',
    priceCents: 2800,
    tag: 'Apricot • Saline',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'placeholder-new-4',
    slug: 'cold-cheese-zine',
    title: 'Cold Cheese — Zine #3',
    priceCents: 1400,
    tag: 'Pizza Lore',
    image: 'https://images.unsplash.com/photo-1532635206-37e9b05b3fd0?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'placeholder-new-5',
    slug: 'champagne-pop',
    title: 'Champagne Pop!',
    priceCents: 4900,
    tag: 'Spark • Toast',
    image: 'https://images.unsplash.com/photo-1541976076758-347942db1976?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'placeholder-new-6',
    slug: 'negroni-bitters',
    title: 'Negroni Bitters',
    priceCents: 1800,
    tag: 'Bitter • Orange',
    image: 'https://images.unsplash.com/photo-1541976076755-3192f9a8a3c2?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'placeholder-new-7',
    slug: 'wild-vermouth',
    title: 'Wild Vermouth',
    priceCents: 1900,
    tag: 'Herbal • Dry',
    image: 'https://images.unsplash.com/photo-1541976076754-95a2a5c7d2b7?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'placeholder-new-8',
    slug: 'gift-set-starter-pack',
    title: 'Gift Set — Starter Pack',
    priceCents: 3900,
    tag: 'Curated • Fun',
    image: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=900&auto=format&fit=crop',
  },
];

/**
 * Fallback "Best Sellers" products for initial render
 */
export const fallbackBestProducts: ProductCardData[] = [
  {
    id: 'placeholder-best-1',
    slug: 'citrus-spritz-pack',
    title: 'Citrus Spritz Pack',
    priceCents: 2400,
    tag: '4-pack',
    image: 'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'placeholder-best-2',
    slug: 'vibe-tonic-soda',
    title: 'Vibe Tonic & Soda',
    priceCents: 1200,
    tag: 'Herbal',
    image: 'https://images.unsplash.com/photo-1541976076756-6f45cbf0644b?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'placeholder-best-3',
    slug: 'house-vermouth',
    title: 'House Vermouth',
    priceCents: 2100,
    tag: 'Dry',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1df6c5b25?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'placeholder-best-4',
    slug: 'club-gift-set',
    title: 'Club Gift Set',
    priceCents: 5900,
    tag: 'Member favorite',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'placeholder-best-5',
    slug: 'red-blend-radio',
    title: 'Red Blend — Radio',
    priceCents: 2300,
    tag: 'Cherry • Spice',
    image: 'https://images.unsplash.com/photo-1541976076757-1b3a3a17cf1f?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'placeholder-best-6',
    slug: 'spritz-blood-orange',
    title: 'Spritz — Blood Orange',
    priceCents: 1600,
    tag: 'Zippy',
    image: 'https://images.unsplash.com/photo-1524594081293-190a2fe0baae?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'placeholder-best-7',
    slug: 'bitter-aperitivo',
    title: 'Bitter Aperitivo',
    priceCents: 1900,
    tag: 'Classic',
    image: 'https://images.unsplash.com/photo-1541976076753-7f2d4b0c7a5e?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'placeholder-best-8',
    slug: 'gift-pack-pizza-night',
    title: 'Gift Pack — Pizza Night',
    priceCents: 6900,
    tag: 'Bundle',
    image: 'https://images.unsplash.com/photo-1541976076752-6a88f4e8f7e3?q=80&w=900&auto=format&fit=crop',
  },
];

/**
 * All unique fallback product images
 */
export const fallbackProductImages = Array.from(
  new Set([...fallbackNewProducts, ...fallbackBestProducts].map((product) => product.image))
);

/**
 * Stage content for scrolling stages section
 */
export const stages: Stage[] = [
  {
    title: 'Why this shop exists',
    copy: "Because good taste shouldn't be quiet. We champion lo-fi producers, big flavor, and culture-first stories. Expect sticker chaos and serious product quality.",
    background: 'https://images.unsplash.com/photo-1604908554049-2fdefc39f6df?q=80&w=1600&auto=format&fit=crop',
  },
  {
    title: 'Small makers, big punches',
    copy: 'Limited drops, fresh allocations, and a bias toward indie operations. Join the Club for early access and member pricing.',
    background: 'https://images.unsplash.com/photo-1514362544053-4f54f0f3b4d3?q=80&w=1600&auto=format&fit=crop',
  },
  {
    title: 'Built for exploration',
    copy: "Use vibe categories, zine reviews, and tasting notes that don't sound like robots. It's a store, but it's also a playground.",
    background: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=1600&auto=format&fit=crop',
  },
];

/**
 * Rotating badges configuration
 */
export const badges: Badge[] = [
  {
    label: 'Member Prices',
    copy: '  ✷  EARLY ALLOCATIONS  ✷  ZINE ACCESS  ✷  ',
    rotate: 1,
  },
  {
    label: 'Free Stickers',
    copy: '  ✷  PIZZA ENERGY  ✷  OUTRAGEOUS TASTE  ✷  ',
    rotate: -1,
  },
  {
    label: 'Non-Alc Love',
    copy: '  ✷  ZERO PROOF  ✷  FULL FLAVOR  ✷  ',
    rotate: 1.2,
  },
];

/**
 * Marquee text for footer
 */
export const marqueeText = '✷ NO BAD VIBES ✷ ZERO PROOF ✷ FULL FLAVOR ✷';
