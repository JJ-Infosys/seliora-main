import { NextRequest, NextResponse } from 'next/server';

// jsonwebtoken doesn't work in Edge Runtime — decode payload manually.
// Real signature verification still happens in adminMiddleware (Node.js runtime).
function decodeTokenPayload(token: string): any {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    const payload = decodeTokenPayload(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
