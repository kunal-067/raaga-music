// src/components/player/MiniPlayer.tsx
// Mobile-only mini player bar shown above bottom nav; tap to expand NowPlayingView
// Imports: usePlayer, useAppDispatch, lucide-react, next/image

'use client';

import Image from 'next/image';
import { Play, Pause, SkipForward } from 'lucide-react';
import { usePlayer } from '@/hooks/usePlayer';
import { useAppDispatch } from '@/store';
import { toggleNowPlaying } from '@/store/slices/uiSlice';

export function MiniPlayer() {
  const player = usePlayer();
  const dispatch = useAppDispatch();

  if (!player.currentTrack) return null;

  const progress = player.duration > 0 ? (player.progress / player.duration) * 100 : 0;

  return (
    <div
      className="lg:hidden fixed bottom-[120px] left-2 right-2 z-40 bg-[var(--raaga-elevated)] rounded-xl shadow-2xl overflow-hidden border border-[var(--raaga-border)]"
      onClick={() => dispatch(toggleNowPlaying())}
    >
      {/* Progress bar on top */}
      <div className="h-0.5 bg-[var(--raaga-border)]">
        <div
          className="h-full bg-[var(--raaga-accent)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-3 px-4 py-2.5">
        {/* Thumbnail */}
        <div className="w-10 h-10 rounded-lg bg-[var(--raaga-card)] overflow-hidden relative shrink-0">
          {player.currentTrack.thumbnail && (
            <Image
              src={player.currentTrack.thumbnail}
              alt={player.currentTrack.title}
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{player.currentTrack.title}</p>
          <p className="text-xs text-[var(--raaga-text3)] truncate">{player.currentTrack.artist}</p>
        </div>

        {/* Controls */}
        <button
          onClick={(e) => { e.stopPropagation(); player.togglePlay(); }}
          className="w-9 h-9 rounded-full bg-[var(--raaga-accent)] flex items-center justify-center text-black"
        >
          {player.isPlaying
            ? <Pause className="w-4 h-4 fill-black" />
            : <Play className="w-4 h-4 fill-black ml-0.5" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); player.next(); }}
          className="text-[var(--raaga-text3)]"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
