import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken');

  const isAuthRoute = pathname.startsWith('/sign-');
  const isPrivateRoute =
    pathname.startsWith('/notes') || pathname.startsWith('/profile');

  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
