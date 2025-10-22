import { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'customer',
      options: ['admin', 'customer'],
    },
    { name: 'name', type: 'text' },
  ],
};

