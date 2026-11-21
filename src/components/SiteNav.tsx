'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { ListIcon, XIcon } from '@phosphor-icons/react';
import BrushStroke from './BrushStroke';
import ThemeToggle from '@/components/sun/ThemeToggle';

const LINKS = [
  { href: '/about', label: 'About', match: (p: string) => p.startsWith('/about') },
  { href: '/news', label: 'Archive', match: (p: string) => p.startsWith('/news') },
];

/** Decorative star between links (desktop only). */
function Star() {
  return (
    <li aria-hidden="true" role="presentation" className="hidden md:block">
      <span className="inline-block drop-shadow-[0_0_25px_rgb(var(--primary))]">
        <span className="block h-6 w-5 bg-heading [mask:url(/assets/star.svg)_center/contain_no-repeat]" />
      </span>
    </li>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  // Remember which page the menu was opened on, so navigating closes it automatically
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenOn(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <nav
      id="site-nav"
      className="site-nav relative"
      aria-label="Main"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      {/* Hamburger: mobile only */}
      <button
        type="button"
        className="menu-toggle inline-flex w-12 items-center justify-center rounded-xl bg-[rgba(var(--primary),0.2)] px-2.5 py-3.5 text-white shadow-[0_0_20px_0_rgba(var(--primary),0.3)] outline-2 outline-primary md:hidden"
        aria-expanded={open}
        aria-controls="menu-list"
        aria-label={open ? 'Close main menu' : 'Open main menu'}
        onClick={() => setOpenOn(open ? null : pathname)}
      >
        {open ? (
          <XIcon aria-hidden="true" className="size-6" />
        ) : (
          <ListIcon aria-hidden="true" className="size-6" />
        )}
      </button>

      {/* Mobile: dropdown panel when open. Desktop: always a row. */}
      <ul
        id="menu-list"
        className={`menu absolute right-0 top-full z-20 mt-3 flex min-w-48 flex-col items-center gap-5 rounded-xl bg-container px-6 py-5 shadow-card outline-2 outline-secondary transition-[translate,opacity,visibility] duration-300 ease-out motion-reduce:transition-none ${
        open ? 'visible translate-x-0 opacity-100' : 'pointer-events-none invisible translate-x-[calc(100%+1rem)] opacity-0'
      } md:pointer-events-auto md:visible md:static md:mt-0 md:min-w-0 md:translate-x-0 md:flex-row md:gap-2.5 md:bg-none md:p-0 md:opacity-100 md:shadow-none md:outline-0 md:transition-none`}
      >
        {LINKS.map((link, i) => {
          const active = link.match(pathname);
          return (
            <Fragment key={link.href}>
              {i > 0 && <Star />}
              <li className="menu-item">
                <Link
                  href={link.href}
                  itemProp="url"
                  aria-current={active ? 'page' : undefined}
                  className="relative inline-block font-display text-lg-custom capitalize text-heading"
                >
                  <span itemProp="name">{link.label}</span>
                  {active && <BrushStroke className="text-primary animate-brush-wipe motion-reduce:animate-none" />}
                </Link>
              </li>
            </Fragment>
          );
        })}
        <Star />
        <ThemeToggle />
      </ul>
    </nav>
  );
}
