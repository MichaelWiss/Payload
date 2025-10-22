import type { Request, Response } from 'express';
import Stripe from 'stripe';
import payload from 'payload';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string | undefined;
  if (!sig) {
    return res.status(400).send('Missing Stripe signature');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const stripeId = session.id;

      await payload.create({
        collection: 'orders',
        data: {
          stripeId,
          status: 'paid',
          email: session.customer_details?.email ?? undefined,
        },
      });
    }

    return res.json({ received: true });
  } catch (err: any) {
    payload.logger.error(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
