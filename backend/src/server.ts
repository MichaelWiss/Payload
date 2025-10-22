import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import payload from 'payload';
import payloadConfig from './payload.config.js';
import { stripeWebhook } from './routes/stripeWebhook.js';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? true,
    credentials: true,
  }),
);

// Stripe requires the raw body for webhook signature validation.
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// All remaining routes can use standard JSON parsing.
app.use(express.json());

const PORT = Number(process.env.PORT ?? 4000);

const start = async () => {
  // Log a quick summary of config to help debug init issues
  try {
    const anyConfig: any = payloadConfig as any;
    console.log('Payload config summary:', {
      hasCollections: Array.isArray(anyConfig.collections),
      collectionsLen: anyConfig.collections?.length,
      hasGlobals: Array.isArray(anyConfig.globals),
      globalsLen: anyConfig.globals?.length,
      pluginsLen: anyConfig.plugins?.length ?? 0,
      endpointsLen: anyConfig.endpoints?.length ?? 0,
      hasDB: Boolean(anyConfig.db),
      hasSecret: Boolean(anyConfig.secret),
    });
  } catch {}

  const initOptions: any = {
    config: payloadConfig,
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin ready at ${process.env.SERVER_URL ?? `http://localhost:${PORT}`}/admin`);
    },
  };

  await payload.init(initOptions);

  app.listen(PORT, () => {
    payload.logger.info(`API listening on http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error('Full error:', err);
  payload.logger.error('Failed to start server', err);
  process.exit(1);
});
