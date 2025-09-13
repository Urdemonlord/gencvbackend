import { NextRequest } from 'next/server';

export function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const allowedEnv = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || '';

  let allowOrigin = '*';
  if (allowedEnv) {
    const allowed = allowedEnv.split(',').map(o => o.trim());
    if (origin && allowed.includes(origin)) {
      allowOrigin = origin;
    } else {
      allowOrigin = allowed[0];
    }
  } else if (origin) {
    allowOrigin = origin;
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key'
  } as Record<string, string>;
}
