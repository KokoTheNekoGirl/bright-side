import type { CategoryId } from './categories';
import type { Tone } from './tone';

/*
 * Everything Bright✦Side pulls from.
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
  {
    id: 'shareable',
    name: 'Shareable',
    kind: 'article',
    feedUrl: 'https://www.shareable.net/feed/',
    homepage: 'https://www.shareable.net',
    license: 'cc',
    rules: 'CC BY-NC-ND 4.0. Non-commercial only. Add "This article originally appeared on Shareable.net" linking the original. Ask before using images.',
  },
  {
    id: 'nexus-media',
    name: 'Nexus Media News',
    kind: 'article',
    feedUrl: 'https://nexusmedianews.com/feed/',
    homepage: 'https://nexusmedianews.com',
    license: 'cc',
    rules: 'CC BY-ND 3.0. Byline at top, tag line at bottom, link original. Email them links after publishing.',
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
  },
  {
    id: 'planet-wild',
    name: 'Planet Wild',
    kind: 'video',
    feedUrl: youtubeFeed('UC6QFT2c2MJxID-vxHDeX9XQ'),
    homepage: 'https://www.youtube.com/@planet-wild',
    license: 'embed',
    fixedCategories: ['nature'],
  },
  {
    id: 'ocean-cleanup',
    name: 'The Ocean Cleanup',
    kind: 'video',
    feedUrl: youtubeFeed('UCYXGHivsMPVU-h-M_wd9m3Q'),
    homepage: 'https://www.youtube.com/@theoceancleanup',
    license: 'embed',
    fixedCategories: ['oceans'],
  },
  {
    id: 'mossyearth',
    name: 'Mossy Earth',
    kind: 'video',
    feedUrl: youtubeFeed('UC1OLx7nzJgIqwpDzFFrTuLA'),
    homepage: 'https://www.youtube.com/@MossyEarth',
    license: 'embed',
    fixedCategories: ['nature'],
    fixedTone: 'celebration',
  },
  {
    id: 'ecosia',
    name: 'Ecosia',
    kind: 'video',
    feedUrl: youtubeFeed('UC1_up347GdfKBDVGqwjt7Aw'),
    homepage: 'https://youtube.com/@ecosia',
    license: 'embed',
    fixedCategories: ['climate'],
  },
  {
    id: 'just-have-a-think',
    name: 'Just Have a Think',
    kind: 'video',
    feedUrl: youtubeFeed('UCRBwLPbXGsI2cJe9W1zfSjQ'),
    homepage: 'https://youtube.com/@justhaveathink',
    license: 'embed',
    fixedCategories: ['climate'],
    fixedTone: 'reflection',
  },
  {
    id: 'mossyearth-fieldnotes',
    name: 'Mossy Earth Field Notes',
    kind: 'video',
    feedUrl: youtubeFeed('UC_ZzIu99sCDtldbiSxOt00Q'),
    homepage: 'https://youtube.com/@mossyearth-fieldnotes',
    license: 'embed',
  },
  {
    id: 'positive-news-yt',
    name: 'Positive News',
    kind: 'video',
    feedUrl: youtubeFeed('UCv7ceR0qBvB3cG2LRh96v3Q'),
    homepage: 'https://youtube.com/@positive-news',
    license: 'embed',
    fixedCategories: ['hope', 'tomorrow'],
    fixedTone: 'celebration',
  },
  {
    id: 'going-green',
    name: 'Going Green',
    kind: 'video',
    feedUrl: youtubeFeed('UCNsvLV955XWEgKUfkDVbtpg'),
    homepage: 'https://youtube.com/@goinggreenofficial',
    license: 'embed',
    fixedCategories: ['climate'],
  },
  {
    id: 'andrew-millison',
    name: 'Andrew Millison',
    kind: 'video',
    feedUrl: youtubeFeed('UCgb_TbreMgfDdLKkr4yYJHw'),
    homepage: 'https://youtube.com/@amillison',
    license: 'embed',
    fixedCategories: ['climate'],
  },
  {
    id: 'climate-adam',
    name: 'ClimateAdam',
    kind: 'video',
    feedUrl: youtubeFeed('UCCu5wtZ5uOWZp_roz7wHPfg'),
    homepage: 'https://youtube.com/@climateadam',
    license: 'embed',
    fixedCategories: ['climate'],
    fixedTone: 'reflection',
  },
  {
    id: 'leave-curious',
    name: 'Leave Curious',
    kind: 'video',
    feedUrl: youtubeFeed('UCMrYUtfJiZHN3iJKqrd8UhQ'),
    homepage: 'https://youtube.com/@leavecurious',
    license: 'embed',
    fixedCategories: ['nature'],
  },
  {
    id: 'arbordayfoundation',
    name: 'Arbor Day Foundation',
    kind: 'video',
    feedUrl: youtubeFeed('UCaUfpc8WmwJWQqzRupURzRw'),
    homepage: 'https://youtube.com/@arbordayfoundation',
    license: 'embed',
    fixedCategories: ['nature'],
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
  /* ---------- Remvoved: too spammy or didn't fit Bright✦Side's tone ---------- */
  {
    id: 'nasa',
    name: 'NASA',
    kind: 'article',
    feedUrl: 'https://www.nasa.gov/news-release/feed/',
    homepage: 'https://www.nasa.gov',
    license: 'cc',
    rules: 'US government work, free to use with credit. Never use the NASA insignia/logo.',
    fixedCategories: ['science', 'hope'],
    enabled: false,
  },
];
