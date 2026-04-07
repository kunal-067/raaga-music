// src/store/slices/userSlice.ts
// Redux slice for user preferences: liked songs, recent searches, recently played
// Imports: @reduxjs/toolkit, Track type

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Track, UserSliceState } from '@/types';

const initialState: UserSliceState = {
  recentSearches: [],
  recentlyPlayed: [],
  likedSongIds: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addRecentSearch(state, action: PayloadAction<string>) {
      state.recentSearches = [
        action.payload,
        ...state.recentSearches.filter((s) => s !== action.payload),
      ].slice(0, 10);
    },
    removeRecentSearch(state, action: PayloadAction<string>) {
      state.recentSearches = state.recentSearches.filter((s) => s !== action.payload);
    },
    clearRecentSearches(state) {
      state.recentSearches = [];
    },
    addRecentlyPlayed(state, action: PayloadAction<Track>) {
      state.recentlyPlayed = [
        action.payload,
        ...state.recentlyPlayed.filter((t) => t.youtubeId !== action.payload.youtubeId),
      ].slice(0, 20);
    },
    toggleLike(state, action: PayloadAction<string>) {
      const idx = state.likedSongIds.indexOf(action.payload);
      if (idx > -1) {
        state.likedSongIds.splice(idx, 1);
      } else {
        state.likedSongIds.push(action.payload);
      }
    },
    setLikedSongs(state, action: PayloadAction<string[]>) {
      state.likedSongIds = action.payload;
    },
  },
});

export const {
  addRecentSearch, removeRecentSearch, clearRecentSearches,
  addRecentlyPlayed, toggleLike, setLikedSongs,
} = userSlice.actions;

export default userSlice.reducer;
