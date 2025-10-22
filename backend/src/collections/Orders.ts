import type { CollectionConfig } from 'payload';

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: { useAsTitle: 'stripeId' },
  access: {
    read: ({ req }) => !!req.user,
    create: () => true,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'stripeId', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      options: ['created', 'paid', 'failed', 'refunded'],
      defaultValue: 'created',
    },
    { name: 'email', type: 'email', required: true },
    {
      name: 'lineItems',
      type: 'array',
      required: true,
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'variant', type: 'relationship', relationTo: 'variants' },
        { name: 'quantity', type: 'number', min: 1 },
        { name: 'unitAmount', type: 'number' },
        { name: 'currency', type: 'text', defaultValue: 'usd' },
      ],
    },
    { name: 'subtotal', type: 'number' },
    { name: 'discountTotal', type: 'number' },
    { name: 'total', type: 'number' },
    { name: 'metadata', type: 'json' },
  ],
};
