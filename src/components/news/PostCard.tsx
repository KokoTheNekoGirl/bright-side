import { ArrowUpRightIcon, CalendarStarIcon, NewspaperIcon, YoutubeLogoIcon, FeatherIcon } from '@phosphor-icons/react/ssr';
import ExternalLink from '@/components/ExternalLink';
import type { Post } from '@/lib/news/get-posts';
import { SITE_TIMEZONE } from '@/consts';
import CategoryTag from './CategoryTag';
import VideoEmbed from './VideoEmbed';
import BrushStroke from '@/components/BrushStroke';
import { getMoonState, type MoonState } from '@/lib/moon';

const moon = getMoonState();

const ogImage = `https://brightsidemoon.vercel.app/assets/og-images/og-${moon.image}.png`;

const MOON_ALT: Record<MoonState['image'], string> = {
  new: 'New moon',
  'wax-crescent': 'Waxing crescent moon',
  first: 'First quarter moon',
  'wax-gibbous': 'Waxing gibbous moon',
  full: 'Full moon',
  'wan-gibbous': 'Waning gibbous moon',
  third: 'Third quarter moon',
  'wan-crescent': 'Waning crescent moon',
  blue: 'Blue moon',
  eclipse: 'Lunar eclipse',
};

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
    <p className="meta-text flex flex-wrap items-center gap-x-2.5 gap-y-1 text-accent">
    <ExternalLink href={post.source.homepage} className="source-link">
      <SourceIcon aria-hidden="true" className="size-4 shrink-0" />
      <span className="sr-only">{post.kind === 'video' ? 'Channel: ' : 'Source: '}</span>
      {post.source.name}
    </ExternalLink>

    {post.kind === 'article' && post.author && (
      <span className="post-author inline-flex basis-full items-center gap-1 md:basis-auto">
        <FeatherIcon aria-hidden="true" className="size-4 shrink-0" />
        <span className="sr-only">Author: </span>
        {post.author}
      </span>
    )}

    {post.date && (
      <span className="inline-flex basis-full items-center gap-1 md:basis-auto">
        <CalendarStarIcon aria-hidden="true" className="size-4 shrink-0" />
        <span className="sr-only">Published </span>
        <PostDate date={post.date} />
      </span>
    )}
  </p>
  );
}

export default function PostCard({ post }: { post: Post }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    images: [{
      url: ogImage,
      width: 1200,
      height: 630,
      alt: `${MOON_ALT[moon.image]} ✦ Look on the Bright✦Side`,
    }],
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: post.source,
    },
    publisher: {
      "@type": "Organization",
      name: "Look on the Bright✦Side",
      logo: {
        "@type": "ImageObject",
        url: "https://brightsidemoon.vercel.app/assets/logo-night.png",
        width: 400,
        height: 94,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <article
        data-source={post.source.id}
        data-kind={post.kind}
        data-graphic={post.graphic || undefined}
        className="post-card flex w-full md:max-w-fit flex-col items-start gap-2.5 overflow-hidden rounded-xl bg-radial-[at_36%_11%] from-surface to-canvas px-7 py-5 shadow-card outline-2 outline-secondary"
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
            <div className="my-2 w-full md:min-w-[600px]">
              <VideoEmbed videoId={post.videoId} title={post.title} sensitive={post.graphic} />
            </div>
            <PostMeta post={post} />
          </>
        ) : (
          <>
            <h3 className="md-heading lowercase mb-1">
              <ExternalLink href={post.url} className="group brush-link relative inline-flex items-start gap-2.5 hover:drop-shadow-[0_0_15px_rgb(var(--primary))]">
                {post.title}
                <BrushStroke className="text-primary"/>
                <ArrowUpRightIcon
                  aria-hidden="true"
                  className="mt-1 size-6 shrink-0 text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </ExternalLink>
            </h3>

            <PostMeta post={post} />

            {post.excerpt &&
              (post.graphic ? (
                // Content warning: summary hidden until opened (works without JavaScript <3)
                <details className="content-warning leading-5 text-body">
                  <summary className="cursor-pointer text-eclipse-text">Content warning: show summary</summary>
                  <p className="mt-1 min-w-fit w-0">{post.excerpt}</p>
                </details>
              ) : (
                <p className="min-w-fit w-0">{post.excerpt}</p>
              ))}
            {post.credit && (
              <p className="post-credit mt-1 meta-text lowercase text-accent">
                <ExternalLink href={post.credit.href} className="source-link inline-flex items-center gap-1">
                  {post.credit.text}
                </ExternalLink>
              </p>
            )}
          </>
        )}
      </article>
   </>
  );
}
