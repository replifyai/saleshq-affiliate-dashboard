import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for Next internals and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets') ||
    /\.(.*)$/.test(pathname) // files with extensions
  ) {
    return NextResponse.next();
  }

  const idToken = request.cookies.get('idToken')?.value;
  const isAuthenticated = Boolean(idToken);

  const isUnauthenticatedRoute =
    pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/signup');

  // Redirect unauthenticated users trying to access authenticated pages
  if (!isAuthenticated && !isUnauthenticatedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Preserve intended destination
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from unauthenticated routes
  if (isAuthenticated && isUnauthenticatedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all pages except Next internals, API routes, and static files
  matcher: ['/((?!_next|api|static|.*\\..*).*)'],
};


