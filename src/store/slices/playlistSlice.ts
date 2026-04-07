// ─────────────────────────────────────────────
//  store/slices/playlistSlice.ts
//  Manages ALL playlist state + sidebar UI state.
//  Persisted to localStorage via store middleware.
//  Imported by: Sidebar, usePlaylists hook,
//               CreatePlaylistModal, PlaylistDetail.
// ─────────────────────────────────────────────

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Playlist, Track, SidebarView, LibraryFilter, LibrarySort } from "../../types";

// ── Seed data shown on first load ─────────────
const SEED_PLAYLISTS: Playlist[] = [
  {
    id: "liked-songs",
    name: "Liked Songs",
    description: "Songs you have liked",
    coverEmoji: "💜",
    coverColor: "from-indigo-800 to-indigo-500",
    isPublic: false,
    isPinned: true,
    tracks: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// ── Slice state shape ─────────────────────────
interface PlaylistState {
  playlists: Playlist[];

  // Sidebar UI
  sidebarView: SidebarView;   // "collapsed" | "compact" | "expanded"
  sidebarWidth: number;        // px — only used when "expanded"
  libraryFilter: LibraryFilter;
  librarySort: LibrarySort;
  librarySearch: string;
  activePlaylistId: string | null;
}

export const initialState: PlaylistState = {
  playlists: SEED_PLAYLISTS,
  sidebarView: "expanded",
  sidebarWidth: 280,
  libraryFilter: "all",
  librarySort: "recent",
  librarySearch: "",
  activePlaylistId: null,
};

// ── Cover gradient palette ─────────────────────
export const COVER_GRADIENTS = [
  "from-rose-700 to-pink-500",
  "from-orange-700 to-amber-500",
  "from-green-800 to-emerald-500",
  "from-blue-800 to-cyan-500",
  "from-violet-800 to-purple-500",
  "from-red-800 to-rose-500",
  "from-teal-800 to-teal-500",
  "from-indigo-800 to-blue-400",
];

export const COVER_EMOJIS = [
  "🎵","🎶","🎸","🎹","🎺","🎻","🥁","🎤",
  "🌹","💖","🌙","✨","🔥","❄️","🌊","🎭",
  "🌸","🍂","☀️","🌈","💫","🎠","🏔️","🌺",
];

export const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    // ── CRUD ────────────────────────────────────
    createPlaylist(
      state,
      action: PayloadAction<{ name: string; description?: string; coverEmoji: string; coverColor: string }>
    ) {
      const { name, description, coverEmoji, coverColor } = action.payload;
      const now = Date.now();
      const newPlaylist: Playlist = {
        id: `pl-${now}-${Math.random().toString(36).slice(2, 7)}`,
        name: name.trim(),
        description: description?.trim(),
        coverEmoji,
        coverColor,
        isPublic: false,
        isPinned: false,
        tracks: [],
        createdAt: now,
        updatedAt: now,
      };
      state.playlists.unshift(newPlaylist);
      state.activePlaylistId = newPlaylist.id;
    },

    updatePlaylist(
      state,
      action: PayloadAction<{ id: string; name?: string; description?: string; coverEmoji?: string; coverColor?: string; isPublic?: boolean }>
    ) {
      const { id, ...changes } = action.payload;
      const pl = state.playlists.find((p) => p.id === id);
      if (!pl) return;
      if (changes.name        !== undefined) pl.name        = changes.name.trim();
      if (changes.description !== undefined) pl.description = changes.description?.trim();
      if (changes.coverEmoji  !== undefined) pl.coverEmoji  = changes.coverEmoji;
      if (changes.coverColor  !== undefined) pl.coverColor  = changes.coverColor;
      if (changes.isPublic    !== undefined) pl.isPublic    = changes.isPublic;
      pl.updatedAt = Date.now();
    },

    deletePlaylist(state, action: PayloadAction<string>) {
      // Cannot delete Liked Songs
      if (action.payload === "liked-songs") return;
      state.playlists = state.playlists.filter((p) => p.id !== action.payload);
      if (state.activePlaylistId === action.payload) {
        state.activePlaylistId = null;
      }
    },

    duplicatePlaylist(state, action: PayloadAction<string>) {
      const original = state.playlists.find((p) => p.id === action.payload);
      if (!original) return;
      const now = Date.now();
      state.playlists.unshift({
        ...original,
        id: `pl-${now}-copy`,
        name: `${original.name} (copy)`,
        isPinned: false,
        createdAt: now,
        updatedAt: now,
      });
    },

    togglePin(state, action: PayloadAction<string>) {
      const pl = state.playlists.find((p) => p.id === action.payload);
      if (pl) pl.isPinned = !pl.isPinned;
    },

    // ── Track management ─────────────────────────
    addTrack(state, action: PayloadAction<{ playlistId: string; track: Track }>) {
      const { playlistId, track } = action.payload;
      const pl = state.playlists.find((p) => p.id === playlistId);
      if (!pl) return;
      if (pl.tracks.some((t) => t.id === track.id)) return; // no duplicates
      pl.tracks.push(track);
      pl.updatedAt = Date.now();
    },

    removeTrack(state, action: PayloadAction<{ playlistId: string; trackId: string }>) {
      const { playlistId, trackId } = action.payload;
      const pl = state.playlists.find((p) => p.id === playlistId);
      if (!pl) return;
      pl.tracks = pl.tracks.filter((t) => t.id !== trackId);
      pl.updatedAt = Date.now();
    },

    // ── Like / unlike → syncs with "Liked Songs" playlist ─
    toggleLikedTrack(state, action: PayloadAction<Track>) {
      const liked = state.playlists.find((p) => p.id === "liked-songs");
      if (!liked) return;
      const exists = liked.tracks.some((t) => t.id === action.payload.id);
      if (exists) {
        liked.tracks = liked.tracks.filter((t) => t.id !== action.payload.id);
      } else {
        liked.tracks.unshift(action.payload);
      }
      liked.updatedAt = Date.now();
    },

    // ── Sidebar UI ───────────────────────────────
    setSidebarView(state, action: PayloadAction<SidebarView>) {
      state.sidebarView = action.payload;
    },

    setSidebarWidth(state, action: PayloadAction<number>) {
      // Clamp between 180px and 480px
      state.sidebarWidth = Math.max(180, Math.min(480, action.payload));
    },

    setLibraryFilter(state, action: PayloadAction<LibraryFilter>) {
      state.libraryFilter = action.payload;
    },

    setLibrarySort(state, action: PayloadAction<LibrarySort>) {
      state.librarySort = action.payload;
    },

    setLibrarySearch(state, action: PayloadAction<string>) {
      state.librarySearch = action.payload;
    },

    setActivePlaylist(state, action: PayloadAction<string | null>) {
      state.activePlaylistId = action.payload;
    },
  },
});

export const {
  createPlaylist, updatePlaylist, deletePlaylist, duplicatePlaylist, togglePin,
  addTrack, removeTrack, toggleLikedTrack,
  setSidebarView, setSidebarWidth, setLibraryFilter, setLibrarySort,
  setLibrarySearch, setActivePlaylist,
} = playlistSlice.actions;

export default playlistSlice.reducer;
