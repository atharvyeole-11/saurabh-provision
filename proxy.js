import { NextResponse } from 'next/server';
export function proxy(request) {
  const token = request.cookies.get('token');
  if (request.nextUrl.pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ['/admin/:path*'] };
