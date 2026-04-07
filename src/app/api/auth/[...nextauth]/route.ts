// src/app/api/auth/[...nextauth]/route.ts
// NextAuth v5 catch-all route handler
// Imports: handlers from lib/auth

import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;
