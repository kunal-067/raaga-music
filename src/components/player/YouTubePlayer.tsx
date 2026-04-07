// src/components/player/YouTubePlayer.tsx
// Hidden YouTube IFrame that drives actual audio playback
// Imports: react-youtube, useYouTube hook

'use client';

import YouTube from 'react-youtube';
import { useYouTube } from '@/hooks/useYouTube';
import { useEffect, useState } from 'react';

export function YouTubePlayer() {
  const { currentTrack, onReady, onStateChange } = useYouTube();

  if (!currentTrack) return null;

  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) return null;

  return (
    <div className="fixed -bottom-full -left-full w-0 h-0 overflow-hidden pointer-events-none">
      <YouTube
        key={currentTrack.youtubeId}
        videoId={currentTrack.youtubeId}
        opts={{
          height: '1',
          width: '1',
          playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            disablekb: 1,
            rel: 0
          },
        }}
        onReady={onReady}
        onStateChange={onStateChange}
      />
    </div>
  );
}
