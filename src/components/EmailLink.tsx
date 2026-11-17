'use client';

import { useRef } from 'react';

/*
 * Spam-resistant mailto link. The address never appears in the HTML:
 * it's joined from parts only when a person hovers, focuses or clicks.
 * Without JavaScript the link just points to the fallback.
 */
export default function EmailLink({
  user,
  domain,
  subject,
  fallback = '/about',
  className,
  children,
}: {
  user: string;
  domain: string;
  subject?: string;
  fallback?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const mailto = () =>
    `mailto:${user}${String.fromCharCode(64)}${domain}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

  // Swap in the real address when someone's about to use the link,
  // so hovering shows it in the status bar and right-click → copy works
  const reveal = () => {
    if (ref.current) ref.current.href = mailto();
  };

  return (
    <a
      ref={ref}
      href={fallback}
      onPointerEnter={reveal}
      onFocus={reveal}
      onTouchStart={reveal}
      onClick={(e) => {
        e.preventDefault();
        window.location.href = mailto();
      }}
      className={className}
    >
      {children}
    </a>
  );
}