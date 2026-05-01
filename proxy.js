import { NextResponse } from 'next/server';

/**
 * proxy.js — Next.js 15+ replacement for middleware.js
 *
 * Protects /admin routes: redirects unauthenticated visitors to /login.
 * Token validation (JWT decode) happens inside the individual API routes
 * via lib/auth.js — this guard only checks for the cookie's existence so
 * it stays lightweight and runs on the edge.
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;

  // ── Protect admin routes ──────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on admin pages and all API routes (skip static assets + _next internals)
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
