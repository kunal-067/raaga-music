// src/types/index.ts
// Central type definitions for the entire Raaga app
// Imports: used across models, slices, components, and API routes

export interface Track {
  youtubeId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: number; // seconds
  durationStr?: string; // "3:45"
  genre?: string;
  album?: string;
  cachedAt?: string;
}

export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  coverEmoji: string;
  coverImage?: string;
  ownerId: string;
  isPublic: boolean;
  trackIds: string[];
  tracks?: Track[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  provider: 'google' | 'github' | 'credentials';
  likedSongIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ListeningHistory {
  _id: string;
  userId: string;
  youtubeId: string;
  playedAt: string;
  genre?: string;
}

// Player state types
export type RepeatMode = 'off' | 'one' | 'all';

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  history: Track[];
  volume: number;
  muted: boolean;
  progress: number;
  duration: number;
  shuffleMode: boolean;
  repeatMode: RepeatMode;
  buffering: boolean;
}

// UI state types
export type ModalName =
  | 'create-playlist'
  | 'edit-playlist'
  | 'add-to-playlist'
  | 'delete-playlist'
  | 'auth'
  | null;

export interface UIState {
  sidebarOpen: boolean;
  sidebarWidth: number;
  queueOpen: boolean;
  activeModal: ModalName;
  theme: 'light' | 'dark' | 'system';
  nowPlayingExpanded: boolean;
}

// User slice state
export interface UserSliceState {
  recentSearches: string[];
  recentlyPlayed: Track[];
  likedSongIds: string[];
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchResponse {
  tracks: Track[];
  totalResults: number;
  query: string;
}

export interface RecommendationSection {
  id: string;
  title: string;
  tracks: Track[];
}

// YouTube API types
export interface YouTubeSearchResult {
  kind: string;
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: { url: string };
      high: { url: string };
    };
    publishedAt: string;
  };
}

export interface YouTubeVideoDetails {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: { medium: { url: string } };
  };
  contentDetails: { duration: string }; // ISO 8601
}

// Form types
export interface CreatePlaylistForm {
  name: string;
  description?: string;
  coverEmoji: string;
  isPublic: boolean;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Genre config type
export interface GenreConfig {
  name: string;
  color: string;
  emoji: string;
  searchQuery: string;
}

// Context menu track target
export interface ContextMenuState {
  track: Track | null;
  x: number;
  y: number;
  open: boolean;
}



// ── Sidebar ────────────────────────────────────
export type SidebarView   = "collapsed" | "compact" | "expanded";
export type LibraryFilter = "all" | "playlists" | "liked";
export type LibrarySort   = "recent" | "alphabetical" | "creator";
