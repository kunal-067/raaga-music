// src/components/playlist/LibraryClient.tsx
// Client component for library page showing all playlists and liked songs
// Imports: useGetPlaylistsQuery, Link, useAppDispatch, openModal, Session type

'use client';

import Link from 'next/link';
import { Plus, Heart } from 'lucide-react';
import { useGetPlaylistsQuery } from '@/store/api/playlistApi';
import { useAppDispatch, useAppSelector } from '@/store';
import { openModal } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { Session } from 'next-auth';

type SortKey = 'recent' | 'alpha' | 'played';
const SORT_LABELS: Record<SortKey, string> = { recent: 'Recently added', alpha: 'Alphabetical', played: 'Most played' };

interface LibraryClientProps {
  session: Session | null;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl p-4 bg-[var(--raaga-card)]">
      <div className="aspect-square rounded-lg skeleton-shimmer mb-3" />
      <div className="h-4 skeleton-shimmer rounded mb-2 w-4/5" />
      <div className="h-3 skeleton-shimmer rounded w-3/5" />
    </div>
  );
}

export function LibraryClient({ session }: LibraryClientProps) {
  const dispatch = useAppDispatch();
  const likedSongIds = useAppSelector((s) => s.user.likedSongIds);
  const { data: playlists = [], isLoading } = useGetPlaylistsQuery(undefined, { skip: !session });
  const [sort, setSort] = useState<SortKey>('recent');
  const [filter, setFilter] = useState<'all' | 'playlists' | 'liked'>('all');

  const sorted = [...playlists].sort((a, b) => {
    if (sort === 'alpha') return a.name.localeCompare(b.name);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-5xl mb-4">🎵</p>
        <h2 className="font-sora text-2xl font-bold mb-2">Enjoy your music</h2>
        <p className="text-[var(--raaga-text3)] mb-6">Log in to see your saved songs and playlists</p>
        <button
          onClick={() => dispatch(openModal('auth'))}
          className="px-8 py-3 rounded-full bg-[var(--raaga-accent)] text-black font-bold hover:scale-[1.03] transition-transform"
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-4 mb-4">
        <h1 className="font-sora text-2xl font-bold">Your Library</h1>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter pills */}
          <div className="flex gap-2">
            {(['all', 'playlists', 'liked'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize',
                  filter === f
                    ? 'bg-[var(--raaga-text)] text-[var(--raaga-bg)] border-[var(--raaga-text)]'
                    : 'border-[var(--raaga-border)] text-[var(--raaga-text2)] hover:border-[var(--raaga-text)]'
                )}
              >
                {f === 'liked' ? 'Liked Songs' : f === 'all' ? 'All' : 'Playlists'}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-[var(--raaga-elevated)] border border-[var(--raaga-border)] rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
          >
            {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <button
            onClick={() => dispatch(openModal('create-playlist'))}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--raaga-accent)] text-black rounded-full text-xs font-bold hover:scale-105 transition-transform"
          >
            <Plus className="w-3.5 h-3.5" /> New
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {/* Liked Songs special card */}
          {(filter === 'all' || filter === 'liked') && (
            <Link
              href="/playlist/liked"
              className="rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-[var(--raaga-highlight)] hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br from-indigo-600 to-purple-600 group"
            >
              <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-3 shadow-lg">
                <Heart className="w-12 h-12 text-white fill-white" />
              </div>
              <p className="text-sm font-semibold mb-1 text-white">Liked Songs</p>
              <p className="text-xs text-white/70">{likedSongIds.length} songs</p>
            </Link>
          )}

          {(filter === 'all' || filter === 'playlists') && sorted.map((pl) => (
            <Link
              key={pl._id}
              href={`/playlist/${pl._id}`}
              className="bg-[var(--raaga-card)] rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-[var(--raaga-highlight)] hover:scale-[1.02] hover:shadow-lg group"
            >
              <div className="w-full aspect-square rounded-lg bg-[var(--raaga-elevated)] flex items-center justify-center text-5xl mb-3">
                {pl.coverEmoji}
              </div>
              <p className="text-sm font-semibold truncate mb-1">{pl.name}</p>
              <p className="text-xs text-[var(--raaga-text3)]">Playlist · {pl.trackIds.length} songs</p>
            </Link>
          ))}

          {sorted.length === 0 && filter !== 'liked' && (
            <div className="col-span-full text-center py-16 text-[var(--raaga-text3)]">
              <p className="text-4xl mb-3">🎵</p>
              <p className="font-semibold mb-2">Create your first playlist</p>
              <button
                onClick={() => dispatch(openModal('create-playlist'))}
                className="mt-2 px-6 py-2 bg-[var(--raaga-accent)] text-black rounded-full text-sm font-bold hover:scale-105 transition-transform"
              >
                Create playlist
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
