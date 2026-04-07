// src/app/(main)/artist/[id]/page.tsx
// Artist page — shows artist info and top tracks
// Imports: SearchPageClient with prefilled query

import { SearchPageClient } from '@/components/search/SearchPageClient';

interface Props { params: { id: string }; }

export default function ArtistPage({ params }: Props) {
  return (
    <div className="px-6 pb-8 pt-2">
      <h1 className="font-sora text-2xl font-bold mb-6">Artist</h1>
      <SearchPageClient />
    </div>
  );
}
