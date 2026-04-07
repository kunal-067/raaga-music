// src/store/api/playlistApi.ts
// RTK Query slice for all playlist CRUD operations
// Imports: @reduxjs/toolkit/query/react, Playlist and Track types

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Playlist, Track } from '@/types';

export const playlistApi = createApi({
  reducerPath: 'playlistApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Playlist'],
  endpoints: (builder) => ({
    getPlaylists: builder.query<Playlist[], void>({
      query: () => '/playlists',
      providesTags: ['Playlist'],
    }),
    getPlaylist: builder.query<Playlist, string>({
      query: (id) => `/playlists/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Playlist', id }],
    }),
    createPlaylist: builder.mutation<Playlist, Partial<Playlist>>({
      query: (body) => ({ url: '/playlists', method: 'POST', body }),
      invalidatesTags: ['Playlist'],
    }),
    updatePlaylist: builder.mutation<Playlist, { id: string; data: Partial<Playlist> }>({
      query: ({ id, data }) => ({ url: `/playlists/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Playlist', id }, 'Playlist'],
    }),
    deletePlaylist: builder.mutation<void, string>({
      query: (id) => ({ url: `/playlists/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Playlist'],
    }),
    addTrack: builder.mutation<Playlist, { id: string; track: Track }>({
      query: ({ id, track }) => ({ url: `/playlists/${id}/tracks`, method: 'POST', body: track }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Playlist', id }],
    }),
    removeTrack: builder.mutation<Playlist, { id: string; youtubeId: string }>({
      query: ({ id, youtubeId }) => ({ url: `/playlists/${id}/tracks/${youtubeId}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Playlist', id }],
    }),
    reorderTracks: builder.mutation<Playlist, { id: string; trackIds: string[] }>({
      query: ({ id, trackIds }) => ({
        url: `/playlists/${id}/tracks/reorder`,
        method: 'PUT',
        body: { trackIds },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Playlist', id }],
    }),
  }),
});

export const {
  useGetPlaylistsQuery,
  useGetPlaylistQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useAddTrackMutation,
  useRemoveTrackMutation,
  useReorderTracksMutation,
} = playlistApi;
