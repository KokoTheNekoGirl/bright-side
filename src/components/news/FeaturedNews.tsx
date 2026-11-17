import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { MoonState } from '@/lib/moon';
import { getFeaturedPosts } from '@/lib/news/get-posts';
import { isReflectionTheme } from '@/lib/news/tone';
import BrushStroke from '@/components/BrushStroke';
import EmptyState from './EmptyState';
import PostList from './PostList';

/**
 * Home page: posts whose (private) tone matches the moon.
 *  - Normal moons (new moon included): up to 10 from this cycle, then the "more" link
 *  - Blue moon / eclipse: the past year, 20 per page, pagination, then the "more" link
 *  - None: soft error + link to the archive
 */
export default async function FeaturedNews({ moon, page = 1 }: { moon: MoonState; page?: number }) {
  const { posts, totalPages } = await getFeaturedPosts(moon, page);
  if (page > totalPages) notFound();

  const reflecting = isReflectionTheme(moon.theme);

  return (
    <section aria-labelledby="featured-heading" className="featured-news flex w-full flex-col items-center gap-10">
      <h2 id="featured-heading" className="text-center">
        {reflecting ? 'Featured Somber News' : 'Featured Good News'}
      </h2>

      {posts.length ? (
        <>
          <PostList posts={posts} />
          <Link href="/news/category/featured" className="more-news brush-link relative self-center text-primary sm-heading">
            {reflecting ? 'see more news' : 'and more good news!'}
            <BrushStroke />
          </Link>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <EmptyState />
          <Link href="/news" className="more-news brush-link relative text-primary sm-heading">
            {reflecting ? 'see other news' : 'see other good news!'}
            <BrushStroke />
          </Link>
        </div>
      )}
    </section>
  );
}