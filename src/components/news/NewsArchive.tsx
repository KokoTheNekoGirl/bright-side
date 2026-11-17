import { notFound } from 'next/navigation';
import { getMoonState } from '@/lib/moon';
import { CATEGORIES, categoryHref } from '@/lib/news/categories';
import { getPostsPage, type NewsFilter } from '@/lib/news/get-posts';
import { NEWS_HEADING } from '@/lib/news/tone';
import CategoryFilters from './CategoryFilters';
import Pagination from './Pagination';
import PostList from './PostList';
import BrushStroke from '@/components/BrushStroke';

/** Shared by /news, /news/page/[page] and /news/category/[category](/page/[page]). */
export default async function NewsArchive({ page, filter }: { page: number; filter?: NewsFilter }) {
  const moon = getMoonState();
  const { posts, totalPages } = await getPostsPage(page, filter, moon);
  if (page > totalPages) notFound();

  const filterLabel = filter === 'featured' ? 'featured' : filter ? CATEGORIES[filter].label : null;
  const { subheading, title } = NEWS_HEADING[moon.theme];

  return (
    <section aria-labelledby="news-heading" className="news-archive flex w-full flex-col gap-8">
      <div className="flex flex-col gap-4">
        <hgroup className="news-heading flex flex-col gap-2 mb-2.5">
          <p className="md-subheading mb-2.5">
            <span className="relative inline-block">
              {subheading}
              <BrushStroke />
            </span>
          </p>
          <h1 id="news-heading" className="font-display text-xlg text-heading">
            {title}
            {filterLabel && <span className="sr-only">: {filterLabel}</span>}
            {page > 1 && <span className="sr-only">, page {page}</span>}
          </h1>
        </hgroup>
        <CategoryFilters active={filter} moon={moon} />
      </div>

      <PostList posts={posts} emptyMessage={filter ? 'Nothing in this category yet...' : undefined} />
      <Pagination page={page} totalPages={totalPages} basePath={filter ? categoryHref(filter) : '/news'} />
    </section>
  );
}
