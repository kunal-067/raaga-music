// src/components/layout/MobileNav.tsx
// Mobile bottom navigation bar shown on screens smaller than lg
// Imports: next/link, lucide-react icons, usePathname

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/library', label: 'Library', icon: Library },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-[0px] left-0 right-0 z-40 bg-[var(--raaga-elevated)] border-t border-[var(--raaga-border)] flex">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/main' && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors',
              active ? 'text-[var(--raaga-accent)]' : 'text-[var(--raaga-text3)]'
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
