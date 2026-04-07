// src/hooks/useKeyboard.ts
// Global keyboard shortcut handler for player controls
// Imports: react useEffect, usePlayer hook, ui actions

'use client';

import { useEffect } from 'react';
import { usePlayer } from './usePlayer';
import { useAppDispatch } from '@/store';
import { toggleQueue } from '@/store/slices/uiSlice';
import { toggleLike } from '@/store/slices/userSlice';

export function useKeyboard() {
  const player = usePlayer();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          player.togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (e.shiftKey) player.previous();
          else player.seekTo(Math.max(0, player.progress - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (e.shiftKey) player.next();
          else player.seekTo(Math.min(player.duration, player.progress + 10));
          break;
        default:
          break;
      }

      switch (e.key.toLowerCase()) {
        case 'm':
          player.toggleMute();
          break;
        case 'l':
          if (player.currentTrack) dispatch(toggleLike(player.currentTrack.youtubeId));
          break;
        case 'q':
          dispatch(toggleQueue());
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [player, dispatch]);
}
