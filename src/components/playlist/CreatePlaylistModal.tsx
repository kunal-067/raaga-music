// src/components/playlist/CreatePlaylistModal.tsx
// Modal dialog for creating a new playlist with emoji picker and form validation
// Imports: react-hook-form, zod, shadcn Dialog, useCreatePlaylistMutation, useAppSelector/Dispatch

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeModal } from '@/store/slices/uiSlice';
import { useCreatePlaylistMutation } from '@/store/api/playlistApi';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const EMOJIS = ['🎵','🎶','🎸','🎹','🥁','🎺','🎻','🎤','🎧','🎼','🔥','💫','✨','🌟','💎','🌊','🌙','☀️','🌈','🎭','🎪'];

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(300).optional(),
  isPublic: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function CreatePlaylistModal() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const activeModal = useAppSelector((s) => s.ui.activeModal);
  const [selectedEmoji, setSelectedEmoji] = useState('🎵');
  const [createPlaylist, { isLoading }] = useCreatePlaylistMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', isPublic: false },
  });

  if (activeModal !== 'create-playlist') return null;

  function handleClose() {
    dispatch(closeModal());
    reset();
    setSelectedEmoji('🎵');
  }

  async function onSubmit(data: FormData) {
    try {
      const pl = await createPlaylist({ ...data, coverEmoji: selectedEmoji }).unwrap();
      toast.success(`Playlist "${data.name}" created!`, { icon: selectedEmoji });
      handleClose();
      router.push(`/main/playlist/${pl._id}`);
    } catch {
      toast.error('Failed to create playlist');
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="w-full max-w-md bg-[#282828] rounded-2xl p-7 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sora text-2xl font-bold">Create playlist</h2>
          <button onClick={handleClose} className="text-[var(--raaga-text3)] hover:text-[var(--raaga-text)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Emoji picker */}
          <div>
            <label className="block text-sm font-medium text-[var(--raaga-text2)] mb-2">Cover Emoji</label>
            <div className="grid grid-cols-7 gap-1.5">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setSelectedEmoji(e)}
                  className={cn(
                    'text-xl p-1.5 rounded-lg transition-all hover:bg-[var(--raaga-elevated)]',
                    selectedEmoji === e && 'bg-[var(--raaga-elevated)] ring-2 ring-[var(--raaga-accent)]'
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--raaga-text2)] mb-1.5">Name *</label>
            <input
              {...register('name')}
              placeholder="My Playlist #1"
              className="w-full bg-[var(--raaga-elevated)] border border-[var(--raaga-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--raaga-text)] transition-colors placeholder:text-[var(--raaga-text3)]"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--raaga-text2)] mb-1.5">Description</label>
            <input
              {...register('description')}
              placeholder="Add an optional description"
              className="w-full bg-[var(--raaga-elevated)] border border-[var(--raaga-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--raaga-text)] transition-colors placeholder:text-[var(--raaga-text3)]"
            />
          </div>

          {/* Public toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('isPublic')} className="w-4 h-4 accent-[var(--raaga-accent)]" />
            <span className="text-sm text-[var(--raaga-text2)]">Make playlist public</span>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-full text-sm font-semibold border border-[var(--raaga-border)] hover:border-[var(--raaga-text)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-full text-sm font-bold bg-[var(--raaga-accent)] text-black hover:scale-[1.03] transition-transform disabled:opacity-50"
            >
              {isLoading ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
