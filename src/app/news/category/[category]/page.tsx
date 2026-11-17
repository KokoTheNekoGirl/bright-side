import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsArchive from '@/components/news/NewsArchive';
import { NEWS_FILTERS, filterTitle, isNewsFilter } from '../filters';

export const revalidate = 3600;
export const dynamicParams = false; // unknown categories 404

export function generateStaticParams() {
  return NEWS_FILTERS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps<'/news/category/[category]'>): Promise<Metadata> {
  const { category } = await params;
  return isNewsFilter(category) ? { title: filterTitle(category) } : {};
}

export default async function NewsCategoryPage({ params }: PageProps<'/news/category/[category]'>) {
  const { category } = await params;
  if (!isNewsFilter(category)) notFound();

  return (
    <div className="px-4 py-10">
      <NewsArchive page={1} filter={category} />
    </div>
  );
}
