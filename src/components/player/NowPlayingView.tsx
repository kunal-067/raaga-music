// src/components/player/NowPlayingView.tsx
// Full-screen now playing view for mobile — shows large artwork and full controls
// Imports: framer-motion, lucide-react, usePlayer, useAppDispatch, useAppSelector

'use client';

import Image from 'next/image';
import { ChevronDown, Heart, MoreHorizontal, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Repeat1, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '@/hooks/usePlayer';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleNowPlaying } from '@/store/slices/uiSlice';
import { toggleLike } from '@/store/slices/userSlice';
import { formatDuration, cn } from '@/lib/utils';
import { useYouTube } from '@/hooks/useYouTube';
import { toast } from 'sonner';

export function NowPlayingView() {
  const dispatch = useAppDispatch();
  const player = usePlayer();
  const { handleSeek } = useYouTube();
  const nowPlayingExpanded = useAppSelector((s) => s.ui.nowPlayingExpanded);
  const isLiked = useAppSelector(
    (s) => player.currentTrack ? s.user.likedSongIds.includes(player.currentTrack.youtubeId) : false
  );

  const progress = player.duration > 0 ? (player.progress / player.duration) * 100 : 0;

  function handleSeekClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    handleSeek(Math.floor(pct * player.duration));
  }

  function handleLike() {
    if (!player.currentTrack) return;
    dispatch(toggleLike(player.currentTrack.youtubeId));
    toast(isLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs', { icon: isLiked ? '💔' : '💚' });
  }

  return (
    <AnimatePresence>
      {nowPlayingExpanded && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[200] bg-gradient-to-b from-[#1a0a2e] to-[var(--raaga-bg)] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-12 pb-4">
            <button onClick={() => dispatch(toggleNowPlaying())} className="text-[var(--raaga-text3)]">
              <ChevronDown className="w-7 h-7" />
            </button>
            <p className="text-sm font-semibold">Now Playing</p>
            <button className="text-[var(--raaga-text3)]">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>

          {/* Artwork */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
            <motion.div
              key={player.currentTrack?.youtubeId}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm aspect-square rounded-2xl bg-[var(--raaga-elevated)] overflow-hidden shadow-2xl"
            >
              {player.currentTrack?.thumbnail && (
                <Image
                  src={player.currentTrack.thumbnail}
                  alt={player.currentTrack.title || ''}
                  fill
                  className="object-cover"
                />
              )}
            </motion.div>

            {/* Track info + like */}
            <div className="w-full flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-4">
                <p className="font-sora text-2xl font-bold truncate">
                  {player.currentTrack?.title ?? 'No track'}
                </p>
                <p className="text-[var(--raaga-text3)] truncate mt-1">
                  {player.currentTrack?.artist ?? '—'}
                </p>
              </div>
              <button onClick={handleLike} className={cn('shrink-0', isLiked ? 'text-[var(--raaga-accent)]' : 'text-[var(--raaga-text3)]')}>
                <Heart className={cn('w-7 h-7', isLiked && 'fill-current')} />
              </button>
            </div>

            {/* Seek bar */}
            <div className="w-full space-y-2">
              <div
                className="w-full h-1.5 bg-[var(--raaga-border)] rounded-full cursor-pointer group"
                onClick={handleSeekClick}
              >
                <div
                  className="h-full bg-[var(--raaga-text)] group-hover:bg-[var(--raaga-accent)] rounded-full relative transition-colors"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md" />
                </div>
              </div>
              <div className="flex justify-between text-xs text-[var(--raaga-text3)]">
                <span>{formatDuration(player.progress)}</span>
                <span>{formatDuration(player.duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="w-full flex items-center justify-between">
              <button onClick={player.toggleShuffle} className={cn(player.shuffleMode ? 'text-[var(--raaga-accent)]' : 'text-[var(--raaga-text3)]')}>
                <Shuffle className="w-6 h-6" />
              </button>
              <button onClick={player.previous} className="text-[var(--raaga-text)]">
                <SkipBack className="w-8 h-8" />
              </button>
              <button
                onClick={player.togglePlay}
                className="w-16 h-16 rounded-full bg-[var(--raaga-text)] text-[var(--raaga-bg)] flex items-center justify-center shadow-lg"
              >
                {player.isPlaying
                  ? <Pause className="w-7 h-7 fill-current" />
                  : <Play className="w-7 h-7 fill-current ml-1" />}
              </button>
              <button onClick={player.next} className="text-[var(--raaga-text)]">
                <SkipForward className="w-8 h-8" />
              </button>
              <button onClick={player.cycleRepeat} className={cn(player.repeatMode !== 'off' ? 'text-[var(--raaga-accent)]' : 'text-[var(--raaga-text3)]')}>
                {player.repeatMode === 'one' ? <Repeat1 className="w-6 h-6" /> : <Repeat className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className="h-16" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
