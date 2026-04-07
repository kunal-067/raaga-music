// src/store/api/searchApi.ts
// RTK Query slice for YouTube search via server proxy
// Imports: @reduxjs/toolkit/query/react, SearchResponse type

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SearchResponse } from '@/types';

export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    searchTracks: builder.query<SearchResponse, { q: string; genre?: string; maxResults?: number }>({
      query: ({ q, genre, maxResults = 20 }) => {
        const params = new URLSearchParams({ q, maxResults: String(maxResults) });
        if (genre) params.set('genre', genre);
        return `/search?${params}`;
      },
    }),
  }),
});

export const { useSearchTracksQuery } = searchApi;
