// src/components/player/PlayerBar.tsx
// Fixed bottom player bar with track info, controls, seek bar, and volume
// Imports: usePlayer hook, useAppSelector/Dispatch, lucide-react icons, formatDuration

'use client';

import Image from 'next/image';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
  Volume2, VolumeX, Heart, ListMusic, Maximize2,
} from 'lucide-react';
import { usePlayer } from '@/hooks/usePlayer';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleLike } from '@/store/slices/userSlice';
import { toggleQueue, toggleNowPlaying } from '@/store/slices/uiSlice';
import { formatDuration, cn } from '@/lib/utils';
import { useYouTube } from '@/hooks/useYouTube';
import { toast } from 'sonner';
import { YouTubePlayer } from './YouTubePlayer';

export function PlayerBar() {
  const dispatch = useAppDispatch();
  const player = usePlayer();
  const { handleSeek } = useYouTube();
  const likedIds = useAppSelector((s) => s.user.likedSongIds);
  const queueOpen = useAppSelector((s) => s.ui.queueOpen);

  const isLiked = player.currentTrack ? likedIds.includes(player.currentTrack.youtubeId) : false;
  const progress = player.duration > 0 ? (player.progress / player.duration) * 100 : 0;

  function handleSeekClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!player.currentTrack) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const secs = Math.floor(pct * player.duration);
    handleSeek(secs);
  }

  function handleVolumeClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    player.setVolume(Math.round(pct * 100));
  }

  function handleLike() {
    if (!player.currentTrack) return;
    dispatch(toggleLike(player.currentTrack.youtubeId));
    toast(isLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs', {
      icon: isLiked ? '💔' : '💚',
    });
  }

  return (
    <div
      className="fixed max-lg:bottom-14 bottom-0 left-0 right-0 z-50 h-20 bg-[var(--raaga-elevated)] border-t border-[var(--raaga-border)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="h-full grid grid-cols-3 items-center px-4 gap-4">
        {/* LEFT: Track info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-14 h-14 rounded-md bg-[var(--raaga-card)] overflow-hidden shrink-0 relative">
            {player.currentTrack?.thumbnail && (
              <Image
                src={player.currentTrack.thumbnail}
                alt={player.currentTrack.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate text-[var(--raaga-text)]">
              {player.currentTrack?.title ?? 'No track selected'}
            </p>
            <p className="text-xs text-[var(--raaga-text3)] truncate">
              {player.currentTrack?.artist ?? '—'}
            </p>
          </div>
          <button
            onClick={handleLike}
            className={cn('shrink-0 p-1 transition-colors', isLiked ? 'text-[var(--raaga-accent)]' : 'text-[var(--raaga-text3)] hover:text-[var(--raaga-text)]')}
          >
            <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
          </button>
        </div>

        {/* CENTER: Controls + seek */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-5">
            <button
              onClick={player.toggleShuffle}
              className={cn('transition-colors', player.shuffleMode ? 'text-[var(--raaga-accent)]' : 'text-[var(--raaga-text3)] hover:text-[var(--raaga-text)]')}
              title="Shuffle (S)"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={player.previous}
              className="text-[var(--raaga-text3)] hover:text-[var(--raaga-text)] transition-colors"
              title="Previous (Shift+←)"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={player.togglePlay}
              className="w-9 h-9 rounded-full bg-[var(--raaga-text)] text-[var(--raaga-bg)] flex items-center justify-center hover:scale-105 transition-transform"
              title="Play/Pause (Space)"
            >
              {player.isPlaying
                ? <Pause className="w-4 h-4 fill-current" />
                : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button
              onClick={player.next}
              className="text-[var(--raaga-text3)] hover:text-[var(--raaga-text)] transition-colors"
              title="Next (Shift+→)"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              onClick={player.cycleRepeat}
              className={cn('transition-colors', player.repeatMode !== 'off' ? 'text-[var(--raaga-accent)]' : 'text-[var(--raaga-text3)] hover:text-[var(--raaga-text)]')}
              title={`Repeat: ${player.repeatMode}`}
            >
              {player.repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Seek bar */}
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-[10px] text-[var(--raaga-text3)] w-8 text-right">
              {formatDuration(player.progress)}
            </span>
            <div
              className="group flex-1 h-1 bg-[var(--raaga-border)] rounded-full cursor-pointer relative"
              onClick={handleSeekClick}
            >
              <div
                className="h-full bg-[var(--raaga-text)] group-hover:bg-[var(--raaga-accent)] rounded-full relative transition-colors"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
              </div>
            </div>
            <span className="text-[10px] text-[var(--raaga-text3)] w-8">
              {formatDuration(player.duration)}
            </span>
          </div>
        </div>

        {/* RIGHT: Queue + Volume */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => dispatch(toggleNowPlaying())}
            className="hidden sm:flex text-[var(--raaga-text3)] hover:text-[var(--raaga-text)] transition-colors"
            title="Expand"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => dispatch(toggleQueue())}
            className={cn('transition-colors', queueOpen ? 'text-[var(--raaga-accent)]' : 'text-[var(--raaga-text3)] hover:text-[var(--raaga-text)]')}
            title="Queue (Q)"
          >
            <ListMusic className="w-4 h-4" />
          </button>
          <button
            onClick={player.toggleMute}
            className="text-[var(--raaga-text3)] hover:text-[var(--raaga-text)] transition-colors"
            title="Mute (M)"
          >
            {player.muted || player.volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div
            className="group w-20 h-1 bg-[var(--raaga-border)] rounded-full cursor-pointer relative hidden sm:block"
            onClick={handleVolumeClick}
          >
            <div
              className="h-full bg-[var(--raaga-text)] group-hover:bg-[var(--raaga-accent)] rounded-full transition-colors"
              style={{ width: `${player.muted ? 0 : player.volume}%` }}
            />
          </div>
        </div>
      </div>

       {/* Hidden YouTube IFrame player */}
        {/* <YouTubePlayer /> */}

    </div>
  );
}
