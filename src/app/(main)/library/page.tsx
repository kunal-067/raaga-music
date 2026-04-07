// src/app/main/library/page.tsx
// Library page showing all user playlists and liked songs
// Imports: auth, LibraryClient component

import { auth } from '@/lib/auth';
import { LibraryClient } from '@/components/playlist/LibraryClient';

export default async function LibraryPage() {
  const session = await auth();
  return (
    <div className="px-6 pb-8">
      <LibraryClient session={session} />
    </div>
  );
}
