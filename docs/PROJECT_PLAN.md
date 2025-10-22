# Payload + Next.js + Stripe Ecommerce Scaffold — Project Plan

This document turns the scaffold into an execution plan with milestones, acceptance criteria, and verification steps. Follow phases in order; each has a Definition of Done and quick checks.

## Milestones at a glance

- Phase 1 — Backend Foundation (Payload)
- Phase 2 — Storefront (Next.js App Router)
- Phase 3 — Checkout + Orders (Stripe)
- Phase 4 — Animation, Polish, and Deployment
- Phase 5 — Post-Launch Enhancements (Optional)

---

## Phase 1 — Backend Foundation (Payload CMS)

Outcome: Fully functional headless backend with models, seed data, and admin panel.

Tasks

1) Initialize backend project, install Payload, Express, DB adapter, Stripe SDK
2) Add `.env` and environment validation (Zod optional)
3) Configure CORS for `http://localhost:3000`
4) Implement core collections:
   - Users (roles + auth)
   - Media
   - Categories (SEO + hero + slug)
   - Variants (inventory, SKU, pricing)
   - Products (rich blocks, SEO, active flag, relations)
5) Implement extended collections:
   - Reviews (moderation, rating)
   - Discounts (percent/fixed, time windows)
   - Orders (initial structure)
6) Add global `Settings` and access control helpers
7) Add seed script (3 categories, 6 products, variants)
8) Verify REST + GraphQL reads

Definition of Done

- Payload Admin accessible at http://localhost:4000/admin
- CRUD works for all collections
- `/api/products` returns seeded data

Verification

- Start server: `npm run dev` in `backend/`
- Visit Admin, create a user, create content
- `GET http://localhost:4000/api/products?limit=1` returns JSON

---

## Phase 2 — Storefront (Next.js App Router)

Outcome: Browsing, PDP, cart, and CMS-driven rich content.

Tasks

- Scaffold Next.js (App Router) + layout + styles
- Pages:
  - Home (featured products)
  - Category listing
  - Product detail (rich blocks, gallery, SEO)
- Cart (localStorage: add, remove, update, subtotal)
- Loading states + error boundaries + 404

Definition of Done

- Browse → PDP → Add to Cart → View Cart
- PDP renders Payload blocks

Verification

- Start frontend: `npm run dev` in `frontend/`
- Home page shows featured products (from Payload)
- PDP shows price and blocks

---

## Phase 3 — Checkout + Orders (Stripe Integration)

Outcome: Real payments, webhook order creation, and inventory handling.

Tasks

- `/api/checkout` → Stripe Checkout Session
- Stripe webhook → create order + update inventory
- Success + Cancel pages
- Discount code handling (optional in P3)
- Order status lifecycle

Definition of Done

- Test card completes order on Stripe Checkout
- Webhook creates Order in Payload (status `paid`)
- Variant inventory decrements accordingly

Verification

- Configure Stripe webhook to `http://localhost:4000/stripe/webhook`
- Pay with test card `4242 4242 4242 4242`
- Check Payload `orders` collection

---

## Phase 4 — Animation, Polish, and Deployment

Outcome: Cinematic GSAP UI, SEO, performance, deployment.

Tasks

- GSAP ScrollTrigger + timeline system
- Reviews UI, Discount UI
- SEO + OG tags + sitemap
- Image optimization + caching
- Deploy backend (Fly/Render/Railway + Mongo/PG)
- Deploy frontend (Vercel)

Definition of Done

- Live production site
- Smooth motion, no jank
- Lighthouse passes

---

## Phase 5 — Post-Launch Enhancements (Optional)

- Customer accounts + order history
- Abandoned cart emails
- Mux video banners
- Search (Meilisearch/Algolia)
- Multi-currency

---

## Acceptance Criteria & Contracts

APIs

- Products REST: `GET /api/products?where[active][equals]=true&limit=8` returns `{ docs: Product[] }`
- Product by slug: `GET /api/products?where[slug][equals]=:slug&depth=2` returns first match or empty `docs`
- Orders on webhook: payload creates `orders` entry on `checkout.session.completed`

Error Modes

- Missing env → server logs clear message and exits non-zero
- Stripe signature mismatch → 400 with `Webhook Error` message
- Inventory insufficient → session creation fails or clamps quantities (Phase 3+)

Edge Cases

- Empty category/product lists
- Large images (upload limits)
- Discount validity windows
- Concurrency on inventory decrement
- Duplicate review submissions

---

## Environments & Variables

Backend `.env` (example in `backend/.env.example`)

- `PAYLOAD_SECRET` — required
- `MONGODB_URI` — or Postgres config if used
- `SERVER_URL` / `PAYLOAD_PUBLIC_SERVER_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `CORS_ORIGIN` — comma-separated list for local + prod

Frontend `.env` (example in `frontend/.env.example`)

- `NEXT_PUBLIC_API_URL` — Payload base URL
- `NEXT_PUBLIC_SITE_URL` — Frontend public URL
- `STRIPE_SECRET_KEY` — for `/api/checkout`

---

## Getting Started (Local)

Backend

- `cd backend`
- `cp .env.example .env`
- `npm i`
- `npm run dev`
- Admin: http://localhost:4000/admin

Frontend

- `cd frontend`
- `cp .env.example .env`
- `npm i`
- `npm run dev`
- Storefront: http://localhost:3000

Stripe Webhook

- Add endpoint: `http://localhost:4000/stripe/webhook`
- Events: `checkout.session.completed`

---

## Tracking

Use the top-level TODO list in the assistant or convert this plan into GitHub Issues if desired. Keep sprint scope to a single phase at a time.
