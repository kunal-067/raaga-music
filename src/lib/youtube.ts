// src/lib/youtube.ts
// YouTube Data API v3 helper functions (server-side only)
// Imports: parseDuration from utils, Track type

import { parseDuration } from './utils';
import type { Track, YouTubeSearchResult, YouTubeVideoDetails } from '@/types';

const BASE = 'https://www.googleapis.com/youtube/v3';
const KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyA3q_nC59BVh9-ol_KU4t624pHT6w6dCrg';

export async function searchYouTube(
  query: string,
  maxResults = 20
): Promise<Track[]> {
  if (!KEY) throw new Error('YOUTUBE_API_KEY is not set');

  const url = `${BASE}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${KEY}&videoCategoryId=10`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`YouTube search failed: ${res.statusText}`);

  const data = await res.json();
  const items: YouTubeSearchResult[] = data.items || [];
  const videoIds = items.map((i) => i.id.videoId).join(',');

  const details = await getVideoDetails(videoIds);

  return items.map((item) => {
    const detail = details[item.id.videoId];
    return {
      youtubeId: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.high?.url,
      duration: detail?.duration,
      durationStr: detail?.durationStr,
    };
  });
}

export async function getVideoDetails(
  videoIds: string
): Promise<Record<string, { duration: number; durationStr: string }>> {
  if (!KEY || !videoIds) return {};

  const url = `${BASE}/videos?part=contentDetails,snippet&id=${videoIds}&key=${KEY}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return {};

  const data = await res.json();
  const map: Record<string, { duration: number; durationStr: string }> = {};

  for (const item of (data.items || []) as YouTubeVideoDetails[]) {
    const secs = parseDuration(item.contentDetails.duration);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    map[item.id] = { duration: secs, durationStr: `${m}:${s.toString().padStart(2, '0')}` };
  }
  return map;
}

export async function getRelatedVideos(videoId: string, limit = 10): Promise<Track[]> {
  if (!KEY) return [];

  const url = `${BASE}/search?part=snippet&type=video&relatedToVideoId=${videoId}&maxResults=${limit}&key=${KEY}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const data = await res.json();
  const items: YouTubeSearchResult[] = (data.items || []).filter(
    (i: YouTubeSearchResult) => i.id?.videoId
  );

  return items.map((item) => ({
    youtubeId: item.id.videoId,
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.medium?.url,
  }));
}

// Curated Indian music channel / playlist IDs for recommendations
export const INDIAN_MUSIC_CHANNELS = {
  trending: 'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI',
  bollywood: 'PLFgquLnL59akA2PflFpeQG9L01VFg90wS',
  indie: 'PLFgquLnL59alW3xmYiWRaoz0anC0rKtfY',
};

export const GENRE_SEARCH_QUERIES: Record<string, string> = {
  Bollywood: 'bollywood hits 2024',
  Indie: 'indian indie music 2024',
  Sufi: 'sufi songs hindi',
  Classical: 'indian classical music',
  Pop: 'hindi pop songs 2024',
  'Hip-Hop': 'indian hip hop rap 2024',
  'Lo-fi': 'lo-fi hindi songs',
  EDM: 'bollywood edm remix 2024',
  Folk: 'indian folk music',
  Rock: 'indian rock music',
};
