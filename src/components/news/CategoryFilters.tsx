import Link from 'next/link';
import { ShootingStarIcon, SquaresFourIcon } from '@phosphor-icons/react/ssr';
import type { MoonState } from '@/lib/moon';
import { CATEGORIES, FILTER_CATEGORIES, categoryHref } from '@/lib/news/categories';
import type { NewsFilter } from '@/lib/news/get-posts';
import { CATEGORY_ICONS } from './CategoryTag';

/** Which moon the "featured" filter is following, for styling: data-moon="…" */
export function featuredMoon(moon: MoonState): 'eclipse' | 'blue' | 'new' | 'regular' {
  if (moon.mode !== 'default') return moon.mode;
  if (moon.theme === 'reflect') return 'new';
  return 'regular';
}

export default function CategoryFilters({ active, moon }: { active?: NewsFilter; moon: MoonState }) {
  const button =
  'filter-button inline-flex items-center gap-1 rounded-full px-2.5 py-[5px] font-medium leading-5 text-white ' +
  'bg-[rgba(var(--cat),0.2)] outline-1 outline-[rgb(var(--cat))]';

  return (
    <nav aria-label="Filter by category">
      <ul role="list" className="category-filters flex justify-center flex-wrap gap-2 md:gap-5">
        <li>
          <Link href="/news" aria-current={!active ? 'page' : undefined} data-category="all" className={button}>
            <SquaresFourIcon aria-hidden="true" weight="regular" className="size-4 shrink-0" />
            all
          </Link>
        </li>

        <li>
          <Link
            href={categoryHref('featured')}
            aria-current={active === 'featured' ? 'page' : undefined}
            data-category="featured"
            data-moon={featuredMoon(moon)}
            className={button}
          >
            <ShootingStarIcon aria-hidden="true" weight="regular" className="size-4 shrink-0" />
            featured
          </Link>
        </li>

        {FILTER_CATEGORIES.map((id) => {
          const { label, color } = CATEGORIES[id];
          const IconComponent = CATEGORY_ICONS[id];
          return (
            <li key={id}>
              <Link
                href={categoryHref(id)}
                aria-current={active === id ? 'page' : undefined}
                data-category={id}
                data-color={color}
                className={button}
              >
                <IconComponent aria-hidden="true" weight="regular" className="size-4 shrink-0" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
