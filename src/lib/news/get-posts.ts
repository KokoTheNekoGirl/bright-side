import Parser from 'rss-parser';
import { MoonPhase } from 'astronomy-engine';
import type { MoonState } from '@/lib/moon';
import { bestOtherCategory, categorise, type CategoryId } from './categories';
import { isBlocked, isExcluded, isGraphic, isPolitical } from './content';
import { CURATION } from './curation';
import { SOURCES, type Source } from './sources';
import { classifyTone, THEME_TONE, type Tone } from './tone';

export interface Post {
  id: string;
  kind: 'article' | 'video';
  title: string;
  url: string;
  excerpt: string;
  date: Date | null;
  author: string | null;
  source: Pick<Source, 'id' | 'name' | 'homepage' | 'license'>;
  categories: CategoryId[]; //graphic always comes first
  graphic: boolean;
  tone: Tone; // private moon editorial tone.
  pinned: boolean;
  videoId: string | null;
  credit: { text: string; href: string } | null; //publisher-required credit line
}

/** How long to cache each feed (seconds). */
const FEED_REVALIDATE = 3600;
const FEED_TIMEOUT_MS = 8000;

/** How much we keep. */
const EXCERPT_LENGTH = 180;
const BODY_LENGTH = 1500; //only used for scoring
const MAX_POSTS = 500;
export const HOME_LIMIT = 10;
export const SPECIAL_PER_PAGE = 20;
export const PER_PAGE = 20;

type MediaGroup = { 'media:description'?: string[] };

type FeedItem = {
  title?: string;
  link?: string;
  guid?: string;
  id?: string;
  isoDate?: string;
  pubDate?: string;
  creator?: string;
  author?: string;
  contentSnippet?: string;
  content?: string;
  'content:encoded'?: string;
  categories?: (string | { _: string })[];
  'topic-tags'?: string;
  videoId?: string;
  mediaGroup?: MediaGroup;
};

const parser: Parser<object, FeedItem> = new Parser({
  customFields: {
    item: [
      'topic-tags', // Mongabay's extra tags
      ['yt:videoId', 'videoId'], // YouTube
      ['media:group', 'mediaGroup'],
    ],
  },
});

/* ------------------------------------------------------------------ */

function cleanText(html = ''): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/The post .* appeared first on .*\.?$/i, '') // WordPress footer line
    .replace(/\s+/g, ' ')
    .trim();
}

function excerpt(text: string): string {
  if (text.length <= EXCERPT_LENGTH) return text;
  const cut = text.slice(0, EXCERPT_LENGTH);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

function tagsOf(item: FeedItem): string[] {
  const tags = (item.categories ?? []).map((c) => (typeof c === 'string' ? c : c._));
  if (item['topic-tags']) tags.push(...item['topic-tags'].split(/,|\band\b/));
  return tags.map((t) => t.trim()).filter(Boolean);
}

/*
 * Channel boilerplate: lines that repeat across a channel's videos (membership
 * plugs, link lists, social handles) say nothing about the video itself, and
 * would tilt every video toward the same categories. Any line found in 30%+
 * of the feed's videos (at least 2) is dropped before scoring.
 */
function boilerplateLines(descriptions: string[]): Set<string> {
  const counts = new Map<string, number>();
  for (const d of descriptions) {
    for (const line of new Set(d.split('\n').map((l) => l.trim()).filter(Boolean))) {
      counts.set(line, (counts.get(line) ?? 0) + 1);
    }
  }
  const min = Math.max(2, Math.ceil(descriptions.length * 0.3));
  return new Set([...counts].filter(([, n]) => n >= min).map(([line]) => line));
}

function videoSummary(description: string, boilerplate: Set<string>): string {
  return description
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !boilerplate.has(l) && !/^[=\-_*~]{3,}$/.test(l))
    .join(' ')
    .replace(/https?:\/\/\S+/g, ' ');
}

async function fetchSource(source: Source): Promise<Post[]> {
  const res = await fetch(source.feedUrl, {
    next: { revalidate: FEED_REVALIDATE },
    signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
    headers: { 'User-Agent': 'BrightSide/1.0 RSS reader' },
  });
  if (!res.ok) throw new Error(`${source.name}: HTTP ${res.status}`);

  const feed = await parser.parseString(await res.text());

  const rawDescription = (item: FeedItem) => item.mediaGroup?.['media:description']?.[0] ?? '';
  const boilerplate = source.kind === 'video' ? boilerplateLines(feed.items.map(rawDescription)) : new Set<string>();

  return feed.items.flatMap((item): Post[] => {
    const url = item.link?.trim();
    const title = cleanText(item.title);
    if (!url || !title) return [];

    const curation = CURATION[url] ?? {};
    if (curation.hide) return [];

    const isVideo = source.kind === 'video';
    // What readers see: excerpt (articles) or description (videos)
    const description = isVideo ? videoSummary(rawDescription(item), boilerplate) : (item.contentSnippet ?? item.content);
    const text = cleanText(description);
    // Extra evidence for scoring only: the start of the full article, when the feed includes it
    const body = isVideo ? '' : cleanText(item['content:encoded']).slice(0, BODY_LENGTH);
    const tags = tagsOf(item);
    const visible = `${title} ${text} ${tags.join(' ')}`;

    if (!curation.pin) {
      if (source.filterNegative && isBlocked(`${title} ${text}`)) return [];
      if (isExcluded(visible)) return []; // AI topics
      if (isPolitical(visible, body)) return []; // US partisan politics
    }

    // Tone: fixed sources keep their tone unless this post is clearly somber
    const autoTone = classifyTone(title, text, body);
    const tone = curation.tone ?? (source.fixedTone ? (autoTone === 'reflection' ? 'reflection' : source.fixedTone) : autoTone);

    // Graphic warning is judged on what readers actually see
    const graphic = curation.graphic ?? isGraphic(`${title} ${text}`, tone);

    // Categories: a single fixed category gets the best second one for this post
    const input = { title, text, body, tags };
    let topical: CategoryId[];
    if (curation.categories) topical = [...curation.categories];
    else if (source.fixedCategories?.length === 1) {
      const [fixed] = source.fixedCategories;
      const second = bestOtherCategory(input, fixed);
      topical = second ? [fixed, second] : [fixed];
    } else topical = source.fixedCategories ? [...source.fixedCategories] : categorise(input);

    const date = item.isoDate ?? item.pubDate;
    const published = date ? new Date(date) : null;

    // publisher hold
    if (source.embargoHours && (!published || Date.now() - published.getTime() < source.embargoHours * 3_600_000)) {
      return [];
    }

    return [
      {
        id: item.guid ?? item.id ?? url,
        kind: source.kind,
        title,
        url,
        excerpt: isVideo ? '' : excerpt(text),
        date: date ? new Date(date) : null,
        author: (item.creator ?? item.author)?.trim() || null,
        source: { id: source.id, name: source.name, homepage: source.homepage, license: source.license },
        categories: graphic ? ['graphic', ...topical.slice(0, 2)] : [...topical],
        graphic,
        tone,
        pinned: Boolean(curation.pin),
        videoId: isVideo ? (item.videoId ?? new URL(url).searchParams.get('v')) : null,
        credit: source.credit
          ? { text: source.credit.text, href: source.credit.href === 'original' ? url : source.credit.href }
          : null,
      },
    ];
  });
}

/** Pinned first, then newest first. */
function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) || (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0),
  );
}

/* ------------------------------------------------------------------ */

/**
 * All enabled sources, merged, de-duplicated, pinned first then newest first.
 * A feed that fails is logged and skipped, so one bad source never blanks the page.
 */
export async function getPosts(): Promise<Post[]> {
  const preview = process.env.NODE_ENV !== 'production' ? process.env.NEWS_PREVIEW : undefined;
  if (preview === 'empty') return [];

  const results = await Promise.allSettled(
    SOURCES.filter((s) => s.enabled !== false).map(fetchSource),
  );

  const posts: Post[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') posts.push(...r.value);
    else console.warn('[news] feed failed:', r.reason instanceof Error ? r.reason.message : r.reason);
  }

  const seen = new Set<string>();
  return sortPosts(posts.filter((p) => (seen.has(p.url) ? false : (seen.add(p.url), true)))).slice(
    0,
    MAX_POSTS,
  );
}

/* ------------------------------------------------------------------ */

const DAY_MS = 86_400_000;
const SYNODIC_MONTH_DAYS = 29.530588;

/**
 * Start of the window the home page features from:
 * the current lunar cycle (since the last new moon), or the past year
 * for blue moons and eclipses ("this past year" in the hero copy).
 */
function featureWindowStart(moon: MoonState, now = new Date()): Date {
  if (moon.mode !== 'default') return new Date(now.getTime() - 365 * DAY_MS);
  const daysSinceNew = (MoonPhase(now) / 360) * SYNODIC_MONTH_DAYS;
  // Small buffer so the night-of-new-moon window still includes the cycle just ending
  return new Date(now.getTime() - (daysSinceNew + 1.5) * DAY_MS);
}

/** All posts whose tone matches the moon, inside its window (newest first). */
async function featuredMatches(moon: MoonState): Promise<Post[]> {
  const tone = THEME_TONE[moon.theme];
  const since = featureWindowStart(moon).getTime();
  return (await getPosts()).filter(
    (p) => p.tone === tone && (p.pinned || (p.date?.getTime() ?? 0) >= since),
  );
}

/** Every post whose tone matches the moon, any date (the "featured" filter on /news). */
async function allFeatured(moon: MoonState): Promise<Post[]> {
  const tone = THEME_TONE[moon.theme];
  return (await getPosts()).filter((p) => p.tone === tone);
}

/**
 * Home page posts: tone matches the moon, from this cycle.
 * Normal moons: up to HOME_LIMIT, no paging.
 * Blue moon / eclipse: the whole past year, HOME_LIMIT per page.
 */
export async function getFeaturedPosts(moon: MoonState, page = 1) {
  const matches = await featuredMatches(moon);
  const paginated = moon.mode !== 'default';
  const perPage = paginated ? SPECIAL_PER_PAGE : HOME_LIMIT;
  const totalPages = paginated ? Math.max(1, Math.ceil(matches.length / perPage)) : 1;
  const start = paginated ? (page - 1) * perPage : 0;

  return { posts: matches.slice(start, start + perPage), page, totalPages, paginated };
}

/** What /news can be filtered by: a category, or 'featured' (the home page's picks). */
export type NewsFilter = Exclude<CategoryId, 'graphic'> | 'featured';

/** Reflection posts only appear while the moon asks for them: new moon or eclipse. */
const showsReflection = (moon?: MoonState) => !!moon && THEME_TONE[moon.theme] === 'reflection';

/** One page of the archive, optionally filtered. Page numbers start at 1. */
export async function getPostsPage(page: number, filter?: NewsFilter, moon?: MoonState, perPage = PER_PAGE) {
  let posts: Post[];
  if (filter === 'featured') posts = moon ? await allFeatured(moon) : [];
  else if (filter) posts = (await getPosts()).filter((p) => p.categories.includes(filter));
  else posts = await getPosts();

  // Outside new moons and eclipses, keep the archive purely good news
  if (!showsReflection(moon)) posts = posts.filter((p) => p.tone !== 'reflection');

  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  return {
    posts: posts.slice((page - 1) * perPage, page * perPage),
    page,
    totalPages,
    total: posts.length,
  };
}
