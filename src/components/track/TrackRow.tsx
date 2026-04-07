// src/components/track/TrackRow.tsx
// List row for displaying a track in playlist detail and search results
// Imports: next/image, lucide-react, usePlayer, formatDuration, Track type

'use client';

import Image from 'next/image';
import { MoreHorizontal, Heart, Play } from 'lucide-react';
import { usePlayer } from '@/hooks/usePlayer';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleLike } from '@/store/slices/userSlice';
import { TrackContextMenu } from './TrackContextMenu';
import { formatDuration, cn } from '@/lib/utils';
import type { Track } from '@/types';
import { useState } from 'react';
import { toast } from 'sonner';

interface TrackRowProps {
  track: Track;
  index: number;
  showAlbum?: boolean;
  onRemove?: () => void;
}

export function TrackRow({ track, index, showAlbum = true, onRemove }: TrackRowProps) {
  const player = usePlayer();
  const dispatch = useAppDispatch();
  const [ctxOpen, setCtxOpen] = useState(false);
  const [ctxPos, setCtxPos] = useState({ x: 0, y: 0 });

  const isCurrentTrack = useAppSelector(
    (s) => s.player.currentTrack?.youtubeId === track.youtubeId
  );
  const isPlaying = useAppSelector(
    (s) => s.player.currentTrack?.youtubeId === track.youtubeId && s.player.isPlaying
  );
  const isLiked = useAppSelector((s) => s.user.likedSongIds.includes(track.youtubeId));

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    setCtxPos({ x: e.clientX, y: e.clientY });
    setCtxOpen(true);
  }

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch(toggleLike(track.youtubeId));
    toast(isLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs', { icon: isLiked ? '💔' : '💚' });
  }

  return (
    <>
      <div
        className={cn(
          'grid items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors group',
          showAlbum
            ? 'grid-cols-[32px_1fr_minmax(120px,200px)_60px_36px]'
            : 'grid-cols-[32px_1fr_60px_36px]',
          isCurrentTrack ? 'bg-white/5' : 'hover:bg-[var(--raaga-elevated)]'
        )}
        onClick={() => player.play(track)}
        onContextMenu={handleContextMenu}
      >
        {/* Index / equalizer */}
        <div className="flex items-center justify-center text-sm text-[var(--raaga-text3)]">
          {isCurrentTrack && isPlaying ? (
            <div className="equalizer">
              <div className="eq-bar" /><div className="eq-bar" /><div className="eq-bar" />
            </div>
          ) : (
            <span className={cn('group-hover:hidden', isCurrentTrack && 'text-[var(--raaga-accent)]')}>
              {index + 1}
            </span>
          )}
          <Play className={cn('w-3.5 h-3.5 fill-current hidden group-hover:block', isCurrentTrack && 'text-[var(--raaga-accent)]')} />
        </div>

        {/* Title + artist */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded bg-[var(--raaga-card)] overflow-hidden relative shrink-0">
            {track.thumbnail && <Image src={track.thumbnail} alt={track.title} fill className="object-cover" />}
          </div>
          <div className="min-w-0">
            <p className={cn('text-sm font-medium truncate', isCurrentTrack ? 'text-[var(--raaga-accent)]' : 'text-[var(--raaga-text)]')}>
              {track.title}
            </p>
            <p className="text-xs text-[var(--raaga-text3)] truncate">{track.artist}</p>
          </div>
        </div>

        {/* Album */}
        {showAlbum && (
          <p className="text-sm text-[var(--raaga-text3)] truncate hidden md:block">{track.album || '—'}</p>
        )}

        {/* Duration */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleLike}
            className={cn(
              'opacity-0 group-hover:opacity-100 transition-all',
              isLiked && 'opacity-100 text-[var(--raaga-accent)]'
            )}
          >
            <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
          </button>
          <span className="text-sm text-[var(--raaga-text3)]">
            {track.durationStr || formatDuration(track.duration || 0)}
          </span>
        </div>

        {/* More */}
        <button
          onClick={(e) => { e.stopPropagation(); setCtxPos({ x: e.clientX, y: e.clientY }); setCtxOpen(true); }}
          className="opacity-0 group-hover:opacity-100 text-[var(--raaga-text3)] hover:text-[var(--raaga-text)] transition-all flex items-center justify-center"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <TrackContextMenu
        track={track}
        open={ctxOpen}
        x={ctxPos.x}
        y={ctxPos.y}
        onClose={() => setCtxOpen(false)}
        onRemove={onRemove}
      />
    </>
  );
}
