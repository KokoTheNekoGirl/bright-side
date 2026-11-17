import type { Metadata } from 'next';
import NewsArchive from '@/components/news/NewsArchive';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Good News",
  description: "Every good news story in one location, filterable by category.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return (
    <div className="px-4 py-10">
      <NewsArchive page={1} />
    </div>
  );
}
