import MoonHero from '@/components/MoonHero';
import FeaturedNews from '@/components/news/FeaturedNews';
import type { MoonState } from '@/lib/moon';

/** The home page, shared by / and /page/[page] (blue moon / eclipse paging). */
export default function HomeView({ moon, page = 1 }: { moon: MoonState; page?: number }) {
  return (
    <div className="flex flex-col gap-10 px-4 py-10">
      <MoonHero moon={moon} />
      <FeaturedNews moon={moon} page={page} />
    </div>
  );
}
