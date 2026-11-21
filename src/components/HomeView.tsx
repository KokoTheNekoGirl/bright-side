import MoonHero from '@/components/MoonHero';
import FeaturedNews from '@/components/news/FeaturedNews';
import type { MoonState } from '@/lib/moon';
import SunHero from '@/components/sun/SunHero';

/** The home page, shared by / and /page/[page] (blue moon / eclipse paging). */
export default function HomeView({ moon, page = 1 }: { moon: MoonState; page?: number }) {
  return (
    <div className="flex flex-col gap-10 px-4 py-10">
      <div className="night-only"><MoonHero moon={moon} /></div>
      <div className="bright-only"><SunHero moon={moon} /></div>
      <FeaturedNews moon={moon} page={page} />
    </div>
  );
}
