import { env } from '@/lib/env';

type ClientFetchOptions = RequestInit & {
  cache?: RequestCache;
};

export async function payloadFetchClient<T>(path: string, init?: ClientFetchOptions): Promise<T> {
  const url = `${env.apiUrl}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    cache: init?.cache ?? 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Payload client request failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<T>;
}

export function createPayloadFetcher<T>(path: string, init?: ClientFetchOptions) {
  return () => payloadFetchClient<T>(path, init);
}
