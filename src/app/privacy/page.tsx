import type { Metadata } from 'next';
import EmptyState from '@/components/news/EmptyState';

export const metadata: Metadata = {
  title: "Privacy",
  description: "Coming soon to Bright✦Side.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
    return(
        <EmptyState message="Coming soon!" />
    );
}