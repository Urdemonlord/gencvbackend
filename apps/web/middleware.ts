import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders } from './lib/cors';

// Simple in-memory rate limiter
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
async function rateLimit(request: NextRequest, limit: number = 10, windowMs: number = 60000): Promise<boolean> {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean up old entries
  const keysToDelete: string[] = [];
  rateLimiter.forEach((value, key) => {
    if (value.resetTime < windowStart) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach(key => rateLimiter.delete(key));
  
  const userLimit = rateLimiter.get(ip);
  
  if (!userLimit) {
    rateLimiter.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.resetTime < now) {
    rateLimiter.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= limit) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const isAllowed = await rateLimit(request, 20, 60000); // 20 requests per minute
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    // API key check for production
    if (process.env.NODE_ENV === 'production') {
      const apiKey = request.headers.get('x-api-key');
      if (apiKey && apiKey !== process.env.API_SECRET_KEY) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }
    }
  }
  
  // Add security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Add CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    const cors = getCorsHeaders(request);
    Object.entries(cors).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
