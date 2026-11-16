import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import NewsArchive from '@/components/news/NewsArchive';
import { pageHref } from '@/components/news/Pagination';

export const revalidate = 3600;

// Pages are rendered on first visit, then cached and refreshed hourly
export async function generateStaticParams() {
  return [];
}

function parsePage(raw: string) {
  return /^\d+$/.test(raw) ? Number(raw) : NaN;
}

export async function generateMetadata({ params }: PageProps<'/news/page/[page]'>): Promise<Metadata> {
  const { page } = await params;
  return { title: `Good news, page ${page} | Look on the Bright Side` };
}

export default async function NewsPagedPage({ params }: PageProps<'/news/page/[page]'>) {
  const raw = (await params).page;
  const page = parsePage(raw);
  if (!page) notFound();
  // One address per page: /news/page/1 → /news, /news/page/02 → /news/page/2
  if (page === 1 || raw !== String(page)) permanentRedirect(pageHref(page));

  return (
    <div className="px-4 py-10">
      <NewsArchive page={page} />
    </div>
  );
}
