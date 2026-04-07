// src/app/api/playlists/route.ts
// GET all playlists for auth user, POST create new playlist
// Imports: next/server, auth, connectDB, PlaylistModel

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongoose';
import { PlaylistModel } from '@/models/Playlist.model';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const playlists = await PlaylistModel.find({ ownerId: session.user.id }).sort({ updatedAt: -1 }).lean();
    return NextResponse.json(playlists);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const playlist = await PlaylistModel.create({
      name: body.name,
      description: body.description,
      coverEmoji: body.coverEmoji || '🎵',
      coverImage: body.coverImage,
      ownerId: session.user.id,
      isPublic: body.isPublic ?? false,
      trackIds: [],
    });
    return NextResponse.json(playlist, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
