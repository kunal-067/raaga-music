// src/components/recommendation/RecommendationRow.tsx
// Horizontal scrolling row of TrackCards for home feed sections
// Imports: TrackCard, Track type, RecommendationSection type

'use client';

import { TrackCard } from '@/components/track/TrackCard';
import type { RecommendationSection } from '@/types';

interface RecommendationRowProps {
  section: RecommendationSection;
}

export function RecommendationRow({ section }: RecommendationRowProps) {
  if (!section.tracks.length) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora text-xl font-bold text-[var(--raaga-text)]">{section.title}</h2>
        <button className="text-xs font-semibold uppercase tracking-wider text-[var(--raaga-text3)] hover:text-[var(--raaga-text)] transition-colors">
          See all
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {section.tracks.slice(0, 6).map((track) => (
          <TrackCard key={track.youtubeId} track={track} />
        ))}
      </div>
    </div>
  );
}
