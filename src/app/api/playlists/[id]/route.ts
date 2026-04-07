// src/app/api/playlists/[id]/route.ts
// GET, PUT, DELETE a single playlist by ID
// Imports: next/server, auth, connectDB, PlaylistModel

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongoose';
import { PlaylistModel } from '@/models/Playlist.model';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const playlist = await PlaylistModel.findById(params.id).lean();
    if (!playlist) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const session = await auth();
    if (!playlist.isPublic && playlist.ownerId.toString() !== session?.user?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
    const playlist = await PlaylistModel.findById(params.id);
    if (!playlist) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (playlist.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    const updated = await PlaylistModel.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const playlist = await PlaylistModel.findById(params.id);
    if (!playlist) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (playlist.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await PlaylistModel.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
