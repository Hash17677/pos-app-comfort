import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session from cookies
  const sessionCookie = request.cookies.get('comfort_session_data');
  let isAuthenticated = false;

  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(sessionCookie.value);
      isAuthenticated = session.isLoggedIn === true;
    } catch {
      isAuthenticated = false;
    }
  }

  // If trying to access protected routes without authentication
  if (pathname === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If accessing login page while authenticated
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login'],
};
