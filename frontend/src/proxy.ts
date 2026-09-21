import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js Proxy (Edge Middleware).
 *
 * Responsibilities:
 * 1. Sets x-pathname header on every request so server components
 *    (e.g. root layout.tsx) can read the current path without access
 *    to the window/navigation APIs.
 *
 * 2. Protects /dashboard/* routes at the edge:
 *    - Reads JWT token from 'token' cookie or Authorization header
 *    - Validates basic JWT structure (3 base64url segments)
 *    - Unauthenticated users → redirected to /login?redirect=<path>
 *    - Malformed tokens → cookie cleared, redirected to /login
 *    - Full cryptographic signature verification is left to the backend
 *      (every API call is verified there anyway)
 */

function hasValidTokenStructure(token: string): boolean {
  const parts = token.split('.')
  return parts.length === 3 && parts.every((p) => p.length > 0)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Always set x-pathname for server components ──
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // ── Dashboard auth guard ──
  if (pathname.startsWith('/dashboard')) {
    const cookieToken = request.cookies.get('token')?.value
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '')
    const token = cookieToken || headerToken

    // No token → redirect to login, preserving destination
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Malformed token → clear cookie + redirect
    if (!hasValidTokenStructure(token)) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('reason', 'invalid_token')
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('token')
      return response
    }
  }

  // ── Pass through with updated headers ──
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Run on all paths (x-pathname needed everywhere; dashboard guard is internal)
export const config = {
  matcher: '/:path*',
}
