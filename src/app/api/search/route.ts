// src/app/api/search/route.ts
// Proxies YouTube Data API v3 search - keeps API key server-side only
// Imports: next/server, searchYouTube from lib/youtube

import { NextRequest, NextResponse } from 'next/server';
import { searchYouTube } from '@/lib/youtube';
import { TrackModel } from '@/models/Track.model';
import { connectDB } from '@/lib/mongoose';

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q')?.trim();
  const genre = searchParams.get('genre') || undefined;
  const maxResults = parseInt(searchParams.get('maxResults') || '20', 10);

  if (!q) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

  const finalQuery = genre ? `${q} ${genre}` : q;

  try {
    await connectDB();

    // Check MongoDB track cache first
    const cached = await TrackModel.find({
      title: { $regex: q, $options: 'i' },
      cachedAt: { $gt: new Date(Date.now() - CACHE_TTL_MS) },
    })
      .limit(maxResults)
      .lean();

    if (cached.length >= 5) {
      return NextResponse.json({
        tracks: cached.map((t) => ({
          youtubeId: t.youtubeId,
          title: t.title,
          artist: t.artist,
          thumbnail: t.thumbnail,
          duration: t.duration,
          genre: t.genre,
        })),
        totalResults: cached.length,
        query: q,
      });
    }

    // Fallback to YouTube API
    const tracks = await searchYouTube(finalQuery, maxResults);

    // Cache results in MongoDB
    for (const track of tracks) {
      await TrackModel.findOneAndUpdate(
        { youtubeId: track.youtubeId },
        { ...track, genre, cachedAt: new Date() },
        { upsert: true }
      ).catch(() => null);
    }

    return NextResponse.json({ tracks, totalResults: tracks.length, query: q });
  } catch (err) {
    console.error('Search error:', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
