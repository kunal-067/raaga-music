// src/store/api/recommendApi.ts
// RTK Query slice for home feed recommendations
// Imports: @reduxjs/toolkit/query/react, RecommendationSection and Track types

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RecommendationSection, Track } from '@/types';

export const recommendApi = createApi({
  reducerPath: 'recommendApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getHomeRecommendations: builder.query<RecommendationSection[], void>({
      query: () => '/recommendations?section=home',
    }),
    getRelatedTracks: builder.query<Track[], { videoId: string; limit?: number }>({
      query: ({ videoId, limit = 10 }) =>
        `/recommendations?videoId=${videoId}&limit=${limit}`,
    }),
  }),
});

export const { useGetHomeRecommendationsQuery, useGetRelatedTracksQuery } = recommendApi;
