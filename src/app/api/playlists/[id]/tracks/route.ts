// src/app/api/playlists/[id]/tracks/route.ts
// POST add track to playlist, PUT reorder tracks
// Imports: next/server, auth, connectDB, PlaylistModel, TrackModel

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongoose';
import { PlaylistModel } from '@/models/Playlist.model';
import { TrackModel } from '@/models/Track.model';

async function checkOwner(playlistId: string, userId: string) {
  const playlist = await PlaylistModel.findById(playlistId);
  if (!playlist) return null;
  if (playlist.ownerId.toString() !== userId) return null;
  return playlist;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const playlist = await checkOwner(params.id, session.user.id);
    if (!playlist) return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
    const track = await req.json();
    if (!playlist.trackIds.includes(track.youtubeId)) {
      playlist.trackIds.push(track.youtubeId);
      await playlist.save();
      await TrackModel.findOneAndUpdate(
        { youtubeId: track.youtubeId },
        { ...track, cachedAt: new Date() },
        { upsert: true, new: true }
      );
    }
    return NextResponse.json(playlist);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const playlist = await checkOwner(params.id, session.user.id);
    if (!playlist) return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
    const { trackIds } = await req.json();
    playlist.trackIds = trackIds;
    await playlist.save();
    return NextResponse.json(playlist);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
