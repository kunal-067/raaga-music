// src/components/layout/Sidebar.tsx
// App sidebar with navigation, playlist list, and create button
// Imports: next/link, lucide-react icons, useGetPlaylistsQuery, useAppSelector, Session type

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library, Plus, Music2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetPlaylistsQuery } from '@/store/api/playlistApi';
import { useAppDispatch, useAppSelector } from '@/store';
import { openModal } from '@/store/slices/uiSlice';
import type { Session } from 'next-auth';

interface SidebarProps {
  session: Session | null;
}

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/library', label: 'Your Library', icon: Library },
];

export function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const { data: playlists = [] } = useGetPlaylistsQuery(undefined, { skip: !session });

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-[var(--raaga-bg)] border-r border-[var(--raaga-border)] transition-all duration-300 shrink-0',
        sidebarOpen ? 'w-60' : 'w-[72px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-[var(--raaga-accent)] flex items-center justify-center shrink-0">
          <Music2 className="w-5 h-5 text-black" />
        </div>
        {sidebarOpen && (
          <span className="font-sora text-xl font-bold bg-gradient-to-r from-[var(--raaga-accent)] to-purple-400 bg-clip-text text-transparent">
            Raaga
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="px-2 space-y-1 shrink-0">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/main' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-4 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium',
                active
                  ? 'bg-[var(--raaga-elevated)] text-[var(--raaga-text)]'
                  : 'text-[var(--raaga-text3)] hover:bg-[var(--raaga-elevated)] hover:text-[var(--raaga-text)]'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Create playlist */}
      <button
        onClick={() => dispatch(openModal('create-playlist'))}
        className="mx-2 mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--raaga-text3)] hover:bg-[var(--raaga-elevated)] hover:text-[var(--raaga-text)] transition-all duration-150"
      >
        <Plus className="w-5 h-5 shrink-0" />
        {sidebarOpen && <span>Create Playlist</span>}
      </button>

      <div className="h-px bg-[var(--raaga-border)] mx-4 my-2" />

      {/* Playlists */}
      {sidebarOpen && (
        <p className="px-5 py-1 text-[10px] font-semibold tracking-widest uppercase text-[var(--raaga-text3)]">
          Playlists
        </p>
      )}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {playlists.map((pl) => (
          <Link
            key={pl._id}
            href={`/playlist/${pl._id}`}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150',
              pathname === `/main/playlist/${pl._id}`
                ? 'bg-[var(--raaga-elevated)]'
                : 'hover:bg-[var(--raaga-elevated)]'
            )}
          >
            <div className="w-9 h-9 rounded-md bg-[var(--raaga-elevated)] flex items-center justify-center text-lg shrink-0">
              {pl.coverEmoji}
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate text-[var(--raaga-text)]">{pl.name}</p>
                <p className="text-xs text-[var(--raaga-text3)] truncate">
                  Playlist · {pl.trackIds.length} songs
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>
    </aside>
  );
}
