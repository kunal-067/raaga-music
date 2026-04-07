// src/store/middleware/localStorageMiddleware.ts
// Redux middleware that syncs selected state slices to localStorage
// Imports: @reduxjs/toolkit Middleware type, RootState type

import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../index';

const PERSIST_MAP = {
  'raaga:volume': (s: RootState) => s.player.volume,
  'raaga:muted': (s: RootState) => s.player.muted,
  'raaga:queue': (s: RootState) => s.player.queue,
  'raaga:currentTrack': (s: RootState) => s.player.currentTrack,
  'raaga:progress': (s: RootState) => s.player.progress,
  'raaga:shuffleMode': (s: RootState) => s.player.shuffleMode,
  'raaga:repeatMode': (s: RootState) => s.player.repeatMode,
  'raaga:theme': (s: RootState) => s.ui.theme,
  'raaga:sidebarWidth': (s: RootState) => s.ui.sidebarWidth,
  'raaga:recentSearches': (s: RootState) => s.user.recentSearches,
  'raaga:recentlyPlayed': (s: RootState) => s.user.recentlyPlayed,
  'raaga:likedSongIds': (s: RootState) => s.user.likedSongIds,
};

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  if (typeof window === 'undefined') return result;

  const state = store.getState() as RootState;
  try {
    for (const [key, selector] of Object.entries(PERSIST_MAP)) {
      localStorage.setItem(key, JSON.stringify(selector(state)));
    }
  } catch {
    // Ignore quota exceeded or private browsing errors
  }
  return result;
};

export function loadPersistedState(): Partial<RootState> {
  if (typeof window === 'undefined') return {};
  try {
    const get = (key: string) => {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : undefined;
    };

    return {
      player: {
        currentTrack: get('raaga:currentTrack') ?? null,
        isPlaying: false,
        queue: get('raaga:queue') ?? [],
        history: [],
        volume: get('raaga:volume') ?? 70,
        muted: get('raaga:muted') ?? false,
        progress: get('raaga:progress') ?? 0,
        duration: 0,
        shuffleMode: get('raaga:shuffleMode') ?? false,
        repeatMode: get('raaga:repeatMode') ?? 'off',
        buffering: false,
      },
      ui: {
        sidebarOpen: true,
        sidebarWidth: get('raaga:sidebarWidth') ?? 240,
        queueOpen: false,
        activeModal: null,
        theme: get('raaga:theme') ?? 'dark',
        nowPlayingExpanded: false,
      },
      user: {
        recentSearches: get('raaga:recentSearches') ?? [],
        recentlyPlayed: get('raaga:recentlyPlayed') ?? [],
        likedSongIds: get('raaga:likedSongIds') ?? [],
      },
    };
  } catch {
    return {};
  }
}
