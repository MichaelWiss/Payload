import { CollectionConfig } from 'payload/types';

export const Variants: CollectionConfig = {
  slug: 'variants',
  admin: { useAsTitle: 'sku' },
  fields: [
    { name: 'sku', type: 'text', required: true, unique: true },
    { name: 'title', type: 'text' },
    { name: 'price', type: 'number', required: true, min: 0 },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    { name: 'inventory', type: 'number', defaultValue: 0 },
    {
      name: 'attributes',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'value', type: 'text' },
      ],
    },
  ],
};
