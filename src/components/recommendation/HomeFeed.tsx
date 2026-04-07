// src/components/recommendation/HomeFeed.tsx
// Client component fetching and rendering home page recommendation sections
// Imports: useGetHomeRecommendationsQuery, RecommendationRow, GenreGrid, Skeleton

'use client';

import { useGetHomeRecommendationsQuery } from '@/store/api/recommendApi';
import { RecommendationRow } from './RecommendationRow';
import { GenreGrid } from './GenreGrid';
import { TrackCard } from '@/components/track/TrackCard';
import { usePlayer } from '@/hooks/usePlayer';
import { useAppSelector } from '@/store';

function SkeletonCard() {
  return (
    <div className="rounded-xl p-4 bg-[var(--raaga-card)]">
      <div className="aspect-square rounded-lg skeleton-shimmer mb-3" />
      <div className="h-4 rounded skeleton-shimmer mb-2 w-4/5" />
      <div className="h-3 rounded skeleton-shimmer w-3/5" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="mb-8">
      <div className="h-6 w-48 rounded skeleton-shimmer mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

export function HomeFeed() {
  const { data: sections = [], isLoading } = useGetHomeRecommendationsQuery();
  const player = usePlayer();
  const recentlyPlayed = useAppSelector((s) => s.user.recentlyPlayed);

  if (isLoading) {
    return (
      <>
        {recentlyPlayed.length > 0 && (
          <div className="mb-6">
            <h2 className="font-sora text-xl font-bold mb-4">Jump back in</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {recentlyPlayed.slice(0, 6).map((t) => (
                <div
                  key={t.youtubeId}
                  className="flex items-center gap-3 bg-[var(--raaga-elevated)] rounded-lg pr-3 cursor-pointer hover:bg-[var(--raaga-highlight)] transition-colors overflow-hidden"
                  onClick={() => player.play(t)}
                >
                  <div className="w-14 h-14 bg-[var(--raaga-card)] rounded-l-lg shrink-0 overflow-hidden relative">
                    {t.thumbnail && (
                      <img src={t.thumbnail} alt={t.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <p className="text-sm font-semibold truncate">{t.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </>
    );
  }

  return (
    <>
      {/* Recently played quick picks */}
      {recentlyPlayed.length > 0 && (
        <div className="mb-6">
          <h2 className="font-sora text-xl font-bold mb-4">Jump back in</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {recentlyPlayed.slice(0, 6).map((t) => (
              <div
                key={t.youtubeId}
                className="flex items-center gap-3 bg-[var(--raaga-elevated)] rounded-lg pr-3 cursor-pointer hover:bg-[var(--raaga-highlight)] transition-colors overflow-hidden"
                onClick={() => player.play(t)}
              >
                <div className="w-14 h-14 bg-[var(--raaga-card)] rounded-l-lg shrink-0 overflow-hidden relative">
                  {t.thumbnail && (
                    <img src={t.thumbnail} alt={t.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <p className="text-sm font-semibold truncate">{t.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendation sections from API */}
      {sections.map((section) => (
        <RecommendationRow key={section.id} section={section} />
      ))}

      {/* Genre browse grid */}
      <div className="mb-8">
        <h2 className="font-sora text-xl font-bold mb-4">Browse by Genre</h2>
        <GenreGrid />
      </div>

      {/* Fallback if no sections */}
      {sections.length === 0 && (
        <div className="text-center py-16 text-[var(--raaga-text3)]">
          <p className="text-5xl mb-4">🎵</p>
          <p className="text-lg font-semibold mb-2">Add your YouTube API key</p>
          <p className="text-sm">Set YOUTUBE_API_KEY in .env.local to load music recommendations</p>
        </div>
      )}
    </>
  );
}
