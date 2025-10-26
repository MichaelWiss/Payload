# Refinement To-Dos

## Backend Hardening
1. Add runtime environment validation and descriptive startup errors in `backend/src/payload.config.ts`.
2. Expand seed data to cover multiple products, categories, media, and reviews for richer storefront testing.
3. Enhance Stripe webhook to record real line items, compute totals, and decrement variant inventory.
4. Implement shared access-control helpers and apply them across collections (orders, discounts, reviews).

## Frontend Improvements
5. Refactor the homepage to use reusable components (hero, product grids, badges, newsletter) and align with shared UI tokens.
6. Correct Next.js route param typing in `frontend/app/products/[slug]/page.tsx`, improve product detail UX (gallery states, loading skeletons), and ensure reliable not-found handling.
7. Replace blocking `alert` in `ProductDetailClient` with a toast/snackbar component wired into cart context.
8. Persist cart state to `localStorage` with hydration safeguards for SSR/client parity.
9. Add end-user facing error states when Payload requests fail (home, categories, product pages, product detail).

## Collections & Listings
12. Wire collection listing pages to Payload (category index, `/collections`), replacing placeholders with live data.
13. Implement collection detail pages with hero content, filters, and pagination backed by Payload queries.

## Polish & Verification
10. Centralize typography/brand tokens for gradients, strokes, and shadows referenced across UI components.
11. Add automated tests: backend webhook/inventory unit tests and frontend critical-path E2E checks.
14. Document deployment steps and environment matrices (backend container, frontend hosting) in `docs/`.
