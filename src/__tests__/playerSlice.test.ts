// src/__tests__/playerSlice.test.ts
// Unit tests for the Redux player slice actions and reducers
// Imports: vitest, playerSlice actions, Track type

import { describe, it, expect } from 'vitest';
import playerReducer, {
  playTrack, togglePlay, next, previous, setVolume,
  toggleMute, toggleShuffle, cycleRepeat, addToQueue,
  clearQueue, seekTo,
} from '../store/slices/playerSlice';
import type { PlayerState } from '../types';

const mockTrack = {
  youtubeId: 'abc123',
  title: 'Test Track',
  artist: 'Test Artist',
  thumbnail: 'https://example.com/thumb.jpg',
  duration: 180,
};

const mockTrack2 = {
  youtubeId: 'def456',
  title: 'Track 2',
  artist: 'Artist 2',
  thumbnail: 'https://example.com/thumb2.jpg',
  duration: 240,
};

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  queue: [],
  history: [],
  volume: 70,
  muted: false,
  progress: 0,
  duration: 0,
  shuffleMode: false,
  repeatMode: 'off',
  buffering: false,
};

describe('playerSlice', () => {
  it('should return initial state', () => {
    expect(playerReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should play a track', () => {
    const state = playerReducer(initialState, playTrack(mockTrack));
    expect(state.currentTrack).toEqual(mockTrack);
    expect(state.isPlaying).toBe(true);
    expect(state.progress).toBe(0);
    expect(state.buffering).toBe(true);
  });

  it('should add current track to history when playing new track', () => {
    const withTrack = playerReducer(initialState, playTrack(mockTrack));
    const withNewTrack = playerReducer(withTrack, playTrack(mockTrack2));
    expect(withNewTrack.history).toContainEqual(mockTrack);
  });

  it('should toggle play/pause', () => {
    const playing = playerReducer({ ...initialState, currentTrack: mockTrack, isPlaying: true }, togglePlay());
    expect(playing.isPlaying).toBe(false);
    const paused = playerReducer(playing, togglePlay());
    expect(paused.isPlaying).toBe(true);
  });

  it('should not toggle if no current track', () => {
    const state = playerReducer(initialState, togglePlay());
    expect(state.isPlaying).toBe(false);
  });

  it('should advance to next track from queue', () => {
    const withQueue = { ...initialState, currentTrack: mockTrack, queue: [mockTrack2] };
    const state = playerReducer(withQueue, next());
    expect(state.currentTrack).toEqual(mockTrack2);
    expect(state.queue).toHaveLength(0);
    expect(state.history).toContainEqual(mockTrack);
  });

  it('should go to previous track', () => {
    const withHistory = { ...initialState, currentTrack: mockTrack2, history: [mockTrack] };
    const state = playerReducer(withHistory, previous());
    expect(state.currentTrack).toEqual(mockTrack);
  });

  it('should seek to beginning if progress > 3 on previous', () => {
    const withProgress = { ...initialState, currentTrack: mockTrack, history: [mockTrack2], progress: 10 };
    const state = playerReducer(withProgress, previous());
    expect(state.progress).toBe(0);
    expect(state.currentTrack).toEqual(mockTrack);
  });

  it('should set volume', () => {
    const state = playerReducer(initialState, setVolume(50));
    expect(state.volume).toBe(50);
    expect(state.muted).toBe(false);
  });

  it('should clamp volume between 0 and 100', () => {
    expect(playerReducer(initialState, setVolume(-10)).volume).toBe(0);
    expect(playerReducer(initialState, setVolume(150)).volume).toBe(100);
  });

  it('should toggle mute', () => {
    const muted = playerReducer(initialState, toggleMute());
    expect(muted.muted).toBe(true);
    const unmuted = playerReducer(muted, toggleMute());
    expect(unmuted.muted).toBe(false);
  });

  it('should toggle shuffle', () => {
    const shuffled = playerReducer(initialState, toggleShuffle());
    expect(shuffled.shuffleMode).toBe(true);
  });

  it('should cycle repeat modes: off → all → one → off', () => {
    let state = playerReducer(initialState, cycleRepeat());
    expect(state.repeatMode).toBe('all');
    state = playerReducer(state, cycleRepeat());
    expect(state.repeatMode).toBe('one');
    state = playerReducer(state, cycleRepeat());
    expect(state.repeatMode).toBe('off');
  });

  it('should add track to queue', () => {
    const state = playerReducer(initialState, addToQueue(mockTrack));
    expect(state.queue).toHaveLength(1);
    expect(state.queue[0]).toEqual(mockTrack);
  });

  it('should clear queue', () => {
    const withQueue = { ...initialState, queue: [mockTrack, mockTrack2] };
    const state = playerReducer(withQueue, clearQueue());
    expect(state.queue).toHaveLength(0);
  });

  it('should seek to position', () => {
    const withDuration = { ...initialState, duration: 200 };
    const state = playerReducer(withDuration, seekTo(120));
    expect(state.progress).toBe(120);
  });

  it('should clamp seek within duration', () => {
    const withDuration = { ...initialState, duration: 200 };
    expect(playerReducer(withDuration, seekTo(-10)).progress).toBe(0);
    expect(playerReducer(withDuration, seekTo(999)).progress).toBe(200);
  });
});
