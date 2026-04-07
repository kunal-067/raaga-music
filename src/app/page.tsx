// src/app/page.tsx
// Root redirect — sends users to /main (home feed)
// Imports: next/navigation redirect

import { redirect } from 'next/navigation';

export default async function HomePage() {
  redirect("/home")
}
