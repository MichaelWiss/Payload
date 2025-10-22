import 'dotenv/config';
import { getPayload } from 'payload';
import config from '../payload.config';

(async () => {
  const payload = await getPayload({ config });

  console.log('Payload initialized');

  const cat = await payload.create({
    collection: 'categories',
    data: { title: 'Shoes', slug: 'shoes' },
  });

  const v1 = await payload.create({
    collection: 'variants',
    data: { sku: 'RUN-001-9', title: 'Size 9', price: 12900, inventory: 10 },
  });

  const p = await payload.create({
    collection: 'products',
    data: {
      title: 'Velocity Runner',
      slug: 'velocity-runner',
      categories: [cat.id],
      variants: [v1.id],
      defaultVariant: v1.id,
      blocks: [
        {
          blockType: 'feature',
          heading: 'Lightweight speed',
          body: [{ children: [{ text: 'Built for tempo days.' }] }],
        },
      ],
    },
  });

  console.log('Seeded product:', p.slug);
  process.exit(0);
})();

