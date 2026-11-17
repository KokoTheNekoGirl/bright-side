import type { MetadataRoute } from 'next';
import { FILTER_CATEGORIES } from '@/lib/news/categories';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://brightsidemoon.vercel.app';

  // Static routes
  const routes = [
    { url: baseUrl, changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/about`, priority: 0.8 },
    { url: `${baseUrl}/news`, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${baseUrl}/attribution`, priority: 0.5 },
    { url: `${baseUrl}/privacy`, priority: 0.5 },
  ];

  // Category pages
  Object.keys(FILTER_CATEGORIES).forEach((category) => {
    routes.push({
      url: `${baseUrl}/news/category/${category}`,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    });
  });

  // Pagination (news archive goes ~20-30 pages typically)
  for (let page = 2; page <= 10; page++) {
    routes.push({
      url: `${baseUrl}/news/page/${page}`,
      changeFrequency: 'hourly' as const,
      priority: 0.7,
    });
  }

  return routes;
}
