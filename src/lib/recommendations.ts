// src/lib/recommendations.ts
// Server-side genre-tag scoring algorithm for personalised recommendations
// Imports: ListeningHistory model, YouTube helpers, Track type

import type { Track } from '@/types';
import { searchYouTube, getRelatedVideos, GENRE_SEARCH_QUERIES } from './youtube';

export function scoreGenres(history: Array<{ genre?: string }>): Record<string, number> {
  const scores: Record<string, number> = {};
  history.forEach(({ genre }) => {
    if (genre) scores[genre] = (scores[genre] || 0) + 1;
  });
  return scores;
}

export function topGenres(scores: Record<string, number>, n = 3): string[] {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([g]) => g);
}

export async function getMadeForYou(genreScores: Record<string, number>): Promise<Track[]> {
  const genres = topGenres(genreScores, 2);
  const query =
    genres.length > 0
      ? genres.map((g) => GENRE_SEARCH_QUERIES[g] || g).join(' ')
      : 'bollywood hits 2024';

  try {
    return await searchYouTube(query, 10);
  } catch {
    return [];
  }
}

export async function getBecauseYouPlayed(youtubeId: string): Promise<Track[]> {
  try {
    return await getRelatedVideos(youtubeId, 8);
  } catch {
    return [];
  }
}

export async function getTrendingIndia(): Promise<Track[]> {
  try {
    return await searchYouTube('trending bollywood songs india 2024', 12);
  } catch {
    return [];
  }
}

export async function getNewReleases(): Promise<Track[]> {
  try {
    return await searchYouTube('new hindi songs 2024 latest', 10);
  } catch {
    return [];
  }
}

export async function getGenreStation(genre: string): Promise<Track[]> {
  const query = GENRE_SEARCH_QUERIES[genre] || `${genre} music`;
  try {
    return await searchYouTube(query, 10);
  } catch {
    return [];
  }
}
