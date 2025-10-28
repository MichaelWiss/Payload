# Payload CMS + Next.js Ecommerce Platform

A modern headless ecommerce platform built with **Payload CMS v3** (backend), **Next.js 16** (frontend), and **Stripe** for payments. Features a flexible content management system with rich product content blocks, variant-based inventory management, and seamless checkout integration.

## 🚀 Tech Stack

### Backend
- **Payload CMS v3** - Headless CMS with Next.js integration
- **PostgreSQL** - Primary database via `@payloadcms/db-postgres`
- **Stripe** - Payment processing and webhook handling
- **TypeScript** - Type-safe development

### Frontend
- **Next.js 16** - App Router with React 19
- **Tailwind CSS v4** - Utility-first styling
- **GSAP** - Animation library for cinematic UI
- **Zod** - Runtime type validation
- **TypeScript** - Full type safety

## 📁 Project Structure

```
├── backend/              # Payload CMS + API
│   ├── src/
│   │   ├── collections/  # Data models (Products, Variants, Orders, etc.)
│   │   ├── endpoints/    # Custom API endpoints (Stripe webhook)
│   │   ├── globals/      # Global singletons (Settings)
│   │   ├── access/       # Access control helpers
│   │   ├── seed/         # Database seeding scripts
│   │   └── payload.config.ts
│   └── package.json
│
├── frontend/             # Next.js storefront
│   ├── app/             # App Router pages & layouts
│   ├── components/      # React components
│   ├── lib/            # Utilities & API client
│   ├── types/          # TypeScript definitions
│   └── package.json
│
└── docs/               # Project documentation
    └── PROJECT_PLAN.md # Development roadmap
```

## 🏗️ Data Model

### Core Collections

- **Products** - Main product entries with rich content blocks, SEO metadata, and relationships
- **Variants** - SKU-level items with pricing, inventory, and product attributes (e.g., "500ml Bottle")
- **Categories** - Product categorization with slugs and SEO
- **Orders** - Automatically created via Stripe webhook on successful checkout
- **Users** - Authentication with role-based access control
- **Media** - File uploads and image management
- **Reviews** - Product reviews with moderation capabilities
- **Discounts** - Percentage or fixed-amount discounts with time windows

### Key Relationships

- Products → Variants (one-to-many)
- Products → Categories (many-to-many)
- Products → Media (one-to-many)
- Each product has a `defaultVariant` for initial display

### Content Blocks

Products support flexible content blocks:
- **feature** - Heading, rich text body, optional media
- **specs** - Key-value pairs for product specifications

## 🛠️ Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** database (local or hosted)
- **Stripe account** (for payments and webhooks)

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd Payload

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set Up PostgreSQL

Create a new PostgreSQL database:

```bash
# Using psql
createdb payload_ecommerce

# Or using your preferred PostgreSQL client
```

### 3. Configure Environment Variables

#### Backend `.env`

Create `backend/.env` (see `backend/.env.example` for reference):

```env
# Payload Configuration
PAYLOAD_SECRET=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/payload_ecommerce

# Server URLs
SERVER_URL=http://localhost:4000
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:4000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Stripe Integration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Frontend `.env`

Create `frontend/.env` (see `frontend/.env.example` for reference):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Start Backend

```bash
cd backend
npm run dev
```

The Payload admin panel will be available at **http://localhost:4000/admin**

### 5. Seed Database (Optional)

```bash
cd backend
npm run seed
```

This populates the database with sample categories, products, and variants.

### 6. Start Frontend

```bash
cd frontend
npm run dev
```

The storefront will be available at **http://localhost:3000**

## 🔌 Stripe Webhook Setup

### Local Development

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Forward webhooks to your local backend:

```bash
stripe listen --forward-to localhost:4000/stripe/webhook
```

3. Copy the webhook signing secret to `backend/.env` as `STRIPE_WEBHOOK_SECRET`

### Production

1. In Stripe Dashboard, add webhook endpoint: `https://your-domain.com/stripe/webhook`
2. Subscribe to event: `checkout.session.completed`
3. Copy the signing secret to your production environment variables

## 🧑‍💻 Development Commands

### Backend (Payload CMS)

```bash
cd backend

npm run dev        # Start dev server on port 4000
npm run build      # Build for production
npm run start      # Start production server
npm run seed       # Seed database with sample data
```

**Access Points:**
- Admin Panel: http://localhost:4000/admin
- API Endpoint: http://localhost:4000/api

### Frontend (Next.js)

```bash
cd frontend

npm run dev        # Start dev server on port 3000
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

**Access Points:**
- Storefront: http://localhost:3000

## 📡 API Usage

The backend exposes a REST API via Payload CMS. Example queries:

```bash
# Fetch active products
GET /api/products?where[active][equals]=true&depth=2&limit=8

# Fetch product by slug
GET /api/products?where[slug][equals]=artisan-olive-oil&depth=2&limit=1

# Fetch products by category
GET /api/products?where[categories][contains]=<categoryId>&where[active][equals]=true

# Fetch all categories
GET /api/categories?depth=1
```

The `depth` parameter controls relationship population (e.g., `depth=2` populates variants and categories).

## 🔐 Access Control

- Collections use Payload's role-based access control system
- Access control helpers are located in `backend/src/access/`
- The Stripe webhook endpoint uses `overrideAccess: true` to bypass access control for server-side order creation

## 🎨 Frontend Features

- **Product browsing** with category filtering
- **Product detail pages** with rich content blocks and variant selection
- **Shopping cart** (localStorage-based)
- **Stripe Checkout** integration
- **SEO optimization** with metadata and Open Graph tags
- **Responsive design** with Tailwind CSS
- **GSAP animations** (implementation in progress)

## 🚀 Deployment

### Backend (Payload CMS)

Recommended platforms:
- **Railway** / **Render** / **Fly.io** for Node.js hosting
- **Neon** / **Supabase** / **RDS** for PostgreSQL

Ensure all environment variables are configured in your hosting platform.

### Frontend (Next.js)

Recommended platform:
- **Vercel** (optimal for Next.js)

Connect your repository and configure environment variables in the Vercel dashboard.

## 📖 Additional Documentation

- **[WARP.md](./WARP.md)** - Technical reference for AI-assisted development
- **[PROJECT_PLAN.md](./docs/PROJECT_PLAN.md)** - Development roadmap and milestones
- **Frontend Docs:**
  - [COMPONENTS.md](./frontend/COMPONENTS.md)
  - [CATEGORY_PAGES.md](./frontend/docs/CATEGORY_PAGES.md)
  - [PRODUCT_DETAIL_PAGE.md](./frontend/docs/PRODUCT_DETAIL_PAGE.md)
  - [CHECKOUT_FLOW.md](./frontend/docs/CHECKOUT_FLOW.md)

## 📋 Project Status

This project follows a 5-phase development plan:

1. ✅ **Backend Foundation** - Core structure in place
2. ✅ **Storefront** - Basic structure implemented
3. ✅ **Checkout + Orders** - Stripe integration complete
4. 🚧 **Animation & Polish** - GSAP installed, implementation in progress
5. ⏳ **Post-Launch Enhancements** - Future work

See [PROJECT_PLAN.md](./docs/PROJECT_PLAN.md) for detailed milestones and acceptance criteria.

## 🧪 Testing

To test the complete flow:

1. Start both backend and frontend servers
2. Browse products at http://localhost:3000
3. Add items to cart and proceed to checkout
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete checkout and verify order creation in Payload admin

## 🤝 Contributing

This is a scaffold project designed for customization. Key areas for extension:

- Custom product content blocks
- Additional payment methods
- Customer accounts and order history
- Advanced search (Meilisearch/Algolia)
- Multi-currency support
- Abandoned cart recovery

## 📄 License

[Specify your license here]

## 🔗 Resources

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [GSAP Documentation](https://greensock.com/docs/)
