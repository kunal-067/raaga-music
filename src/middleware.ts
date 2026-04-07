// src/middleware.ts
// Next.js middleware protecting main routes — redirects unauthenticated users to login
// Imports: next-auth, NextResponse

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow public routes
  const publicPaths = ['/auth/login', '/auth/register', '/api/auth', '/api/search', '/api/recommendations'];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  if (isPublic) return NextResponse.next();

  // Protect API routes (except search and recommendations which allow guests)
  if (pathname.startsWith('/api/playlists')) {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
