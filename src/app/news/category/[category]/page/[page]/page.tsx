import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import NewsArchive from '@/components/news/NewsArchive';
import { pageHref } from '@/components/news/Pagination';
import { categoryHref } from '@/lib/news/categories';
import { filterTitle, isNewsFilter } from '../../../filters';

export const revalidate = 3600;

// Rendered on first visit, then cached and refreshed hourly
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<'/news/category/[category]/page/[page]'>): Promise<Metadata> {
  const { category, page } = await params;
  return isNewsFilter(category) ? { title: `${filterTitle(category)}, page ${page}` } : {};
}

export default async function NewsCategoryPagedPage({ params }: PageProps<'/news/category/[category]/page/[page]'>) {
  const { category, page: raw } = await params;
  if (!isNewsFilter(category)) notFound();

  const page = /^\d+$/.test(raw) ? Number(raw) : NaN;
  if (!page) notFound();
  // One address per page: …/page/1 → the category page, …/page/02 → …/page/2
  if (page === 1 || raw !== String(page)) permanentRedirect(pageHref(page, categoryHref(category)));

  return (
    <div className="px-4 py-10">
      <NewsArchive page={page} filter={category} />
    </div>
  );
}
