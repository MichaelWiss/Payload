import type { Endpoint } from 'payload/config';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export const stripeWebhookEndpoint: Endpoint = {
  path: '/stripe/webhook',
  method: 'post',
  handler: async (req) => {
    try {
      const sig = req.headers['stripe-signature'];
      if (!sig) {
        return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 });
      }

      // Payload v3 provides rawBody for webhooks
      const rawBody = req.body as Buffer | string;

      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        // Use req.payload (injected by Payload v3)
        await req.payload.create({
          collection: 'orders',
          data: {
            stripeId: session.id,
            status: 'paid',
            email: session.customer_details?.email ?? '',
            lineItems: [],
            metadata: session.metadata ?? {},
          },
          overrideAccess: true, // Allow server-side creation regardless of access control
        });
      }

      return Response.json({ received: true });
    } catch (err: any) {
      req.payload.logger.error(`Stripe webhook error: ${err.message}`);
      return Response.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }
  },
};
