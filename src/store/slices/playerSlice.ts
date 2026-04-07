// src/store/slices/playerSlice.ts
// Redux slice managing all music playback state
// Imports: @reduxjs/toolkit, Track and PlayerState types

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Track, PlayerState, RepeatMode } from '@/types';

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  queue: [],
  history: [],
  volume: 70,
  muted: false,
  progress: 0,
  duration: 0,
  shuffleMode: false,
  repeatMode: 'off',
  buffering: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playTrack(state, action: PayloadAction<Track>) {
      if (state.currentTrack && state.currentTrack.youtubeId !== action.payload.youtubeId) {
        state.history.push(state.currentTrack);
        if (state.history.length > 50) state.history.shift();
      }
      state.currentTrack = action.payload;
      state.isPlaying = true;
      state.progress = 0;
      state.buffering = true;
    },
    playPlaylist(state, action: PayloadAction<Track[]>) {
      if (!action.payload.length) return;
      const [first, ...rest] = action.payload;
      if (state.currentTrack) state.history.push(state.currentTrack);
      state.currentTrack = first;
      state.queue = rest;
      state.isPlaying = true;
      state.progress = 0;
      state.buffering = true;
    },
    togglePlay(state) {
      if (state.currentTrack) state.isPlaying = !state.isPlaying;
    },
    setPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    next(state) {
      if (!state.queue.length) {
        if (state.repeatMode === 'all' && state.history.length) {
          const next = state.history.shift()!;
          if (state.currentTrack) state.history.push(state.currentTrack);
          state.currentTrack = next;
        } else {
          state.isPlaying = false;
        }
        state.progress = 0;
        return;
      }
      if (state.currentTrack) state.history.push(state.currentTrack);
      state.currentTrack = state.queue.shift()!;
      state.isPlaying = true;
      state.progress = 0;
      state.buffering = true;
    },
    previous(state) {
      if (state.progress > 3) {
        state.progress = 0;
        return;
      }
      if (!state.history.length) {
        state.progress = 0;
        return;
      }
      if (state.currentTrack) state.queue.unshift(state.currentTrack);
      state.currentTrack = state.history.pop()!;
      state.isPlaying = true;
      state.progress = 0;
      state.buffering = true;
    },
    addToQueue(state, action: PayloadAction<Track>) {
      state.queue.push(action.payload);
    },
    addToQueueNext(state, action: PayloadAction<Track>) {
      state.queue.unshift(action.payload);
    },
    removeFromQueue(state, action: PayloadAction<number>) {
      state.queue.splice(action.payload, 1);
    },
    reorderQueue(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const [item] = state.queue.splice(from, 1);
      state.queue.splice(to, 0, item);
    },
    clearQueue(state) {
      state.queue = [];
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = Math.max(0, Math.min(100, action.payload));
      state.muted = false;
    },
    toggleMute(state) {
      state.muted = !state.muted;
    },
    seekTo(state, action: PayloadAction<number>) {
      state.progress = Math.max(0, Math.min(state.duration, action.payload));
    },
    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
    setBuffering(state, action: PayloadAction<boolean>) {
      state.buffering = action.payload;
    },
    toggleShuffle(state) {
      state.shuffleMode = !state.shuffleMode;
      if (state.shuffleMode) {
        for (let i = state.queue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [state.queue[i], state.queue[j]] = [state.queue[j], state.queue[i]];
        }
      }
    },
    cycleRepeat(state) {
      const modes: RepeatMode[] = ['off', 'all', 'one'];
      const idx = modes.indexOf(state.repeatMode);
      state.repeatMode = modes[(idx + 1) % modes.length];
    },
  },
});

export const {
  playTrack, playPlaylist, togglePlay, setPlaying, next, previous,
  addToQueue, addToQueueNext, removeFromQueue, reorderQueue, clearQueue,
  setVolume, toggleMute, seekTo, setProgress, setDuration,
  setBuffering, toggleShuffle, cycleRepeat,
} = playerSlice.actions;

export default playerSlice.reducer;
