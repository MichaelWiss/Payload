import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { slateEditor } from '@payloadcms/richtext-slate';
import path from 'path';
import { fileURLToPath } from 'url';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Categories } from './collections/Categories';
import { Products } from './collections/Products';
import { Variants } from './collections/Variants';
import { Discounts } from './collections/Discounts';
import { Reviews } from './collections/Reviews';
import { Orders } from './collections/Orders';
import { Settings } from './globals/Settings';
import { stripeWebhookEndpoint } from './endpoints/stripeWebhook';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.SERVER_URL || 'http://localhost:4000',
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Categories, Products, Variants, Discounts, Reviews, Orders],
  globals: [Settings],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  editor: slateEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL!,
    },
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  cors: [
    ...(process.env.CORS_ORIGIN ?? '').split(',').filter(Boolean),
    'http://localhost:3000',
  ],
  csrf: [
    ...(process.env.CORS_ORIGIN ?? '').split(',').filter(Boolean),
    'http://localhost:3000',
  ],
  endpoints: [stripeWebhookEndpoint],
});

