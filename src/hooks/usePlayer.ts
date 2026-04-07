// src/hooks/usePlayer.ts
// Custom hook exposing player state and actions to components
// Imports: useAppDispatch, useAppSelector, all playerSlice actions

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  playTrack, playPlaylist, togglePlay, next, previous,
  addToQueue, addToQueueNext, removeFromQueue, reorderQueue,
  clearQueue, setVolume, toggleMute, seekTo, setProgress,
  setDuration, setBuffering, toggleShuffle, cycleRepeat,
} from '@/store/slices/playerSlice';
import { addRecentlyPlayed } from '@/store/slices/userSlice';
import type { Track } from '@/types';

export function usePlayer() {
  const dispatch = useAppDispatch();
  const player = useAppSelector((s) => s.player);

  const play = useCallback(
    (track: Track) => {
      dispatch(playTrack(track));
      dispatch(addRecentlyPlayed(track));
    },
    [dispatch]
  );

  const playList = useCallback(
    (tracks: Track[]) => {
      dispatch(playPlaylist(tracks));
      if (tracks[0]) dispatch(addRecentlyPlayed(tracks[0]));
    },
    [dispatch]
  );

  return {
    ...player,
    play,
    playList,
    togglePlay: () => dispatch(togglePlay()),
    next: () => dispatch(next()),
    previous: () => dispatch(previous()),
    addToQueue: (t: Track) => dispatch(addToQueue(t)),
    addToQueueNext: (t: Track) => dispatch(addToQueueNext(t)),
    removeFromQueue: (i: number) => dispatch(removeFromQueue(i)),
    reorderQueue: (from: number, to: number) => dispatch(reorderQueue({ from, to })),
    clearQueue: () => dispatch(clearQueue()),
    setVolume: (v: number) => dispatch(setVolume(v)),
    toggleMute: () => dispatch(toggleMute()),
    seekTo: (s: number) => dispatch(seekTo(s)),
    setProgress: (s: number) => dispatch(setProgress(s)),
    setDuration: (s: number) => dispatch(setDuration(s)),
    setBuffering: (b: boolean) => dispatch(setBuffering(b)),
    toggleShuffle: () => dispatch(toggleShuffle()),
    cycleRepeat: () => dispatch(cycleRepeat()),
  };
}
