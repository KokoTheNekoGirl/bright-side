import type { AnchorHTMLAttributes } from 'react';
import { ArrowSquareOutIcon } from '@phosphor-icons/react/ssr';

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export default function ExternalLink({  href, rel, className = '', children, ...props }: ExternalLinkProps) {
  const relTokens = new Set(rel?.split(/\s+/).filter(Boolean));
  relTokens.add('external');
  relTokens.add('noopener');

  const isBrush = className.split(/\s+/).includes('brush-link');
  const classes = isBrush ? className : `inline-flex items-center gap-1 ${className}`.trim();

  return (
    <a
      href={href}
      rel={[...relTokens].join(' ')}
      target="_blank"
      className={classes}
      aria-describedby="external-hint"
      {...props}
    >
      {children}
      {!isBrush && <ArrowSquareOutIcon aria-hidden="true" className="size-3 shrink-0" />}
    </a>
  );
}