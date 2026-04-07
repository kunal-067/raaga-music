// src/app/api/recommendations/route.ts
// Server-side recommendations endpoint - home feed and related tracks
// Imports: next/server, auth, connectDB, recommendation helpers, ListeningHistory model

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongoose';
import { ListeningHistoryModel } from '@/models/ListeningHistory.model';
import {
  scoreGenres,
  getMadeForYou,
  getBecauseYouPlayed,
  getTrendingIndia,
  getNewReleases,
  getGenreStation,
} from '@/lib/recommendations';
import { getRelatedVideos } from '@/lib/youtube';

const GENRES_TO_SHOW = ['Bollywood', 'Indie', 'Sufi', 'Lo-fi'];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const section = searchParams.get('section');
  const videoId = searchParams.get('videoId');
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  // Related tracks for "Because you played X"
  if (videoId) {
    try {
      const related = await getRelatedVideos(videoId, limit);
      return NextResponse.json(related);
    } catch {
      return NextResponse.json([]);
    }
  }

  // Home feed sections
  if (section === 'home') {
    try {
      await connectDB();
      const session = await auth();

      // Get user listening history for personalisation
      let genreScores: Record<string, number> = {};
      let lastPlayedId: string | undefined;

      if (session?.user?.id) {
        const history = await ListeningHistoryModel.find({ userId: session.user.id })
          .sort({ playedAt: -1 })
          .limit(50)
          .lean();
        genreScores = scoreGenres(history);
        lastPlayedId = history[0]?.youtubeId;
      }

      const [madeForYou, trending, newReleases, ...genreStations] = await Promise.allSettled([
        getMadeForYou(genreScores),
        getTrendingIndia(),
        getNewReleases(),
        ...GENRES_TO_SHOW.map((g) => getGenreStation(g)),
      ]);

      const sections = [
        {
          id: 'made-for-you',
          title: 'Made for You',
          tracks: madeForYou.status === 'fulfilled' ? madeForYou.value : [],
        },
        {
          id: 'trending-india',
          title: 'Trending in India 🇮🇳',
          tracks: trending.status === 'fulfilled' ? trending.value : [],
        },
        {
          id: 'new-releases',
          title: 'New Releases',
          tracks: newReleases.status === 'fulfilled' ? newReleases.value : [],
        },
        ...GENRES_TO_SHOW.map((genre, i) => ({
          id: `genre-${genre.toLowerCase()}`,
          title: genre,
          tracks: genreStations[i]?.status === 'fulfilled'
            ? (genreStations[i] as PromiseFulfilledResult<Awaited<ReturnType<typeof getGenreStation>>>).value
            : [],
        })),
      ];

      // Add "Because you played X" if applicable
      if (lastPlayedId) {
        const because = await getBecauseYouPlayed(lastPlayedId).catch(() => []);
        if (because.length) {
          sections.splice(1, 0, {
            id: 'because-you-played',
            title: 'Because you played this',
            tracks: because,
          });
        }
      }

      return NextResponse.json(sections.filter((s) => s.tracks.length > 0));
    } catch (err) {
      console.error('Recommendations error:', err);
      return NextResponse.json([]);
    }
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
