import type { Metadata } from 'next';
import BrushStroke from '@/components/BrushStroke';
import ExternalLink from '@/components/ExternalLink';
import { SOURCES, type Source } from '@/lib/news/sources';
import { ArrowUpRightIcon } from '@phosphor-icons/react/ssr';

export const metadata: Metadata = {
  title: "Sources & Attribution",
  description: "The publishers and creators whose stories appear on Look on the Bright✦Side.",
  alternates: { canonical: "/attribution" },
};

/** How each kind of source is used, in plain words. */
const HOW_USED: Record<Source['license'], string> = {
  cc: 'Headlines and short summaries, shared under the publisher’s open licence, always linking to the full story.',
  'link-only': 'Headlines and short summaries only, linking to the full story.',
  embed: 'Videos play through YouTube’s own player.',
};

/*
 * Generated from src/lib/news/sources.ts: enable or add a source there
 * and it appears here automatically. Disabled sources aren't listed.
 */
export default function SourcesPage() {
  const active = SOURCES.filter((s) => s.enabled !== false);
  const groups = [
    { id: 'publishers', heading: 'Publishers', items: active.filter((s) => s.kind === 'article') },
    { id: 'channels', heading: 'Video channels', items: active.filter((s) => s.kind === 'video') },
  ];

  return (
    <div className="sources mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 py-10">
      <hgroup className="flex flex-col gap-2">
        <p className="md-subheading">
          <span className="relative inline-block">
            With thanks
            <BrushStroke className="animate-brush-wipe motion-reduce:animate-none" />
          </span>
        </p>
        <h1 className="xlg-heading">Sources &amp; Attribution</h1>
      </hgroup>

      <p className="text-body">
        Every story on Bright✦Side comes from one of these publishers and creators. All credit for the reporting,
        writing and filming belongs to them. Please visit, follow and support their work.
      </p>

      {groups.map(
        (group) =>
          group.items.length > 0 && (
            <section key={group.id} aria-labelledby={group.id} className="flex flex-col gap-4">
              <h2 id={group.id} className="font-display text-lg-custom text-heading">
                {group.heading}
              </h2>
              <ul role="list" className="flex flex-col gap-4">
                {group.items.map((source) => (
                  <li key={source.id} className="flex flex-col gap-0.5">
                    <span className="md-heading lowercase mb-2">
                      <ExternalLink href={source.homepage} className="group brush-link relative inline-flex items-start gap-2.5 hover:drop-shadow-[0_0_15px_rgb(var(--primary))]">
                        {source.name}
                        <BrushStroke className="text-primary"/>
                        <ArrowUpRightIcon
                          aria-hidden="true"
                          className="mt-1 size-6 shrink-0 text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                        />
                      </ExternalLink>
                    </span>
                    <span className="meta-text text-accent">{HOW_USED[source.license]}</span>
                  </li>
                ))}
              </ul>
            </section>
          ),
      )}
    </div>
  );
}
