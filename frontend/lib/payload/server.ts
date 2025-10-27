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

function ensureError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(typeof error === "string" ? error : "Unknown error");
}

function handlePayloadError(action: string, error: unknown): never {
  const err = ensureError(error);
  console.error(`Failed to ${action} from Payload:`, err);
  throw new Error(`We couldn't ${action} from Payload right now. Please try again shortly.`);
}

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
    handlePayloadError("fetch categories", error);
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const data = await payloadFetch<PayloadListResponse<Category>>(
      `/api/categories?where[slug][equals]=${slug}&limit=1`
    );
    return data.docs[0] ?? null;
  } catch (error) {
    handlePayloadError(`fetch category “${slug}”`, error);
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
    handlePayloadError("fetch featured products", error);
  }
}

type ProductQueryOptions = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
};

export async function fetchProductsByCategoryId(
  categoryId: string,
  options: ProductQueryOptions = {}
): Promise<PayloadListResponse<Product>> {
  const limit = options.limit ?? 12;
  const page = options.page ?? 1;

  const params = new URLSearchParams({
    depth: "2",
    limit: String(limit),
    page: String(page),
    "where[categories][contains]": categoryId,
    "where[active][equals]": "true",
  });

  if (options.sort) {
    params.set("sort", options.sort);
  }

  if (options.search) {
    params.set("where[title][like]", `%${options.search}%`);
  }

  try {
    return await payloadFetch<PayloadListResponse<Product>>(
      `/api/products?${params.toString()}`
    );
  } catch (error) {
    handlePayloadError(`fetch products for category “${categoryId}”`, error);
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
    handlePayloadError(`fetch product “${slug}”`, error);
  }
}
