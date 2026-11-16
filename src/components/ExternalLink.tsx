import type { AnchorHTMLAttributes } from 'react';

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export default function ExternalLink({ href, rel, children, ...props }: ExternalLinkProps) {
  const relTokens = new Set(rel?.split(/\s+/).filter(Boolean));
  relTokens.add('external');
  relTokens.add('noopener');

  return (
    <a
      href={href}
      rel={[...relTokens].join(' ')}
      target="_blank"
      aria-describedby="external-hint"
      {...props}
    >
      {children}
    </a>
  );
}