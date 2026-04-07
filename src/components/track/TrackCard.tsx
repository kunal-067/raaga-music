// src/components/track/TrackCard.tsx
// Grid card for displaying a track with thumbnail, title, artist, and play overlay
// Imports: next/image, lucide-react, usePlayer hook, TrackContextMenu, Track type

'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { usePlayer } from '@/hooks/usePlayer';
import { useAppSelector } from '@/store';
import { TrackContextMenu } from './TrackContextMenu';
import { cn } from '@/lib/utils';
import type { Track } from '@/types';
import { useState } from 'react';

interface TrackCardProps {
  track: Track;
  className?: string;
}

export function TrackCard({ track, className }: TrackCardProps) {
  const player = usePlayer();
  const [ctxOpen, setCtxOpen] = useState(false);
  const [ctxPos, setCtxPos] = useState({ x: 0, y: 0 });
  const isPlaying = useAppSelector(
    (s) => s.player.currentTrack?.youtubeId === track.youtubeId && s.player.isPlaying
  );

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    setCtxPos({ x: e.clientX, y: e.clientY });
    setCtxOpen(true);
  }

  return (
    <>
      <div
        className={cn(
          'bg-[var(--raaga-card)] rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-[var(--raaga-highlight)] hover:scale-[1.02] hover:shadow-lg group',
          className
        )}
        onClick={() => player.play(track)}
        onContextMenu={handleContextMenu}
      >
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[var(--raaga-elevated)] mb-3">
          {track.thumbnail ? (
            <Image src={track.thumbnail} alt={track.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🎵</div>
          )}
          <div className={cn(
            'absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[var(--raaga-accent)] flex items-center justify-center shadow-lg transition-all duration-200',
            isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          )}>
            <Play className="w-4 h-4 text-black fill-black ml-0.5" />
          </div>
        </div>
        <p className="text-sm font-semibold truncate text-[var(--raaga-text)] mb-1">{track.title}</p>
        <p className="text-xs text-[var(--raaga-text3)] truncate">{track.artist}</p>
      </div>

      <TrackContextMenu
        track={track}
        open={ctxOpen}
        x={ctxPos.x}
        y={ctxPos.y}
        onClose={() => setCtxOpen(false)}
      />
    </>
  );
}
