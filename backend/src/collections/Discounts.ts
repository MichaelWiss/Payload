import type { CollectionConfig } from 'payload';

export const Discounts: CollectionConfig = {
  slug: 'discounts',
  admin: { useAsTitle: 'code' },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true },
    { name: 'type', type: 'select', options: ['percent', 'fixed'], defaultValue: 'percent' },
    { name: 'value', type: 'number', required: true },
    { name: 'startsAt', type: 'date' },
    { name: 'endsAt', type: 'date' },
    { name: 'appliesToProducts', type: 'relationship', relationTo: 'products', hasMany: true },
    { name: 'appliesToCategories', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
};
