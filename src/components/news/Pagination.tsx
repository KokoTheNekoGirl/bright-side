import Link from 'next/link';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react/ssr';

/** /news, /news/page/2 … or /, /page/2 … for the home page */
export const pageHref = (n: number, basePath = '/news') =>
  n <= 1 ? basePath : `${basePath === '/' ? '' : basePath}/page/${n}`;

/** 1 … 4 [5] 6 … 12: first, last, and one either side of the current page. */
function pageItems(page: number, total: number): (number | 'gap')[] {
  const keep = new Set([1, total, page - 1, page, page + 1].filter((n) => n >= 1 && n <= total));
  const sorted = [...keep].sort((a, b) => a - b);
  return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? ['gap' as const, n] : [n]));
}

/** Bare on purpose: style with .pagination, [aria-current="page"], [aria-disabled="true"]. */
export default function Pagination({
  page,
  totalPages,
  basePath = '/news',
}: {
  page: number;
  totalPages: number;
  basePath?: string;
}) {
  if (totalPages <= 1) return null;
  const href = (n: number) => pageHref(n, basePath);

  const linkClass = 'inline-flex min-w-9 items-center justify-center gap-1 rounded-full px-3 py-1.5';

  return (
    <nav aria-label="Pagination" className="pagination flex justify-center">
      <ul role="list" className="flex flex-wrap items-center gap-1">
        <li>
          {page > 1 ? (
            <Link href={href(page - 1)} rel="prev" className={linkClass}>
              <CaretLeftIcon aria-hidden="true" className="size-4" />
              Previous
            </Link>
          ) : (
            <span aria-disabled="true" className={`${linkClass} opacity-40`}>
              <CaretLeftIcon aria-hidden="true" className="size-4" />
              Previous
            </span>
          )}
        </li>

        {pageItems(page, totalPages).map((item, i) =>
          item === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={href(item)}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Page ${item}`}
                className={`${linkClass} aria-[current=page]:bg-primary aria-[current=page]:text-deep`}
              >
                {item}
              </Link>
            </li>
          ),
        )}

        <li>
          {page < totalPages ? (
            <Link href={href(page + 1)} rel="next" className={linkClass}>
              Next
              <CaretRightIcon aria-hidden="true" className="size-4" />
            </Link>
          ) : (
            <span aria-disabled="true" className={`${linkClass} opacity-40`}>
              Next
              <CaretRightIcon aria-hidden="true" className="size-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
