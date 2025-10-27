export interface PayloadListResponse<T> {
  docs: T[];
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  limit?: number;
  page?: number;
  totalDocs?: number;
  totalPages?: number;
}

export interface Media {
  id: string;
  url?: string;
  filename?: string;
  alt?: string | null;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  image?: Media | string | null;
}

export interface Variant {
  id: string;
  title: string;
  sku: string;
  price: number;
  inventory: number;
  currency?: string | null;
  attributes?: Array<{
    name?: string | null;
    value?: string | null;
  }>;
}

export interface ProductBlock {
  id?: string;
  blockType: string;
  heading?: string | null;
  body?: Array<{ children: Array<{ text: string }> }>;
  media?: Media | string | null;
  items?: Array<{ label?: string; value?: string }>;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  categories?: Array<Category | string>;
  images?: Array<Media | string>;
  variants?: Array<Variant | string>;
  defaultVariant?: Variant | string | null;
  active?: boolean;
  blocks?: ProductBlock[];
  seo?: {
    title?: string;
    description?: string;
  } | null;
}
