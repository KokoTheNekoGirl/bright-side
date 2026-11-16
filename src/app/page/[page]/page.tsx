import { notFound, redirect } from 'next/navigation';
import HomeView from '@/components/HomeView';
import { pageHref } from '@/components/news/Pagination';
import { getMoonState } from '@/lib/moon';

export const revalidate = 3600;

// Rendered on first visit, then cached and refreshed hourly
export async function generateStaticParams() {
  return [];
}

/** Home page, page 2+. Only exists during a blue moon or eclipse. */
export default async function HomePagedPage({ params }: PageProps<'/page/[page]'>) {
  const raw = (await params).page;
  const page = /^\d+$/.test(raw) ? Number(raw) : NaN;
  if (!page) notFound();

  const moon = getMoonState();
  // Temporary redirects: whether paging exists depends on the moon
  if (moon.mode === 'default' || page === 1) redirect('/');
  if (raw !== String(page)) redirect(pageHref(page, '/'));

  return <HomeView moon={moon} page={page} />;
}
