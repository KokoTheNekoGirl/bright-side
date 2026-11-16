import { ArrowUpRightIcon, CalendarStarIcon, NewspaperIcon, YoutubeLogoIcon } from '@phosphor-icons/react/ssr';
import ExternalLink from '@/components/ExternalLink';
import type { Post } from '@/lib/news/get-posts';
import { SITE_TIMEZONE } from '@/consts';
import CategoryTag from './CategoryTag';
import VideoEmbed from './VideoEmbed';

function ordinal(n: number) {
  const rule = new Intl.PluralRules('en', { type: 'ordinal' }).select(n);
  return ({ one: 'st', two: 'nd', few: 'rd', other: 'th' } as Record<string, string>)[rule] ?? 'th';
}

/** "24th October, 2016", with the suffix in <sup> */
function PostDate({ date }: { date: Date }) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: SITE_TIMEZONE, day: 'numeric', month: 'long', year: 'numeric' })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  const day = Number(parts.day);

  return (
    <time dateTime={date.toISOString()}>
      {day}
      <sup>{ordinal(day)}</sup> {parts.month}, {parts.year}
    </time>
  );
}

function PostMeta({ post }: { post: Post }) {
  const SourceIcon = post.kind === 'video' ? YoutubeLogoIcon : NewspaperIcon;

  return (
    <p className="flex flex-wrap items-center gap-x-2.5 leading-5 text-accent">
      <span className="inline-flex items-center gap-[5px]">
        <SourceIcon aria-hidden="true" className="size-4" />
        <span className="sr-only">{post.kind === 'video' ? 'Channel: ' : 'Source: '}</span>
        {post.source.name}
      </span>
      {post.date && (
        <span className="inline-flex items-center gap-[5px]">
          <CalendarStarIcon aria-hidden="true" className="size-4" />
          <span className="sr-only">Published </span>
          <PostDate date={post.date} />
        </span>
      )}
    </p>
  );
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <article
      data-source={post.source.id}
      data-kind={post.kind}
      data-graphic={post.graphic || undefined}
      className="post-card flex w-full md:max-w-fit flex-col items-start gap-2 overflow-hidden rounded-xl bg-radial-[at_36%_11%] from-surface to-canvas px-7 py-5 shadow-card outline-2 outline-secondary"
    >
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {post.categories.map((id) => (
          <CategoryTag key={id} id={id} />
        ))}
      </div>

      {post.kind === 'video' && post.videoId ? (
        <>
          {/* Title isn't shown in the design (it's in the video), but screen readers need it */}
          <h3 className="sr-only">
            <ExternalLink href={post.url}>{post.title}</ExternalLink>
          </h3>
          <div className="my-2 w-full">
            <VideoEmbed videoId={post.videoId} title={post.title} sensitive={post.graphic} />
          </div>
          <PostMeta post={post} />
        </>
      ) : (
        <>
          <h3 className="text-2xl leading-7 text-heading">
            <ExternalLink href={post.url} className="group inline-flex items-start gap-2.5 hover:text-primary">
              {post.title}
              <ArrowUpRightIcon
                aria-hidden="true"
                className="mt-1 size-5 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </ExternalLink>
          </h3>

          <PostMeta post={post} />

          {post.excerpt &&
            (post.graphic ? (
              // Content warning: summary hidden until opened (works without JavaScript <3)
              <details className="content-warning leading-5 text-body">
                <summary className="cursor-pointer text-eclipse-text">Content warning: show summary</summary>
                <p className="mt-1">{post.excerpt}</p>
              </details>
            ) : (
              <p className="leading-5 text-body">{post.excerpt}</p>
            ))}
        </>
      )}
    </article>
  );
}
