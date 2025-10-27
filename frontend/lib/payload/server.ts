import { env } from "@/lib/env";
import type {
  Category,
  PayloadListResponse,
  Product,
} from "@/types/payload";

type FetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

async function payloadFetch<T>(path: string, init?: FetchOptions): Promise<T> {
  const url = `${env.apiUrl}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    next: { revalidate: 60, ...init?.next },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Payload request failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await payloadFetch<PayloadListResponse<Category>>(
      `/api/categories?limit=100&sort=title`
    );
    return data.docs;
  } catch (error) {
    console.error('Failed to fetch categories from Payload:', error);
    return [];
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const data = await payloadFetch<PayloadListResponse<Category>>(
      `/api/categories?where[slug][equals]=${slug}&limit=1`
    );

    return data.docs[0] ?? null;
  } catch (error) {
    console.error(`Failed to fetch category '${slug}' from Payload:`, error);
    return null;
  }
}

export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  const params = new URLSearchParams({
    "where[active][equals]": "true",
    depth: "2",
    limit: String(limit),
    sort: "-createdAt",
  });
  try {
    const data = await payloadFetch<PayloadListResponse<Product>>(
      `/api/products?${params.toString()}`
    );
    return data.docs;
  } catch (error) {
    console.error('Failed to fetch featured products from Payload:', error);
    return [];
  }
}

export async function fetchProductsByCategoryId(
  categoryId: string
): Promise<Product[]> {
  const params = new URLSearchParams({
    depth: "2",
    limit: "50",
    "where[categories][contains]": categoryId,
    "where[active][equals]": "true",
    sort: "title",
  });
  try {
    const data = await payloadFetch<PayloadListResponse<Product>>(
      `/api/products?${params.toString()}`
    );
    return data.docs;
  } catch (error) {
    console.error(`Failed to fetch products for category '${categoryId}' from Payload:`, error);
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const params = new URLSearchParams({
    depth: "2",
    limit: "1",
    "where[slug][equals]": slug,
  });
  try {
    const data = await payloadFetch<PayloadListResponse<Product>>(
      `/api/products?${params.toString()}`
    );
    return data.docs[0] ?? null;
  } catch (error) {
    console.error(`Failed to fetch product '${slug}' from Payload:`, error);
    return null;
  }
}
