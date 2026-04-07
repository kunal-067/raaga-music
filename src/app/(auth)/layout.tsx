// src/app/(auth)/layout.tsx
// Minimal layout for auth pages — no sidebar or player
// Imports: nothing special, just passes children through

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
