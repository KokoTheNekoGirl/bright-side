import { MoonStarsIcon } from '@phosphor-icons/react/ssr';

/** Bare on purpose: style with .news-empty */
export default function EmptyState({ message = 'Looks like nothing new to show...' }: { message?: string }) {
  return (
    <div role="status" className="news-empty flex flex-col items-center gap-1 py-10 text-center text-accent">
      <MoonStarsIcon aria-hidden="true" className="size-6" />
      <p className="font-display text-lg">{message}</p>
    </div>
  );
}
