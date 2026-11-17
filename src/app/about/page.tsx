import type { Metadata } from 'next';
import EmptyState from '@/components/news/EmptyState';

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about the Bright✦Side.",
  alternates: { canonical: "/about" },
};

export default function NewsPage() {
  return (
      <EmptyState message="Coming soon!" />
  );
}
