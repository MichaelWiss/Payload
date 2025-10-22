import payload from 'payload';
import 'dotenv/config';
import config from '../payload.config.js';

(async () => {
  await payload.init({ config });
  console.log('Payload initialized');
  // TODO: create categories, variants, products
  process.exit(0);
})();
