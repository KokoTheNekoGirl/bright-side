import { FILTER_CATEGORIES, CATEGORIES } from '@/lib/news/categories';
import type { NewsFilter } from '@/lib/news/get-posts';

export const NEWS_FILTERS: NewsFilter[] = ['featured', ...(FILTER_CATEGORIES as NewsFilter[])];

export const isNewsFilter = (value: string): value is NewsFilter =>
  (NEWS_FILTERS as string[]).includes(value);

export const filterTitle = (filter: NewsFilter) =>
  `Good news: ${filter === 'featured' ? 'featured' : CATEGORIES[filter].label} | Look on the Bright Side`;
