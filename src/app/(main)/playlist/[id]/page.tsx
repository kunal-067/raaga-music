// src/app/(main)/playlist/[id]/page.tsx
// Dynamic playlist detail page
// Imports: PlaylistDetail component

import { PlaylistDetail } from '@/components/playlist/PlaylistDetail';

interface Props { params: { id: string }; }

export default function PlaylistPage({ params }: Props) {
  return <PlaylistDetail playlistId={params.id} />;
}
