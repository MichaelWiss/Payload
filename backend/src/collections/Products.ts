import type { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'title' },
  access: {
    read: () => true, // Public read access for storefront
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'richText' },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'images', type: 'relationship', relationTo: 'media', hasMany: true },
    { name: 'defaultVariant', type: 'relationship', relationTo: 'variants' },
    { name: 'variants', type: 'relationship', relationTo: 'variants', hasMany: true },
    { name: 'active', type: 'checkbox', defaultValue: true },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'feature',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'body', type: 'richText' },
            { name: 'media', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          slug: 'specs',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'value', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
};
