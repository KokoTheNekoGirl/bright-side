import type { Metadata } from 'next';
import BrushStroke from '@/components/BrushStroke';
import ExternalLink from '@/components/ExternalLink';
import { SOURCES, type Source } from '@/lib/news/sources';
import { ArrowUpRightIcon } from '@phosphor-icons/react/ssr';
import { getAllTracks } from '@/lib/music/jamendo';
import { VISUAL_CREDITS } from '@/lib/credits/data';

export const metadata: Metadata = {
  title: 'Sources & Attribution',
  description: 'The publishers, creators, artists, and musicians whose work appears on Look on the Bright✦Side.',
  alternates: { canonical: '/attribution' },
};

// Playlists change daily; refresh the credits hourly like the rest of the site
export const revalidate = 3600;

/** How each kind of source is used, in plain words. */
const HOW_USED: Record<Source['license'], string> = {
  cc: 'Headlines and short summaries, shared under the publisher’s open licence, always linking to the full story.',
  'link-only': 'Headlines and short summaries only, linking to the full story.',
  embed: 'Videos play through YouTube’s own player.',
};

/*
 * Generated from src/lib/news/sources.ts and the music playlists:
 * add a source or change a playlist and it appears here automatically.
 * Disabled sources aren't listed.
 */
export default async function SourcesPage() {
  const active = SOURCES.filter((s) => s.enabled !== false);
  const groups = [
    { id: 'publishers', heading: 'Publishers', items: active.filter((s) => s.kind === 'article') },
    { id: 'channels', heading: 'Video channels', items: active.filter((s) => s.kind === 'video') },
  ];
  const tracks = await getAllTracks();

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
        Every story and song on Bright✦Side comes from one of these publishers, creators and musicians. All credit
        for the reporting, writing, filming and music belongs to them. Please visit, follow and support their work.
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
                    {source.licenseNotice && (
                      <span className="text-sm text-accent">
                        Licence:{' '}
                        {source.licenseNotice.url ? (
                          <ExternalLink href={source.licenseNotice.url} className="source-link">
                            {source.licenseNotice.name}
                          </ExternalLink>
                        ) : (
                          source.licenseNotice.name
                        )}
                      </span>
                    )}
                    {source.licenseNotice?.url && (
                      <ExternalLink href={source.licenseNotice.url} className="source-link self-start text-sm text-accent">
                        Republishing terms
                      </ExternalLink>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ),
      )}

       {VISUAL_CREDITS.length > 0 && (
        <section aria-labelledby="visuals" className="flex flex-col gap-4">
          <h2 id="visuals" className="font-display text-lg-custom text-heading">
            Icons &amp; Illustrations
          </h2>
          <p className="text-sm text-accent">
            Hero vector graphics and site logo design are by the developer, <ExternalLink href="https://kokoneko.art">KokoNekoArt</ExternalLink>.
          </p>
          <ul role="list" className="flex flex-col gap-4">
            {VISUAL_CREDITS.map((v) => (
              <li key={v.id} className="flex flex-col gap-0.5 wrap-anywhere">
                <span>
                  <ExternalLink href={v.url} className="source-link font-semibold text-heading">
                    {v.name}
                  </ExternalLink>
                  {v.author && (
                    <>
                      {' '}by{' '}
                      {v.author.url ? (
                        <ExternalLink href={v.author.url} className="source-link">
                          {v.author.name}
                        </ExternalLink>
                      ) : (
                        v.author.name
                      )}
                    </>
                  )}
                  {v.source && (
                    <>
                      {' '}via{' '}
                      <ExternalLink href={v.source.url} className="source-link">
                        {v.source.name}
                      </ExternalLink>
                    </>
                  )}
                </span>
                <span className="text-sm text-accent">{v.usedFor}</span>
                <span className="text-sm text-accent">
                  Licence:{' '}
                  {v.license.url ? (
                    <ExternalLink href={v.license.url} className="source-link">
                      {v.license.name}
                    </ExternalLink>
                  ) : (
                    v.license.name
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tracks.length > 0 && (
        <section aria-labelledby="music" className="flex flex-col gap-4">
          <h2 id="music" className="font-display text-lg-custom text-heading">
            Music
          </h2>
          <p className="text-sm text-accent">
            Streamed from{' '}
            <ExternalLink href="https://www.jamendo.com" className="source-link">
              Jamendo
            </ExternalLink>
            , unedited, under each artist’s Creative Commons licence. Bright✦Side is non-commercial and only plays
            instrumental tracks released before 2022 in an effort to filter out AI-generated music.
          </p>
          <ul role="list" className="flex flex-col gap-2">
            {tracks.map((t) => (
              <li key={t.id} className="wrap-anywhere">
                <ExternalLink href={t.trackUrl} className="source-link font-semibold text-heading">
                  {t.title}
                </ExternalLink>{' '}
                {' ✦ '}
                <ExternalLink href={t.artistUrl} className="source-link">
                  {t.artist}
                </ExternalLink>
                {t.license && (
                  <>
                    {' ✦ '}
                    <ExternalLink href={t.license.url} className="source-link text-sm text-accent">
                      {t.license.name}
                    </ExternalLink>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
