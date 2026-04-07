// src/store/index.ts
// Configures and exports the Redux store with all slices and middleware
// Imports: @reduxjs/toolkit, all slices, RTK Query APIs, localStorage middleware

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import playerReducer from './slices/playerSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import { playlistApi } from './api/playlistApi';
import { searchApi } from './api/searchApi';
import { recommendApi } from './api/recommendApi';
import { localStorageMiddleware, loadPersistedState } from './middleware/localStorageMiddleware';

const preloaded = loadPersistedState();

export const store = configureStore({
  reducer: {
    player: playerReducer,
    ui: uiReducer,
    user: userReducer,
    [playlistApi.reducerPath]: playlistApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [recommendApi.reducerPath]: recommendApi.reducer,
  },
  // preloadedState: preloaded,
  middleware: (getDefault) =>
    getDefault()
      .concat(playlistApi.middleware)
      .concat(searchApi.middleware)
      .concat(recommendApi.middleware)
      .concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
