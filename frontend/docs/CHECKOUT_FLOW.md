# Checkout Flow & Stripe Integration - Step 4

Complete checkout implementation with Stripe Checkout, cart page, and order processing.

## Architecture Overview

```
[Cart Page] → [Checkout API] → [Stripe Checkout] → [Webhook] → [Order Created]
     ↓              ↓                   ↓              ↓              ↓
  /cart      /api/checkout    stripe.com/pay    /stripe/webhook   Payload CMS
```

## Files Created

### Frontend Routes

```
/cart
├── page.tsx           (Cart page with checkout flow)
└── cart.css           (Cart styling)

/checkout
├── success
│   ├── page.tsx       (Success page after payment)
│   └── success.css    (Success styling)
└── cancel
    ├── page.tsx       (Cancel page if user backs out)
    └── cancel.css     (Cancel styling)

/api/checkout
└── route.ts           (Stripe Checkout Session API)
```

### Backend (Already Exists)

```
backend/src/endpoints/stripeWebhook.ts  (Webhook handler)
```

## Features

### 1. Cart Page (`/cart`)

**Features:**
- Display all cart items with product details
- Quantity controls (increment/decrement)
- Remove items from cart
- Item subtotals and grand total
- Email input for checkout
- "Proceed to Checkout" button
- "Clear Cart" button
- Empty cart state
- Links to product pages

**User Flow:**
1. User views cart items
2. Adjusts quantities if needed
3. Enters email address
4. Clicks "Proceed to Checkout"
5. Redirected to Stripe Checkout

### 2. Checkout API (`/api/checkout`)

**Server Route** that creates Stripe Checkout Sessions.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "...",
      "productSlug": "...",
      "title": "Product Name",
      "variantId": "...",
      "variantTitle": "500ml Bottle",
      "price": 2499,
      "quantity": 2
    }
  ],
  "customerEmail": "customer@example.com"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**What It Does:**
1. Validates cart items
2. Creates Stripe line items from cart
3. Creates Stripe Checkout Session
4. Configures success/cancel URLs
5. Stores cart metadata in session
6. Returns checkout URL

### 3. Success Page (`/checkout/success`)

**Features:**
- Success icon and message
- Order reference (last 12 chars of session ID)
- Confirmation instructions
- "Continue Shopping" button
- **Automatically clears cart** on mount

**URL:** `/checkout/success?session_id={CHECKOUT_SESSION_ID}`

### 4. Cancel Page (`/checkout/cancel`)

**Features:**
- Cancel icon and message
- "Return to Cart" button
- "Continue Shopping" link
- Cart items preserved (not cleared)

**URL:** `/checkout/cancel`

## Environment Variables

### Frontend `.env`

Add to your `.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
```

**Important:** 
- `STRIPE_SECRET_KEY` is used server-side only (API routes)
- Never expose secret key in client-side code

### Backend `.env`

Already configured in backend (see `backend/.env.example`):

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Stripe Webhook

The backend webhook (`backend/src/endpoints/stripeWebhook.ts`) handles:

1. **Event:** `checkout.session.completed`
2. **Action:** Creates Order in Payload CMS
3. **Data:** Extracts items from session metadata
4. **Inventory:** Should decrement variant inventory (to be implemented)

### Testing Webhooks Locally

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login:
   ```bash
   stripe login
   ```

3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:4000/stripe/webhook
   ```

4. Copy webhook secret to backend `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Testing the Flow

### 1. Add Items to Cart

- Browse products on homepage, category pages, or PDPs
- Click "Add to Cart"
- Items stored in localStorage via CartContext

### 2. View Cart

- Navigate to `/cart`
- Should see all cart items
- Adjust quantities
- Enter email

### 3. Checkout

- Click "Proceed to Checkout"
- Redirected to Stripe Checkout
- Use test card: `4242 4242 4242 4242`
- Any future date, any CVC

### 4. Success

- Complete payment on Stripe
- Redirected to `/checkout/success`
- Cart automatically cleared
- Order created in Payload (check admin)

### 5. Cancel

- Start checkout, then click browser back
- Or close Stripe tab
- Redirected to `/checkout/cancel`
- Cart items preserved

## Cart Context Integration

The checkout flow uses `CartContext` from Step 1:

```tsx
const { items, subtotal, clearCart } = useCart();
```

**Key Methods:**
- `items` - Array of cart items
- `subtotal` - Total price in cents
- `clearCart()` - Empties cart (called on success)
- `removeItem(variantId)` - Remove single item
- `updateQuantity(variantId, quantity)` - Update quantity

## Data Flow

### Complete Purchase Flow

```
1. User adds products to cart
   └─> CartContext stores in localStorage

2. User visits /cart
   └─> Displays items from CartContext

3. User enters email & clicks checkout
   └─> POST /api/checkout with items + email

4. API creates Stripe session
   └─> Returns checkout URL

5. Browser redirects to Stripe
   └─> User enters payment info

6. Payment succeeds
   └─> Stripe redirects to /checkout/success

7. Success page clears cart
   └─> CartContext.clearCart()

8. Stripe sends webhook to backend
   └─> Backend creates Order in Payload
   └─> (Future: Decrement inventory)
```

## Security Considerations

1. **API Route Security:**
   - Validate all input
   - Sanitize cart items
   - Verify prices server-side (future enhancement)

2. **Stripe Keys:**
   - Secret key only on server
   - Never expose in client code
   - Use environment variables

3. **Webhook Security:**
   - Verify webhook signatures
   - Use `STRIPE_WEBHOOK_SECRET`
   - Already implemented in backend

## Future Enhancements

### Recommended Next Steps

1. **Inventory Management:**
   - Decrement variant inventory in webhook
   - Handle insufficient stock
   - Add stock checks before checkout

2. **Order Confirmation Emails:**
   - Send email on `checkout.session.completed`
   - Include order details
   - Use service like SendGrid or Resend

3. **Customer Accounts:**
   - Save orders to user profiles
   - Order history page
   - Reorder functionality

4. **Discount Codes:**
   - Validate discount codes
   - Apply to Stripe session
   - Track usage in Payload

5. **Price Verification:**
   - Fetch current prices from Payload in API route
   - Prevent price manipulation
   - Compare with cart prices

6. **Shipping Costs:**
   - Calculate shipping based on location
   - Add to checkout total
   - Integrate shipping providers

7. **Better Error Handling:**
   - Toast notifications instead of alerts
   - Retry logic for API failures
   - User-friendly error messages

8. **Cart Drawer Component:**
   - Mini cart in header/nav
   - Quick view without leaving page
   - Add to cart animations

## Troubleshooting

### Common Issues

**Issue:** Checkout button does nothing
- Check browser console for errors
- Verify `STRIPE_SECRET_KEY` in `.env`
- Check API route at `/api/checkout`

**Issue:** Redirects to wrong URL after payment
- Verify `NEXT_PUBLIC_SITE_URL` is correct
- Check success_url and cancel_url in API route

**Issue:** Order not created in Payload
- Check webhook secret matches Stripe CLI
- Verify webhook endpoint is accessible
- Check backend logs for errors
- Test webhook with Stripe CLI

**Issue:** Cart not cleared on success
- Check that `session_id` query param exists
- Verify `clearCart()` is called in useEffect
- Check browser console for errors

## API Reference

### POST /api/checkout

Creates a Stripe Checkout Session.

**Request:**
```typescript
{
  items: CartItem[];
  customerEmail?: string;
}
```

**Response (Success):**
```typescript
{
  sessionId: string;
  url: string;
}
```

**Response (Error):**
```typescript
{
  error: string;
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request
- `500` - Server error
