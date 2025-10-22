import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerEmail } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    interface CheckoutItem {
      title: string;
      variantTitle: string;
      price: number;
      quantity: number;
      productId: string;
      variantId: string;
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: CheckoutItem) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${item.title} (${item.variantTitle})`,
            description: item.variantTitle,
          },
          unit_amount: item.price, // Price is already in cents
        },
        quantity: item.quantity,
      })
    );

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      customer_email: customerEmail || undefined,
      metadata: {
        items: JSON.stringify(
          items.map((item: CheckoutItem) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          }))
        ),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    const err = error as Error;
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
