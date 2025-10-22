import type { GlobalConfig } from 'payload';

export const Settings: GlobalConfig = {
  slug: 'settings',
  fields: [
    { name: 'siteName', type: 'text', required: true },
    {
      name: 'theme',
      type: 'group',
      fields: [
        { name: 'brandColor', type: 'text' },
        { name: 'accentColor', type: 'text' },
      ],
    },
  ],
};
