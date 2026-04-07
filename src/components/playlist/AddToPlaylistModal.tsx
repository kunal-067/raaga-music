// src/components/playlist/AddToPlaylistModal.tsx
// Modal for adding a track to an existing playlist from context menu
// Imports: useAppSelector/Dispatch, useGetPlaylistsQuery, useAddTrackMutation, Track type

'use client';

import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeModal } from '@/store/slices/uiSlice';
import { useGetPlaylistsQuery, useAddTrackMutation } from '@/store/api/playlistApi';
import { toast } from 'sonner';
import type { Track } from '@/types';

export function AddToPlaylistModal() {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((s) => s.ui.activeModal);
  const { data: playlists = [] } = useGetPlaylistsQuery();
  const [addTrack] = useAddTrackMutation();

  if (activeModal !== 'add-to-playlist') return null;

  const track = (window as Window & { __pendingTrack?: Track }).__pendingTrack;

  async function handleAdd(playlistId: string, playlistName: string) {
    if (!track) return;
    try {
      await addTrack({ id: playlistId, track }).unwrap();
      toast.success(`Added to ${playlistName}`, { icon: '✅' });
      dispatch(closeModal());
    } catch {
      toast.error('Failed to add track');
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => dispatch(closeModal())}
    >
      <div
        className="w-full max-w-sm bg-[#282828] rounded-2xl p-6 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-sora text-xl font-bold">Add to playlist</h2>
          <button onClick={() => dispatch(closeModal())} className="text-[var(--raaga-text3)] hover:text-[var(--raaga-text)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {track && (
          <p className="text-sm text-[var(--raaga-text3)] mb-4 truncate">
            Adding: <span className="text-[var(--raaga-text)] font-medium">{track.title}</span>
          </p>
        )}

        <div className="space-y-1 max-h-72 overflow-y-auto">
          {playlists.filter((p) => p._id !== 'liked').map((pl) => (
            <button
              key={pl._id}
              onClick={() => handleAdd(pl._id, pl.name)}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-[var(--raaga-elevated)] transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-md bg-[var(--raaga-elevated)] flex items-center justify-center text-xl shrink-0">
                {pl.coverEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{pl.name}</p>
                <p className="text-xs text-[var(--raaga-text3)]">{pl.trackIds.length} songs</p>
              </div>
            </button>
          ))}
          {playlists.length === 0 && (
            <p className="text-sm text-[var(--raaga-text3)] text-center py-4">No playlists yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
