// src/store/slices/uiSlice.ts
// Redux slice for UI state: sidebar, modals, theme, queue drawer
// Imports: @reduxjs/toolkit, UIState and ModalName types

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UIState, ModalName } from '@/types';

const initialState: UIState = {
  sidebarOpen: true,
  sidebarWidth: 240,
  queueOpen: false,
  activeModal: null,
  theme: 'dark',
  nowPlayingExpanded: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarWidth(state, action: PayloadAction<number>) {
      state.sidebarWidth = Math.max(72, Math.min(320, action.payload));
    },
    toggleQueue(state) {
      state.queueOpen = !state.queueOpen;
    },
    setQueueOpen(state, action: PayloadAction<boolean>) {
      state.queueOpen = action.payload;
    },
    openModal(state, action: PayloadAction<ModalName>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark' | 'system'>) {
      state.theme = action.payload;
    },
    toggleNowPlaying(state) {
      state.nowPlayingExpanded = !state.nowPlayingExpanded;
    },
    setNowPlayingExpanded(state, action: PayloadAction<boolean>) {
      state.nowPlayingExpanded = action.payload;
    },
  },
});

export const {
  toggleSidebar, setSidebarWidth, toggleQueue, setQueueOpen,
  openModal, closeModal, setTheme, toggleNowPlaying, setNowPlayingExpanded,
} = uiSlice.actions;

export default uiSlice.reducer;
