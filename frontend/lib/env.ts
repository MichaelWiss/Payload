const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('Missing NEXT_PUBLIC_API_URL environment variable');
}

export const env = {
  apiUrl: API_URL.replace(/\/$/, ''),
};
