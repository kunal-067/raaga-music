// src/hooks/useYouTube.ts
// Hook managing YouTube IFrame player sync with Redux player state
// Imports: react, react-youtube types, usePlayer hook, store dispatch

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePlayer } from './usePlayer';

// YouTube player state constants
const YT_PLAYING = 1;
const YT_PAUSED = 2;
const YT_ENDED = 0;
const YT_BUFFERING = 3;

export function useYouTube() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const {
    currentTrack, isPlaying, volume, muted, progress,
    setProgress, setDuration, setBuffering, next, seekTo,
  } = usePlayer();

  const onReady = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: { target: any }) => {
      playerRef.current = event.target;
      playerRef.current.setVolume(muted ? 0 : volume);
    },
    [muted, volume]
  );

  const onStateChange = useCallback(
    (event: { data: number }) => {
      if (event.data === YT_PLAYING) {
        setBuffering(false);
        const dur = playerRef.current?.getDuration() || 0;
        setDuration(Math.floor(dur));
      } else if (event.data === YT_BUFFERING) {
        setBuffering(true);
      } else if (event.data === YT_PAUSED) {
        setBuffering(false);
      } else if (event.data === YT_ENDED) {
        next();
      }
    },
    [setBuffering, setDuration, next]
  );

  // Sync play/pause
  useEffect(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  // Sync volume/mute
  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.setVolume(muted ? 0 : volume);
  }, [volume, muted]);

  // Poll current time every 500ms
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (playerRef.current) {
          const t = playerRef.current.getCurrentTime();
          setProgress(Math.floor(t));
        }
      }, 500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, setProgress]);

  // Seek when user scrubs
  const handleSeek = useCallback(
    (seconds: number) => {
      playerRef.current?.seekTo(seconds, true);
      seekTo(seconds);
    },
    [seekTo]
  );

  return { playerRef, onReady, onStateChange, handleSeek, currentTrack, progress };
}

// Extend global Window with YT namespace
// declare global {
//   namespace YT {
//     interface Player {
//       setVolume(volume: number): void;
//       playVideo(): void;
//       pauseVideo(): void;
//       getDuration(): number;
//       getCurrentTime(): number;
//       seekTo(seconds: number, allowSeekAhead: boolean): void;
//     }
//   }

//   interface Window {
//     YT: typeof YT;
//     onYouTubeIframeAPIReady: () => void;
//   }
// }
