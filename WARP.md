# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a headless ecommerce platform built with **Payload CMS v3** (backend) and **Next.js 16** (frontend), integrated with **Stripe** for payments. The project uses a monorepo structure with separate `backend/` and `frontend/` directories.

## Commands

### Backend (Payload CMS)

```bash
cd backend
npm run dev        # Start Payload admin + API on port 4000
npm run build      # Build for production
npm run start      # Start production server
npm run seed       # Seed database with sample data
```

Admin panel: http://localhost:4000/admin
API endpoint: http://localhost:4000/api

### Frontend (Next.js)

```bash
cd frontend
npm run dev        # Start Next.js dev server on port 3000
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

Storefront: http://localhost:3000

## Architecture

### Monorepo Structure

- **`backend/`**: Payload CMS running as a Next.js app with PostgreSQL
  - `src/collections/`: Collection definitions (Products, Variants, Categories, Orders, etc.)
  - `src/endpoints/`: Custom API endpoints (Stripe webhook handler)
  - `src/globals/`: Global singletons (Settings)
  - `src/seed/`: Database seeding scripts
  - `src/payload.config.ts`: Main Payload configuration

- **`frontend/`**: Next.js App Router storefront
  - `app/`: Next.js pages and layouts
  - `lib/payload.ts`: API client for fetching Payload data
  - `types/`: TypeScript type definitions
  - Path alias: `@/*` maps to root

### Data Model

**Core Collections**:
- **Products**: Main product entries with title, slug, description, SEO, and flexible content blocks
- **Variants**: SKU-level items with pricing and inventory (e.g., "500ml Bottle")
- **Categories**: Product categorization with slugs
- **Orders**: Created via Stripe webhook on successful checkout
- **Users**: Authentication and role-based access
- **Media**: File uploads and images
- **Reviews**: Product reviews with moderation
- **Discounts**: Percentage or fixed-amount discounts with time windows

**Key Relationships**:
- Products → Variants (one-to-many): Each product has multiple variants
- Products → Categories (many-to-many): Products can belong to multiple categories
- Products → Media (one-to-many): Products can have multiple images
- Products have a `defaultVariant` for initial display
- Variants store `price`, `inventory`, and `sku`

### Content Blocks

Products use Payload's flexible blocks system for rich content:
- **feature**: Heading, body (rich text), optional media
- **specs**: Array of label/value pairs for product specifications

Render these blocks on the frontend by iterating through `product.blocks` and switching on `blockType`.

### Data Flow

1. **Content Management**: Admins use Payload admin panel to manage products, categories, etc.
2. **Frontend Fetching**: Next.js frontend fetches data via Payload REST API (`/api/products`, etc.)
3. **Checkout**: Frontend creates Stripe Checkout Session
4. **Order Creation**: Stripe webhook (`/stripe/webhook`) creates Order in Payload on successful payment

### API Patterns

Frontend queries use Payload's REST API with query parameters:
```typescript
// Fetch active products
GET /api/products?where[active][equals]=true&depth=2&limit=8

// Fetch by slug
GET /api/products?where[slug][equals]=artisan-olive-oil&depth=2&limit=1

// Fetch by category
GET /api/products?where[categories][contains]=<categoryId>&where[active][equals]=true
```

The `depth` parameter controls relationship population (e.g., `depth=2` populates variants and categories).

## Environment Variables

### Backend `.env`

Required variables (see `backend/.env.example`):
- `PAYLOAD_SECRET`: Secret key for Payload
- `DATABASE_URL`: PostgreSQL connection string
- `SERVER_URL`: Backend URL (e.g., http://localhost:4000)
- `PAYLOAD_PUBLIC_SERVER_URL`: Public-facing backend URL
- `CORS_ORIGIN`: Comma-separated allowed origins (e.g., http://localhost:3000)
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret

### Frontend `.env`

Required variables (see `frontend/.env.example`):
- `NEXT_PUBLIC_API_URL`: Payload API URL (e.g., http://localhost:4000)
- `NEXT_PUBLIC_SITE_URL`: Frontend public URL (e.g., http://localhost:3000)

## Development Workflow

### Initial Setup

1. Set up PostgreSQL database
2. Copy `.env.example` to `.env` in both `backend/` and `frontend/`
3. Install dependencies: `npm install` in both directories
4. Start backend: `cd backend && npm run dev`
5. Seed data: `cd backend && npm run seed`
6. Start frontend: `cd frontend && npm run dev`

### Stripe Webhook Testing

Configure Stripe webhook endpoint:
- URL: `http://localhost:4000/stripe/webhook`
- Events to listen for: `checkout.session.completed`
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:4000/stripe/webhook`

### Type Generation

Payload auto-generates TypeScript types at `backend/src/payload-types.ts` based on collection schemas. This file is gitignored and regenerated on server start.

## Key Technical Details

- **Payload v3** uses Next.js as its application framework (different from v2 which used Express)
- Backend runs Payload admin UI and API in the same Next.js app
- Frontend is a separate Next.js app that consumes Payload's REST API
- Both projects use TypeScript with strict mode enabled
- Frontend uses path alias `@/*` for imports
- GSAP is installed for animations (see `frontend/package.json`)
- Tailwind CSS v4 with PostCSS configuration

## Database

This project uses **PostgreSQL** via `@payloadcms/db-postgres`. Connection is configured in `backend/src/payload.config.ts` using the `DATABASE_URL` environment variable.

## Access Control

Access control helpers are in `backend/src/access/`. Collections use Payload's built-in access control system with role-based permissions. The Stripe webhook endpoint uses `overrideAccess: true` to bypass access control for server-side order creation.

## Project Status

This is a scaffold implementation based on the project plan in `docs/PROJECT_PLAN.md`. The plan outlines 5 phases:
1. Backend Foundation (Payload) - Core structure in place
2. Storefront (Next.js App Router) - Basic structure exists
3. Checkout + Orders (Stripe Integration) - Webhook handler implemented
4. Animation, Polish, and Deployment - GSAP installed, pending implementation
5. Post-Launch Enhancements - Future work

Refer to `PROJECT_PLAN.md` for detailed milestones and acceptance criteria.
