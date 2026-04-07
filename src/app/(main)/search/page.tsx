// src/app/main/search/page.tsx
// Search page with debounced input, genre filters, and results
// Imports: SearchBar, SearchResults, FilterChips, GenreGrid components

import { SearchPageClient } from '@/components/search/SearchPageClient';

export default function SearchPage() {
  return (
    <div className="px-6 pb-8 pt-2">
      <SearchPageClient />
    </div>
  );
}
