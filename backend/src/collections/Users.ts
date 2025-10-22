import type { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  upload: false,
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
      ],
      defaultValue: 'customer',
    },
    { name: 'name', type: 'text' },
  ],
};
