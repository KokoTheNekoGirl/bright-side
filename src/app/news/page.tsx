import type { Metadata } from 'next';
import NewsArchive from '@/components/news/NewsArchive';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Good news | Look on the Bright Side',
};

export default function NewsPage() {
  return (
    <div className="px-4 py-10">
      <NewsArchive page={1} />
    </div>
  );
}
