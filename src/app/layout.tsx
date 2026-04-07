// src/app/layout.tsx
// Root Next.js layout with fonts, Redux provider, and next-themes
// Imports: next/font, next-themes, ReduxProvider, sonner Toaster

import type { Metadata } from 'next';
import { Sora, Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { ReduxProvider } from '@/store/Provider';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Raaga — Music for Every Mood',
  description: 'Discover and stream Indian music and more on Raaga',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${inter.variable} font-inter antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ReduxProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#282828',
                  color: '#fff',
                  border: '1px solid #3a3a3a',
                },
              }}
            />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
