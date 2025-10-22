import type { Config } from 'payload/config';
import path from 'path';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { Users } from './collections/Users.js';

const config: Config = {
  serverURL: process.env.SERVER_URL,
  secret: process.env.PAYLOAD_SECRET ?? '',
  admin: {
    user: Users.slug,
  },
  collections: [Users],
  globals: [],
  blocks: [],
  plugins: [],
  endpoints: [],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/payload_ecom',
  }),
  typescript: {
    outputFile: path.resolve(path.dirname(new URL(import.meta.url).pathname), 'payload-types.ts'),
  },
  cors: process.env.CORS_ORIGIN?.split(',') ?? true,
  rateLimit: { trustProxy: true },
};

export default config;
