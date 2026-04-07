// src/app/main/page.tsx
// Home feed page — displays recommendation sections and quick picks
// Imports: auth, RecommendationRow, GenreGrid, QuickPicks components

import { auth } from '@/lib/auth';
import { getGreeting } from '@/lib/utils';
import { HomeFeed } from '@/components/recommendation/HomeFeed';

export default async function HomePage() {
  const session = await auth();
  const greeting = getGreeting();

  return (
    <div className="px-6 pb-8">
      <h1 className="font-sora text-3xl font-bold pt-2 mb-6">
        {greeting}{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}
      </h1>
      <HomeFeed />
    </div>
  );
}
