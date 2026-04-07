// src/app/(main)/layout.tsx
// Protected layout shell — Sidebar + PlayerBar always mounted
// Imports: auth, Sidebar, PlayerBar, Header, MobileNav, YouTubePlayer, NowPlayingView, MiniPlayer

import { auth } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { PlayerBar } from '@/components/player/PlayerBar';
import { QueueDrawer } from '@/components/player/QueueDrawer';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { NowPlayingView } from '@/components/player/NowPlayingView';
import { KeyboardShortcutsProvider } from '@/components/layout/KeyboardShortcutsProvider';
import { YouTubePlayer } from '@/components/player/YouTubePlayer';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <>
      <KeyboardShortcutsProvider>
        <div className="flex h-screen overflow-hidden bg-[var(--raaga-bg)] text-[var(--raaga-text)]">
          {/* Hidden YouTube IFrame player */}
          <YouTubePlayer />

          {/* Sidebar — desktop only */}
          <Sidebar session={session} />

          {/* Main area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header session={session} />
            <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</main>
          </div>

          {/* Queue drawer (slides in from right) */}
          <QueueDrawer />
        </div>

        {/* Fixed player bar at bottom (desktop) */}
        <PlayerBar />

        {/* Mobile mini player (above bottom nav) */}
        <MiniPlayer />

        {/* Mobile full-screen now playing */}
        <NowPlayingView />

        {/* Mobile bottom navigation */}
        <MobileNav />
      </KeyboardShortcutsProvider>
    </>
  );
}
