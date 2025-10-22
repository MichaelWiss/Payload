import 'dotenv/config';
import { getPayload } from 'payload';
import config from '../payload.config.js';

(async () => {
  try {
    const payload = await getPayload({ config });

    console.log('Payload initialized, seeding data...');

    let cat: any;
    try {
      cat = await payload.create({
        collection: 'categories',
        data: { title: 'Pantry Staples', slug: 'pantry-staples' },
      });
      console.log('Created category:', cat.slug);
    } catch (catErr: any) {
      console.error('Category creation error:', catErr.message);
      if (catErr.data?.errors) {
        console.error('Validation errors:', catErr.data.errors);
      }
      throw catErr;
    }

    const v1 = await payload.create({
      collection: 'variants',
      data: { sku: 'OLIVE-500ML', title: '500ml Bottle', price: 2499, inventory: 50 },
    });
    console.log('Created variant:', v1.sku);

    const p = await payload.create({
      collection: 'products',
      data: {
        title: 'Artisan Olive Oil',
        slug: 'artisan-olive-oil',
        categories: [cat.id],
        variants: [v1.id],
        defaultVariant: v1.id,
        active: true,
        blocks: [
          {
            blockType: 'feature',
            heading: 'Cold-Pressed Flavor',
            body: [{ children: [{ text: 'Single-estate olives pressed within hours of harvest.' }] }],
          },
        ],
      },
    });
    console.log('Created product:', p.slug);
    console.log('\n✓ Seed complete!');
    process.exit(0);
  } catch (err: any) {
    console.error('Seed error:', err.message || err);
    if (err.data?.errors) {
      console.error('Full error data:', JSON.stringify(err.data, null, 2));
    }
    process.exit(1);
  }
})();


