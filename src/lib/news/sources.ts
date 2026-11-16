import type { CategoryId } from './categories';
import type { Tone } from './tone';

/*
 * Everything Bright Side pulls from.
 *
 * `license` says what you're allowed to show:
 *   'cc'        → Creative Commons / republication allowed. Full article may be
 *                 embedded per `rules`, on posts you opt in via curation.ts.
 *   'link-only' → All rights reserved. Headline, short excerpt and link only.
 *   'embed'     → YouTube. Shown with YouTube's official embed player.
 *
 * `fixedCategories` / `fixedTone` skip the auto-classifiers for a whole source.
 * `filterNegative` drops posts matching BLOCK_KEYWORDS (content.ts).
 */

export interface Source {
  id: string;
  name: string;
  kind: 'article' | 'video';
  feedUrl: string;
  homepage: string;
  license: 'cc' | 'link-only' | 'embed';
  rules?: string;
  fixedCategories?: [CategoryId] | [CategoryId, CategoryId];
  fixedTone?: Tone;
  filterNegative?: boolean;
  enabled?: boolean;
}

/**
 * YouTube feed for a channel's long-form videos (Shorts excluded).
 * Find a channel ID: open the channel → About (the "more" link under the name)
 * → Share channel → Copy channel ID. It starts with "UC".
 */
export function youtubeFeed(channelId: string, { includeShorts = false } = {}) {
  return includeShorts
    ? `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    : `https://www.youtube.com/feeds/videos.xml?playlist_id=UULF${channelId.slice(2)}`;
}

export const SOURCES: Source[] = [
  /* ---------- Articles: republication allowed ---------- */
  {
    id: 'mongabay',
    name: 'Mongabay',
    kind: 'article',
    feedUrl: 'https://news.mongabay.com/list/conservation-solutions/feed/',
    homepage: 'https://news.mongabay.com',
    license: 'cc',
    rules:
      'CC BY-ND 4.0. Credit author + Mongabay, link to the exact article, keep in-text links, no edits (headline may change). Only Mongabay/author-credited photos.',
    filterNegative: true,
  },
  {
    id: 'rtbc',
    name: 'Reasons to be Cheerful',
    kind: 'article',
    feedUrl: 'https://reasonstobecheerful.world/feed/',
    homepage: 'https://reasonstobecheerful.world',
    license: 'cc',
    rules: 'MOST articles CC: check each one. Credit + link back. Ask the editors before reusing photos.',
  },
  {
    id: 'yes',
    name: 'YES! Magazine',
    kind: 'article',
    feedUrl: 'https://www.yesmagazine.org/feed',
    homepage: 'https://www.yesmagazine.org',
    license: 'cc',
    rules:
      'CC text only, 48h after publication. Keep byline + bio, links intact, no text edits. Email reprints@yesmagazine.org. Images mostly not CC.',
  },
  {
    id: 'mit-news',
    name: 'MIT News',
    kind: 'article',
    feedUrl: 'https://news.mit.edu/rss/feed',
    homepage: 'https://news.mit.edu',
    license: 'cc',
    rules:
      'Syndication allowed. Top: headline, sub-headline, byline, "MIT News" linking the original. Bottom: "Reprinted with permission of MIT News" linking news.mit.edu. Images need MIT approval.',
    filterNegative: true,
  },

  /* ---------- Videos ---------- */
  {
    id: 'sam-bentley',
    name: 'Sam Bentley',
    kind: 'video',
    feedUrl: youtubeFeed('UCXQbZmsuSr3ndvN8NGlo7oQ'),
    homepage: 'https://www.youtube.com/@itsSamBentley',
    license: 'embed',
    fixedCategories: ['hope'],
    fixedTone: 'celebration',
    enabled: false,
  },
  {
    id: 'planet-wild',
    name: 'Planet Wild',
    kind: 'video',
    feedUrl: youtubeFeed('UC6QFT2c2MJxID-vxHDeX9XQ'),
    homepage: 'https://www.youtube.com/@planet-wild',
    license: 'embed',
    fixedCategories: ['nature', 'tomorrow'],
    fixedTone: 'growth',
  },
  {
    id: 'ocean-cleanup',
    name: 'The Ocean Cleanup',
    kind: 'video',
    feedUrl: youtubeFeed('UCYXGHivsMPVU-h-M_wd9m3Q'),
    homepage: 'https://www.youtube.com/@theoceancleanup',
    license: 'embed',
    fixedCategories: ['oceans', 'tomorrow'],
    fixedTone: 'appreciation',
  },

  /* ---------- Restricted: terms forbid automated copying / databases. Ask permission first. ---------- */
  {
    id: 'positive-news',
    name: 'Positive News',
    kind: 'article',
    feedUrl: 'https://www.positive.news/feed/',
    homepage: 'https://www.positive.news',
    license: 'link-only',
    enabled: false,
  },
  {
    id: 'gnn',
    name: 'Good News Network',
    kind: 'article',
    feedUrl: 'https://www.goodnewsnetwork.org/feed/',
    homepage: 'https://www.goodnewsnetwork.org',
    license: 'link-only',
    enabled: false,
  },
];
