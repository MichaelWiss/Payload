import { env } from "@/lib/env";
import type {
  Category,
  PayloadListResponse,
  Product,
  Variant,
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
  const data = await payloadFetch<PayloadListResponse<Category>>(
    `/api/categories?limit=100&sort=title`
  );
  return data.docs;
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const data = await payloadFetch<PayloadListResponse<Category>>(
    `/api/categories?where[slug][equals]=${slug}&limit=1`
  );

  return data.docs[0] ?? null;
}

export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  const params = new URLSearchParams({
    "where[active][equals]": "true",
    depth: "2",
    limit: String(limit),
    sort: "-createdAt",
  });
  const data = await payloadFetch<PayloadListResponse<Product>>(
    `/api/products?${params.toString()}`
  );
  return data.docs;
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
  const data = await payloadFetch<PayloadListResponse<Product>>(
    `/api/products?${params.toString()}`
  );
  return data.docs;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const params = new URLSearchParams({
    depth: "2",
    limit: "1",
    "where[slug][equals]": slug,
  });
  const data = await payloadFetch<PayloadListResponse<Product>>(
    `/api/products?${params.toString()}`
  );
  return data.docs[0] ?? null;
}

export function resolveVariant(variant: Variant | string | undefined | null): Variant | null {
  if (!variant) return null;
  if (typeof variant === "string") {
    return null;
  }
  return variant;
}

export function resolveVariants(
  variants: Array<Variant | string | undefined> | undefined | null
): Variant[] {
  if (!variants) return [];
  return variants.filter((variant): variant is Variant => typeof variant !== "string" && !!variant);
}
