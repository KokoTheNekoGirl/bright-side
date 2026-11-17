import type { MoonTheme } from '@/lib/moon';
import { keywordMatcher } from './match';

/*
 * Private editorial tone. Never shown on the page; it decides which posts
 * are featured on the home page for the current moon.
 *
 *   reflection   → serious / somber news (progress doesn't happen without setbacks)
 *   growth       → emerging: pilots, launches, early research
 *   appreciation → effort: volunteers, long-running work, communities
 *   celebration  → success stories
 */
export type Tone = 'reflection' | 'growth' | 'celebration' | 'appreciation';

/** Which tone each moon theme features. */
export const THEME_TONE: Record<MoonTheme, Tone> = {
  grow: 'growth',
  appreciate: 'appreciation',
  celebrate: 'celebration',
  blue: 'celebration',
  reflect: 'reflection',
  eclipse: 'reflection',
};

/*
 * Turnarounds: a "bad" word that's actually good news, e.g.
 * "dire wolves brought back from extinction", "tigers no longer endangered",
 * "polar ice caps stopped melting". These are matched FIRST, counted as
 * celebration, then removed so the bad word inside isn't counted as reflection.
 */
const W = String.raw`(?:\w+\s+){0,3}?`; // up to 3 words in between

const TURNAROUNDS: RegExp[] = [
  // back from extinction / saved from the brink / off the brink
  new RegExp(String.raw`\b(?:back|returns?|returned|saved|rescued|pulled)\s+from\s+(?:the\s+)?(?:brink|edge)?(?:\s+of)?\s*(?:extinction|collapse)?`, 'gi'),
  /\boff\s+the\s+(?:brink|endangered\s+(?:species\s+)?list)\b/gi,
  // no longer endangered / not extinct after all
  /\b(?:no\s+longer|not|never)\s+(?:considered\s+|listed\s+as\s+|classed\s+as\s+)?(?:critically\s+)?(?:endangered|threatened|extinct|declining|at\s+risk)\b/gi,
  // removed from the endangered list / downlisted
  new RegExp(String.raw`\b(?:removed|delisted|downlisted)\s+${W}(?:endangered|threatened)?`, 'gi'),
  // stopped melting / halted deforestation / reversed the decline
  new RegExp(String.raw`\b(?:stop(?:s|ped)?|halt(?:s|ed)?|reverse[sd]?|slow(?:s|ed)?|curb(?:s|ed)?|end(?:s|ed)?|cuts?|beat(?:s|en)?|defeat(?:s|ed)?|prevent(?:s|ed)?)\s+${W}(?:melting|declines?|declining|loss(?:es)?|deforestation|emissions|extinction|poaching|pollution)\b`, 'gi'),
  // deforestation falls / emissions drop / decline halted
  new RegExp(String.raw`\b(?:declines?|loss(?:es)?|deforestation|emissions|poaching|pollution|melting)\s+${W}(?:falls?|fell|drops?|dropped|slows?|slowed|halts?|halted|stops?|stopped|reversed|plummet(?:s|ed)?|ends?|ended)\b`, 'gi'),
  // rediscovered / thought extinct / de-extinction
  /\b(?:rediscover\w*|thought\s+(?:to\s+be\s+)?extinct|presumed\s+extinct|de-extinct\w*)\b/gi,
];

/*
 * Setbacks: phrases containing a "good" word that are actually bad news,
 * e.g. "record loss", "record heat". Counted as reflection, then removed.
 */
const SETBACKS: RegExp[] = [
  /\brecord[-\s](?:loss(?:es)?|lows?|heat|temperatures?|droughts?|fires?|wildfires?|floods?|melt(?:ing)?)\b/gi,
  /\b(?:worst|deadliest|hottest)\s+(?:\w+\s+){0,2}?(?:ever|on\s+record|in\s+(?:a\s+)?(?:decade|century|history))\b/gi,
  /\b(?:fails?|failed|failing)\s+to\s+(?:recover|protect|save|restore)\b/gi,
];

/* Keyword rules: whole words, * = starts with (see match.ts) */
const KEYWORDS: Record<Tone, string[]> = {
  reflection: [
    'extinct', 'extinction', 'declin*', 'setback*', 'threat*', 'endangered', 'record loss', 'loss', 'losses',
    'crisis', 'warning*', 'struggl*', 'fail*', 'lost', 'shrink*', 'drought*', 'flood*', 'wildfire*',
    'sentenced', 'traffick*', 'poach*', 'illegal*', 'pollut*', 'collapse*', 'deforestation', 'melting', 'mourn*',
  ],
  celebration: [
    'recover*', 'restor*', 'saved', 'saves', 'milestone*', 'success*', 'successfully', 'record', 'breakthrough*',
    'wins', 'won', 'victory', 'achiev*', 'return*', 'rebound*', 'thriv*', 'flourish*', 'approved', 'protected',
    'ban', 'bans', 'banned', 'comeback', 'first ever', 'celebrat*', 'triumph*',
  ],
  growth: [
    'pilot*', 'launch*', 'new initiative', 'develop*', 'plan', 'plans', 'proposal*', 'proposed', 'trial*',
    'testing', 'begins', 'starts', 'emerging', 'could', 'early', 'promising', 'aims', 'prototype*', 'study', 'studies',
  ],
  appreciation: [
    'volunteer*', 'decades', 'years of work', 'ongoing', 'community support', 'effort*', 'dedicat*', 'tireless*',
    'champion*', 'thank*', 'honour*', 'honor*', 'caretaker*', 'ranger*', 'guardian*', 'grassroots', 'community-led',
    'led by', 'helped', 'helping', 'teamed up', 'together',
  ],
};

/** If scores tie, the earlier tone wins. Reflection is last so it only wins outright. */
const TIE_ORDER: Tone[] = ['celebration', 'appreciation', 'growth', 'reflection'];

const MATCHERS = Object.fromEntries(
  Object.entries(KEYWORDS).map(([tone, kws]) => [tone, keywordMatcher(kws)]),
) as Record<Tone, RegExp>;

/** A turnaround or setback phrase outweighs single keywords. */
const PHRASE_WEIGHT = 3;

function scoreText(text: string): Record<Tone, number> {
  const scores: Record<Tone, number> = { reflection: 0, growth: 0, celebration: 0, appreciation: 0 };

  // Count turnarounds (celebration) and setbacks (reflection), then blank them out
  let rest = text;
  const phrases: [RegExp[], Tone][] = [[TURNAROUNDS, 'celebration'], [SETBACKS, 'reflection']];
  for (const [list, tone] of phrases) {
    for (const re of list) {
      rest = rest.replace(re, (m) => {
        if (m.trim()) scores[tone] += PHRASE_WEIGHT;
        return ' ';
      });
    }
  }

  for (const tone of TIE_ORDER) scores[tone] += rest.match(MATCHERS[tone])?.length ?? 0;
  return scores;
}

/**
 * Picks a post's tone. Title counts double. Defaults to growth when nothing matches.
 * Override any post by URL in curation.ts.
 */
export function classifyTone(title: string, description = ''): Tone {
  const t = scoreText(title);
  const d = scoreText(description);

  let best: Tone = 'growth';
  let bestScore = 0;
  for (const tone of TIE_ORDER) {
    const score = t[tone] * 2 + d[tone];
    if (score > bestScore) {
      best = tone;
      bestScore = score;
    }
  }
  return best;
}

/** New moon or eclipse: the somber side of the site. */
export const isReflectionTheme = (theme: MoonTheme) => THEME_TONE[theme] === 'reflection';

/** /news heading per moon: underlined subheading + title. */
export const NEWS_HEADING: Record<MoonTheme, { subheading: string; title: string }> = {
  grow: { subheading: 'Growth', title: 'Good News' },
  celebrate: { subheading: 'Celebrate', title: 'Good News' },
  appreciate: { subheading: 'Appreciate', title: 'Good News' },
  blue: { subheading: 'Rejoice', title: 'Good News' },
  reflect: { subheading: 'Reflection', title: 'Somber News' },
  eclipse: { subheading: 'Reflect Deeply', title: 'Somber News' },
};
