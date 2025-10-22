import type { CollectionConfig } from 'payload';

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'product', type: 'relationship', relationTo: 'products', required: true },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'title', type: 'text' },
    { name: 'rating', type: 'number', min: 1, max: 5, required: true },
    { name: 'body', type: 'textarea' },
    { name: 'approved', type: 'checkbox', defaultValue: false },
  ],
};
