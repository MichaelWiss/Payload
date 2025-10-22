import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumb', width: 400, height: 400, position: 'centre' },
      { name: 'card', width: 800, height: 800, position: 'centre' },
    ],
    adminThumbnail: 'thumb',
    mimeTypes: ['image/*'],
  },
  admin: { useAsTitle: 'filename' },
  fields: [{ name: 'alt', type: 'text' }],
};
