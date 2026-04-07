// src/components/player/QueueDrawer.tsx
// Sliding queue drawer showing now playing and next up tracks
// Imports: useAppSelector/Dispatch, usePlayer hook, lucide-react, DnD kit

'use client';

import Image from 'next/image';
import { X, GripVertical } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setQueueOpen } from '@/store/slices/uiSlice';
import { usePlayer } from '@/hooks/usePlayer';
import { formatDuration, cn } from '@/lib/utils';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Track } from '@/types';

function SortableQueueItem({ track, index, onRemove }: { track: Track; index: number; onRemove: (i: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: track.youtubeId + index });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--raaga-elevated)] group">
      <div {...attributes} {...listeners} className="cursor-grab text-[var(--raaga-text3)] opacity-0 group-hover:opacity-100">
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="w-9 h-9 rounded bg-[var(--raaga-card)] overflow-hidden relative shrink-0">
        {track.thumbnail && <Image src={track.thumbnail} alt={track.title} fill className="object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{track.title}</p>
        <p className="text-xs text-[var(--raaga-text3)] truncate">{track.artist}</p>
      </div>
      {track.durationStr && <span className="text-xs text-[var(--raaga-text3)]">{track.durationStr}</span>}
      <button onClick={() => onRemove(index)} className="opacity-0 group-hover:opacity-100 text-[var(--raaga-text3)] hover:text-[var(--raaga-text)] transition-opacity">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function QueueDrawer() {
  const dispatch = useAppDispatch();
  const queueOpen = useAppSelector((s) => s.ui.queueOpen);
  const player = usePlayer();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = player.queue.findIndex((_, i) => player.queue[i].youtubeId + i === active.id);
    const newIdx = player.queue.findIndex((_, i) => player.queue[i].youtubeId + i === over.id);
    if (oldIdx !== -1 && newIdx !== -1) player.reorderQueue(oldIdx, newIdx);
  }

  return (
    <>
      {/* Backdrop */}
      {queueOpen && (
        <div className="fixed inset-0 z-30 bg-black/30" onClick={() => dispatch(setQueueOpen(false))} />
      )}

      <aside
        className={cn(
          'fixed right-0 top-0 bottom-20 w-80 z-40 bg-[var(--raaga-surface)] border-l border-[var(--raaga-border)] flex flex-col transition-transform duration-300',
          queueOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-[var(--raaga-border)]">
          <h2 className="font-sora text-base font-bold">Queue</h2>
          <button onClick={() => dispatch(setQueueOpen(false))} className="text-[var(--raaga-text3)] hover:text-[var(--raaga-text)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {/* Now playing */}
          {player.currentTrack && (
            <div className="mb-4">
              <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--raaga-text3)]">Now Playing</p>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--raaga-elevated)]">
                <div className="w-9 h-9 rounded bg-[var(--raaga-card)] overflow-hidden relative shrink-0">
                  {player.currentTrack.thumbnail && (
                    <Image src={player.currentTrack.thumbnail} alt="" fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-[var(--raaga-accent)]">{player.currentTrack.title}</p>
                  <p className="text-xs text-[var(--raaga-text3)] truncate">{player.currentTrack.artist}</p>
                </div>
                <div className="equalizer shrink-0">
                  <div className="eq-bar" /><div className="eq-bar" /><div className="eq-bar" />
                </div>
              </div>
            </div>
          )}

          {/* Next up */}
          <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--raaga-text3)]">
            Next Up {player.queue.length > 0 && `(${player.queue.length})`}
          </p>
          {player.queue.length === 0 ? (
            <p className="px-2 py-4 text-sm text-[var(--raaga-text3)]">Queue is empty</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={player.queue.map((t, i) => t.youtubeId + i)}
                strategy={verticalListSortingStrategy}
              >
                {player.queue.map((track, i) => (
                  <SortableQueueItem
                    key={track.youtubeId + i}
                    track={track}
                    index={i}
                    onRemove={player.removeFromQueue}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        {player.queue.length > 0 && (
          <div className="px-4 py-3 border-t border-[var(--raaga-border)]">
            <button
              onClick={player.clearQueue}
              className="text-xs text-[var(--raaga-text3)] hover:text-[var(--raaga-text)] transition-colors"
            >
              Clear queue
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
