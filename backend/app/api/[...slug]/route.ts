import { getPayload } from 'payload';

import config from '@/src/payload.config';

const payload = await getPayload({ config });

export const GET = payload.handlers.rest;
export const POST = payload.handlers.rest;
export const DELETE = payload.handlers.rest;
export const PATCH = payload.handlers.rest;
export const PUT = payload.handlers.rest;
