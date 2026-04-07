// src/components/track/TrackContextMenu.tsx
// Right-click context menu for track actions: queue, like, playlist, share
// Imports: useEffect for click-outside, usePlayer, useAppDispatch, lucide-react icons

'use client';

import { useEffect, useRef } from 'react';
import {
  PlayCircle, ListEnd, ListStart, PlusCircle, Heart, Link2, Share2, Trash2,
} from 'lucide-react';
import { usePlayer } from '@/hooks/usePlayer';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleLike } from '@/store/slices/userSlice';
import { openModal } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Track } from '@/types';

interface TrackContextMenuProps {
  track: Track;
  open: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onRemove?: () => void;
}

export function TrackContextMenu({ track, open, x, y, onClose, onRemove }: TrackContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const player = usePlayer();
  const dispatch = useAppDispatch();
  const isLiked = useAppSelector((s) => s.user.likedSongIds.includes(track.youtubeId));

  // Store pending track for AddToPlaylistModal
  useEffect(() => {
    if (open) {
      (window as Window & { __pendingTrack?: Track }).__pendingTrack = track;
    }
  }, [open, track]);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    setTimeout(() => document.addEventListener('mousedown', handle), 0);
    return () => document.removeEventListener('mousedown', handle);
  }, [open, onClose]);

  if (!open) return null;

  // Clamp position to viewport
  const menuW = 210;
  const menuH = 280;
  const left = Math.min(x, window.innerWidth - menuW - 8);
  const top = Math.min(y, window.innerHeight - menuH - 8);

  function item(icon: React.ReactNode, label: string, onClick: () => void, danger = false) {
    return (
      <button
        onClick={() => { onClick(); onClose(); }}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left',
          danger
            ? 'text-red-400 hover:bg-red-500/10'
            : 'text-[var(--raaga-text2)] hover:bg-[var(--raaga-elevated)] hover:text-[var(--raaga-text)]'
        )}
      >
        {icon}
        {label}
      </button>
    );
  }

  return (
    <div
      ref={ref}
      className="fixed z-[200] bg-[#282828] border border-[var(--raaga-border)] rounded-lg py-1.5 shadow-2xl w-52"
      style={{ left, top }}
    >
      {item(<PlayCircle className="w-4 h-4 shrink-0" />, 'Play now', () => player.play(track))}
      {item(<ListStart className="w-4 h-4 shrink-0" />, 'Play next', () => {
        player.addToQueueNext(track);
        toast('Playing next');
      })}
      {item(<ListEnd className="w-4 h-4 shrink-0" />, 'Add to queue', () => {
        player.addToQueue(track);
        toast('Added to queue');
      })}

      <div className="h-px bg-[var(--raaga-border)] my-1" />

      {item(
        <Heart className={cn('w-4 h-4 shrink-0', isLiked && 'fill-current text-[var(--raaga-accent)]')} />,
        isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs',
        () => {
          dispatch(toggleLike(track.youtubeId));
          toast(isLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs', { icon: isLiked ? '💔' : '💚' });
        }
      )}
      {item(<PlusCircle className="w-4 h-4 shrink-0" />, 'Add to playlist', () => {
        (window as Window & { __pendingTrack?: Track }).__pendingTrack = track;
        dispatch(openModal('add-to-playlist'));
      })}

      <div className="h-px bg-[var(--raaga-border)] my-1" />

      {item(<Link2 className="w-4 h-4 shrink-0" />, 'Copy link', () => {
        navigator.clipboard
          .writeText(`https://youtube.com/watch?v=${track.youtubeId}`)
          .then(() => toast('Link copied!', { icon: '📋' }))
          .catch(() => toast.error('Could not copy link'));
      })}
      {item(<Share2 className="w-4 h-4 shrink-0" />, 'Share', () => {
        const url = `https://youtube.com/watch?v=${track.youtubeId}`;
        if (navigator.share) {
          navigator.share({ title: track.title, url }).catch(() => null);
        } else {
          navigator.clipboard.writeText(url).then(() => toast('Link copied!', { icon: '📋' }));
        }
      })}

      {onRemove && (
        <>
          <div className="h-px bg-[var(--raaga-border)] my-1" />
          {item(<Trash2 className="w-4 h-4 shrink-0" />, 'Remove from playlist', onRemove, true)}
        </>
      )}
    </div>
  );
}
