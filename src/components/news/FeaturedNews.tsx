import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { MoonState } from '@/lib/moon';
import { getFeaturedPosts } from '@/lib/news/get-posts';
import { isReflectionTheme } from '@/lib/news/tone';
import EmptyState from './EmptyState';
import PostList from './PostList';
import BrushStroke from '@/components/BrushStroke';

/**
 * Home page: posts whose (private) tone matches the moon.
 *  - Normal moons: up to 10 from this cycle, then "And more good news!"
 *  - Blue moon / eclipse: the past year, 10 per page
 *  - None: soft error + "See other good news!"
 */
export default async function FeaturedNews({ moon, page = 1 }: { moon: MoonState; page?: number }) {
  const { posts, totalPages } = await getFeaturedPosts(moon, page);
  if (page > totalPages) notFound();

  const reflecting = isReflectionTheme(moon.theme);

  return (
    <section aria-labelledby="featured-heading" className="featured-news flex w-full items-center flex-col gap-10">
      <h2 id="featured-heading text-center">
        {reflecting ? 'Featured Somber News' : 'Featured Good News'}
      </h2>

      {posts.length ? (
        <>
          <PostList posts={posts} />
          <Link href="/news/category/featured" className="more-news self-center text-primary relative brush-link hover:drop-shadow-[0_0_15px_rgb(var(--primary))]">
            {reflecting ? 'see more news' : 'and more good news!'}
            <BrushStroke />
          </Link>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <EmptyState />
          <Link href="/news" className="more-news text-primary relative brush-link hover:drop-shadow-[0_0_15px_rgb(var(--primary))]">
            {reflecting ? 'see other news' : 'see other good news!'}
            <BrushStroke />
          </Link>
        </div>
      )}
    </section>
  );
}
