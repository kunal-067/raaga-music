// src/components/search/SearchPageClient.tsx
// Full search page: debounced input, genre filter chips, results tabs, recent searches
// Imports: useState, useEffect, useSearchTracksQuery, TrackRow, GenreGrid, FilterChips

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { useSearchTracksQuery } from '@/store/api/searchApi';
import { useAppDispatch, useAppSelector } from '@/store';
import { addRecentSearch, removeRecentSearch, clearRecentSearches } from '@/store/slices/userSlice';
import { TrackRow } from '@/components/track/TrackRow';
import { TrackCard } from '@/components/track/TrackCard';
import { GenreGrid } from '@/components/recommendation/GenreGrid';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';

const GENRES = ['Bollywood', 'Indie', 'Sufi', 'Classical', 'Pop', 'Hip-Hop', 'Lo-fi', 'EDM', 'Folk', 'Rock'];
const TABS = ['Songs', 'Artists', 'Playlists'] as const;
type Tab = typeof TABS[number];

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="w-8 h-8 rounded skeleton-shimmer shrink-0" />
      <div className="w-10 h-10 rounded skeleton-shimmer shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 skeleton-shimmer rounded w-2/3" />
        <div className="h-3 skeleton-shimmer rounded w-1/3" />
      </div>
    </div>
  );
}

export function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [activeGenre, setActiveGenre] = useState<string | null>(searchParams.get('genre'));
  const [activeTab, setActiveTab] = useState<Tab>('Songs');

  const recentSearches = useAppSelector((s) => s.user.recentSearches);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim()) dispatch(addRecentSearch(query.trim()));
    }, 300);
    return () => clearTimeout(t);
  }, [query, dispatch]);

  const finalQuery = activeGenre
    ? debouncedQuery ? `${debouncedQuery} ${activeGenre}` : activeGenre
    : debouncedQuery;

  const { data, isLoading, isFetching } = useSearchTracksQuery(
    { q: finalQuery, genre: activeGenre || undefined, maxResults: 20 },
    { skip: !finalQuery.trim() }
  );

  const loading = isLoading || isFetching;

  const handleGenreSelect = useCallback((genre: string) => {
    setActiveGenre((g) => (g === genre ? null : genre));
    if (!query) setQuery(genre);
  }, [query]);

  const showResults = !!finalQuery.trim();

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--raaga-text3)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full bg-white dark:bg-white text-black rounded-3xl py-3 pl-12 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--raaga-accent)] placeholder:text-gray-500"
          autoFocus
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setDebouncedQuery(''); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => handleGenreSelect(g)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-all',
              activeGenre === g
                ? 'bg-[var(--raaga-text)] text-[var(--raaga-bg)] border-[var(--raaga-text)]'
                : 'border-[var(--raaga-border)] text-[var(--raaga-text2)] hover:border-[var(--raaga-text)] hover:text-[var(--raaga-text)]'
            )}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Recent searches (when no query) */}
      {/* {!showResults && recentSearches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-sora font-bold text-base">Recent searches</h3>
            <button onClick={() => dispatch(clearRecentSearches())} className="text-xs text-[var(--raaga-text3)] hover:text-[var(--raaga-text)]">
              Clear all
            </button>
          </div>
          <div className="space-y-1">
            {recentSearches.map((s: string) => (
              <div key={s} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--raaga-elevated)] group">
                <Clock className="w-4 h-4 text-[var(--raaga-text3)] shrink-0" />
                <button
                  className="flex-1 text-left text-sm"
                  onClick={() => setQuery(s)}
                >
                  {s}
                </button>
                <button
                  onClick={() => dispatch(removeRecentSearch(s))}
                  className="opacity-0 group-hover:opacity-100 text-[var(--raaga-text3)] hover:text-[var(--raaga-text)]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Browse genres (when no query) */}
      {!showResults && (
        <>
          <h2 className="font-sora text-xl font-bold mb-4">Browse all</h2>
          <GenreGrid onSelect={handleGenreSelect} />
        </>
      )}

      {/* Results */}
      {showResults && (
        <>
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-[var(--raaga-border)]">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors',
                  activeTab === tab
                    ? 'border-[var(--raaga-text)] text-[var(--raaga-text)]'
                    : 'border-transparent text-[var(--raaga-text3)] hover:text-[var(--raaga-text)]'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-1">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : !data?.tracks.length ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🔍</p>
              <p className="font-sora text-lg font-bold mb-2">No results for &ldquo;{debouncedQuery}&rdquo;</p>
              <p className="text-sm text-[var(--raaga-text3)]">Try different keywords or genres</p>
            </div>
          ) : activeTab === 'Songs' ? (
            <div>
              <p className="text-xs text-[var(--raaga-text3)] mb-3">{data.totalResults} results</p>
              {/* Table header */}
              <div className="grid grid-cols-[32px_1fr_minmax(120px,200px)_60px_36px] gap-3 px-3 py-2 border-b border-[var(--raaga-border)] text-xs font-semibold uppercase tracking-wider text-[var(--raaga-text3)] mb-2">
                <span>#</span><span>Title</span><span className="hidden md:block">Album</span><span>Duration</span><span />
              </div>
              {data.tracks.map((track, i) => (
                <TrackRow key={track.youtubeId} track={track} index={i} />
              ))}
            </div>
          ) : activeTab === 'Artists' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Deduplicate by artist */}
              {Array.from(new Map(data.tracks.map((t) => [t.artist, t])).values()).map((t) => (
                <div key={t.artist} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[var(--raaga-card)] hover:bg-[var(--raaga-highlight)] cursor-pointer transition-colors">
                  <div className="w-20 h-20 rounded-full bg-[var(--raaga-elevated)] overflow-hidden relative">
                    {t.thumbnail && <img src={t.thumbnail} alt={t.artist} className="w-full h-full object-cover" />}
                  </div>
                  <p className="text-sm font-semibold text-center truncate w-full">{t.artist}</p>
                  <p className="text-xs text-[var(--raaga-text3)]">Artist</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data.tracks.map((track) => (
                <TrackCard key={track.youtubeId} track={track} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
