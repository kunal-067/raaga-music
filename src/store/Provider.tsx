// src/store/Provider.tsx
// Client-side Redux Provider wrapper for Next.js App Router
// Imports: react-redux Provider, store from index

'use client';

import { Provider } from 'react-redux';
import { store } from './index';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
