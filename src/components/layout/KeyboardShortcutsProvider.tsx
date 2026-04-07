// src/components/layout/KeyboardShortcutsProvider.tsx
// Client component that activates global keyboard shortcuts
// Imports: useKeyboard hook

'use client';

import { useKeyboard } from '@/hooks/useKeyboard';

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  useKeyboard();
  return <>{children}</>;
}
