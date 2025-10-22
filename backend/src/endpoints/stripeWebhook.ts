import Stripe from 'stripe';
import { getPayload } from 'payload';
import config from '../payload.config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export const stripeWebhookEndpoint: any = {
  path: '/stripe/webhook',
  method: 'post',
  handler: async (req: any) => {
    try {
      const sig = req.headers['stripe-signature'] as string;
      const rawBody = req.body;

      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const payload = await getPayload({ config });

        await payload.create({
          collection: 'orders',
          data: {
            stripeId: session.id,
            status: 'paid',
            email: session.customer_details?.email ?? '',
            lineItems: [],
            metadata: session.metadata ?? {},
          },
        });
      }

      return new Response(JSON.stringify({ received: true }), { status: 200 });
    } catch (err: any) {
      console.error(`Stripe webhook error: ${err.message}`);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
  },
};
