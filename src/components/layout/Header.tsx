// src/components/layout/Header.tsx
// Top header with back/forward nav, theme toggle, and user session display
// Imports: lucide-react, next-themes, useAppDispatch, openModal, Session

'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Sun, Moon, LogIn, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleSidebar, openModal } from '@/store/slices/uiSlice';
import { CreatePlaylistModal } from '@/components/playlist/CreatePlaylistModal';
import { AddToPlaylistModal } from '@/components/playlist/AddToPlaylistModal';
import type { Session } from 'next-auth';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface HeaderProps {
  session: Session | null;
}

export function Header({ session }: HeaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // if (!mounted) return null;

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center gap-3 px-6 py-4 bg-gradient-to-b from-[var(--raaga-bg)] to-transparent">
        {/* Sidebar toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="hidden lg:flex w-8 h-8 items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen
            ? <PanelLeftClose className="w-4 h-4" />
            : <PanelLeft className="w-4 h-4" />}
        </button>

        {/* Back/Forward */}
        <div className="flex gap-2">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.forward()}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1" />

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--raaga-elevated)] transition-colors"
          title="Toggle theme"
        >
          {mounted && (theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
        </button>

        {/* User / Sign In */}
        {session?.user ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--raaga-accent)] flex items-center justify-center text-black font-bold text-sm overflow-hidden">
              {session.user.image ? (
                <Image src={session.user.image} alt={session.user.name || ''} width={32} height={32} />
              ) : (
                (session.user.name?.[0] || 'U').toUpperCase()
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => dispatch(openModal('auth'))}
            className="flex items-center gap-2 px-4 py-1.5 bg-[var(--raaga-text)] text-[var(--raaga-bg)] rounded-full text-sm font-bold hover:scale-105 transition-transform"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign in
          </button>
        )}
      </header>

      {/* Modals rendered here to access session context */}
      <CreatePlaylistModal />
      <AddToPlaylistModal />
    </>
  );
}
