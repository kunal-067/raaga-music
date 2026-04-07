// src/hooks/useRecommendations.ts
// Hook for fetching and managing home feed recommendations
// Imports: RTK Query recommendApi, useAppSelector for current track

import { useGetHomeRecommendationsQuery, useGetRelatedTracksQuery } from '@/store/api/recommendApi';
import { useAppSelector } from '@/store';

export function useRecommendations() {
  const currentTrack = useAppSelector((s) => s.player.currentTrack);

  const { data: sections = [], isLoading: homeLoading } = useGetHomeRecommendationsQuery();

  const { data: related = [] } = useGetRelatedTracksQuery(
    { videoId: currentTrack?.youtubeId || '', limit: 10 },
    { skip: !currentTrack }
  );

  return { sections, homeLoading, related };
}
