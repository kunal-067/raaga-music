// src/components/recommendation/GenreGrid.tsx
// Colourful genre card grid for browse / home sections
// Imports: useRouter for navigation, GENRE_SEARCH_QUERIES from lib/youtube

'use client';

import { useRouter } from 'next/navigation';

const GENRES = [
  { name: 'Bollywood', color: '#e11d48', emoji: '🎬' },
  { name: 'Indie', color: '#7c3aed', emoji: '🎸' },
  { name: 'Sufi', color: '#0891b2', emoji: '🌙' },
  { name: 'Classical', color: '#b45309', emoji: '🪗' },
  { name: 'Pop', color: '#db2777', emoji: '🌟' },
  { name: 'Hip-Hop', color: '#1d4ed8', emoji: '🎤' },
  { name: 'Lo-fi', color: '#059669', emoji: '☕' },
  { name: 'EDM', color: '#6d28d9', emoji: '⚡' },
  { name: 'Folk', color: '#92400e', emoji: '🌾' },
  { name: 'Rock', color: '#dc2626', emoji: '🤘' },
  { name: 'Jazz', color: '#1e40af', emoji: '🎷' },
  { name: 'Soul', color: '#be185d', emoji: '💜' },
];

interface GenreGridProps {
  onSelect?: (genre: string) => void;
}

export function GenreGrid({ onSelect }: GenreGridProps) {
  const router = useRouter();

  function handleClick(genre: string) {
    if (onSelect) {
      onSelect(genre);
    } else {
      router.push(`/search?q=${encodeURIComponent(genre)}&genre=${encodeURIComponent(genre)}`);
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
      {GENRES.map((g) => (
        <button
          key={g.name}
          onClick={() => handleClick(g.name)}
          className="relative rounded-xl p-4 aspect-[16/10] flex items-end overflow-hidden hover:scale-[1.03] transition-transform"
          style={{ background: g.color }}
        >
          <span className="font-sora font-bold text-white text-sm relative z-10">{g.name}</span>
          <span className="absolute right-3 top-3 text-3xl opacity-70">{g.emoji}</span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </button>
      ))}
    </div>
  );
}
