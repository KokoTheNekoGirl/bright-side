import { notFound } from 'next/navigation';
import { getPostsPage } from '@/lib/news/get-posts';
import Pagination from './Pagination';
import PostList from './PostList';

/** Shared by /news and /news/page/[page]. */
export default async function NewsArchive({ page }: { page: number }) {
  const { posts, totalPages } = await getPostsPage(page);
  if (page > totalPages) notFound();

  return (
    <section aria-labelledby="news-heading" className="news-archive flex w-full flex-col gap-8">
      <h1 id="news-heading" className="font-display text-xlg text-heading">
        Good news{page > 1 && <span className="sr-only">, page {page}</span>}
      </h1>

      <PostList posts={posts} />
      <Pagination page={page} totalPages={totalPages} />
    </section>
  );
}
