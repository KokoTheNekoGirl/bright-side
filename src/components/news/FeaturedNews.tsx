import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { MoonState } from '@/lib/moon';
import { getFeaturedPosts } from '@/lib/news/get-posts';
import EmptyState from './EmptyState';
import Pagination from './Pagination';
import PostList from './PostList';

/**
 * Home page: posts whose (private) tone matches the moon.
 *  - Normal moons: up to 10 from this cycle, then "And more good news!"
 *  - Blue moon / eclipse: the past year, 10 per page
 *  - None: soft error + "See other good news!"
 */
export default async function FeaturedNews({ moon, page = 1 }: { moon: MoonState; page?: number }) {
  const { posts, totalPages, paginated } = await getFeaturedPosts(moon, page);
  if (page > totalPages) notFound();

  return (
    <section aria-labelledby="featured-heading" className="featured-news flex w-full flex-col gap-10">
      <h2 id="featured-heading" className="sr-only">
        Featured good news
      </h2>

      {posts.length ? (
        <>
          <PostList posts={posts} />
          {paginated ? (
            <Pagination page={page} totalPages={totalPages} basePath="/" />
          ) : (
            <Link href="/news" className="more-news self-center text-primary underline-offset-4 hover:underline">
              And more good news!
            </Link>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center">
          <EmptyState />
          <Link href="/news" className="more-news text-primary underline-offset-4 hover:underline">
            See other good news!
          </Link>
        </div>
      )}
    </section>
  );
}
