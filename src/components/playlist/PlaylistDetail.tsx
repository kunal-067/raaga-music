// src/components/playlist/PlaylistDetail.tsx
// Full playlist page with hero, controls, and draggable track list
// Imports: useGetPlaylistQuery, useRemoveTrackMutation, TrackRow, DnD kit, usePlayer

'use client';

import Image from 'next/image';
import { Play, Shuffle, Heart, MoreHorizontal, Trash2 } from 'lucide-react';
import { useGetPlaylistQuery, useRemoveTrackMutation } from '@/store/api/playlistApi';
import { usePlayer } from '@/hooks/usePlayer';
import { useAppDispatch } from '@/store';
import { openModal } from '@/store/slices/uiSlice';
import { TrackRow } from '@/components/track/TrackRow';
import { formatDuration } from '@/lib/utils';
import { toast } from 'sonner';
import type { Track } from '@/types';

// Mock tracks for demo (replace with real cached track fetch in prod)
const DEMO_TRACKS: Track[] = [
  { youtubeId: 'BddP6PYo2gs', title: 'Tum Hi Ho', artist: 'Arijit Singh', thumbnail: 'https://i.ytimg.com/vi/BddP6PYo2gs/mqdefault.jpg', duration: 262, durationStr: '4:22', album: 'Aashiqui 2' },
  { youtubeId: 'Umqb9KENgmk', title: 'Ik Vaari Aa', artist: 'Arijit Singh', thumbnail: 'https://i.ytimg.com/vi/Umqb9KENgmk/mqdefault.jpg', duration: 251, durationStr: '4:11', album: 'Raabta' },
  { youtubeId: 'YQHsXMglC9A', title: 'Channa Mereya', artist: 'Arijit Singh', thumbnail: 'https://i.ytimg.com/vi/YQHsXMglC9A/mqdefault.jpg', duration: 289, durationStr: '4:49', album: 'Ae Dil Hai Mushkil' },
  { youtubeId: 'sRXu7DA3N0U', title: 'Raabta', artist: 'Arijit Singh', thumbnail: 'https://i.ytimg.com/vi/sRXu7DA3N0U/mqdefault.jpg', duration: 255, durationStr: '4:15', album: 'Agent Sai' },
];

interface PlaylistDetailProps {
  playlistId: string;
}

export function PlaylistDetail({ playlistId }: PlaylistDetailProps) {
  const player = usePlayer();
  const dispatch = useAppDispatch();
  const { data: playlist, isLoading } = useGetPlaylistQuery(playlistId);
  const [removeTrack] = useRemoveTrackMutation();

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex gap-6 p-8 pb-6">
          <div className="w-52 h-52 rounded-lg bg-[var(--raaga-elevated)] shrink-0" />
          <div className="flex-1 space-y-4 pt-4">
            <div className="h-3 w-16 bg-[var(--raaga-elevated)] rounded" />
            <div className="h-12 w-3/4 bg-[var(--raaga-elevated)] rounded" />
            <div className="h-4 w-1/2 bg-[var(--raaga-elevated)] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[var(--raaga-text3)]">
        <p className="text-5xl mb-4">🎵</p>
        <p className="text-lg font-semibold">Playlist not found</p>
      </div>
    );
  }

  // For demo, use DEMO_TRACKS filtered by trackIds or fall back to all
  const tracks = playlist.tracks ?? DEMO_TRACKS;
  const totalSecs = tracks.reduce((a, t) => a + (t.duration || 0), 0);
  const totalDur = totalSecs > 3600
    ? `${Math.floor(totalSecs / 3600)} hr ${Math.floor((totalSecs % 3600) / 60)} min`
    : `${Math.floor(totalSecs / 60)} min`;

  const heroGradients: Record<string, string> = {
    liked: '#1a3a2a', default: '#1a2050',
  };
  const gradientColor = heroGradients[playlistId] || heroGradients.default;

  return (
    <div>
      {/* Hero */}
      <div
        className="flex flex-col sm:flex-row gap-6 px-6 pb-6 pt-4"
        style={{ background: `linear-gradient(to bottom, ${gradientColor}88, transparent)` }}
      >
        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-xl bg-[var(--raaga-elevated)] flex items-center justify-center text-7xl shrink-0 shadow-2xl">
          {playlist.coverEmoji}
        </div>
        <div className="flex flex-col justify-end min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--raaga-text2)] mb-2">Playlist</p>
          <h1 className="font-sora text-3xl sm:text-5xl font-black mb-3 leading-tight">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-sm text-[var(--raaga-text3)] mb-2">{playlist.description}</p>
          )}
          <p className="text-sm text-[var(--raaga-text2)]">
            <strong className="text-[var(--raaga-text)]">You</strong> · {tracks.length} songs
            {totalSecs > 0 && `, about ${totalDur}`}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 px-6 py-4">
        <button
          onClick={() => player.playList(tracks)}
          className="w-14 h-14 rounded-full bg-[var(--raaga-accent)] flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
        >
          <Play className="w-6 h-6 text-black fill-black ml-0.5" />
        </button>
        <button
          onClick={() => { player.toggleShuffle(); player.playList([...tracks].sort(() => Math.random() - 0.5)); }}
          className="text-[var(--raaga-text3)] hover:text-[var(--raaga-text)] transition-colors"
          title="Shuffle play"
        >
          <Shuffle className="w-6 h-6" />
        </button>
        <button className="text-[var(--raaga-text3)] hover:text-[var(--raaga-text)] transition-colors">
          <Heart className="w-6 h-6" />
        </button>
        <button
          onClick={() => dispatch(openModal('edit-playlist'))}
          className="text-[var(--raaga-text3)] hover:text-[var(--raaga-text)] transition-colors"
        >
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Track list */}
      <div className="px-6 pb-8">
        {/* Header */}
        <div className="grid grid-cols-[32px_1fr_minmax(120px,200px)_60px_36px] gap-3 px-3 py-2 border-b border-[var(--raaga-border)] text-xs font-semibold uppercase tracking-wider text-[var(--raaga-text3)] mb-2">
          <span>#</span>
          <span>Title</span>
          <span className="hidden md:block">Album</span>
          <span className="text-right">Duration</span>
          <span />
        </div>

        {tracks.length === 0 ? (
          <div className="text-center py-16 text-[var(--raaga-text3)]">
            <p className="text-4xl mb-3">🎵</p>
            <p className="font-semibold mb-1">No tracks yet</p>
            <p className="text-sm">Search for songs and add them to this playlist</p>
          </div>
        ) : (
          tracks.map((track, i) => (
            <TrackRow
              key={track.youtubeId + i}
              track={track}
              index={i}
              showAlbum
              onRemove={async () => {
                try {
                  await removeTrack({ id: playlistId, youtubeId: track.youtubeId }).unwrap();
                  toast('Removed from playlist');
                } catch {
                  toast.error('Failed to remove track');
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
