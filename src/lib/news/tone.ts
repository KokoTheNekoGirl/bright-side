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
  // protective action: save at-risk wetland / help endangered turtles / protect threatened forest
  new RegExp(String.raw`\b(?:save[sd]?|saving|protect(?:s|ed|ing)?|rescue[sd]?|rescuing|help(?:s|ed|ing)?|shelter(?:s|ed|ing)?|safeguard(?:s|ed|ing)?)\s+${W}(?:at[\s-]risk|endangered|threatened|vulnerable|struggling)\b`, 'gi'),
  // …and the other way round: threatened frogs saved / endangered turtles return / at-risk reef rebounds
  new RegExp(String.raw`\b(?:at[\s-]risk|endangered|threatened|vulnerable)\s+${W}(?:saved|protected|rescued|recover(?:s|ed|ing)?|returns?|returned|thriv(?:e|es|ed|ing)|rebound(?:s|ed)?|bounce[sd]?\s+back)\b`, 'gi'),
  // El Niño ends / La Niña fades / El Niño weakening
  new RegExp(String.raw`\b(?:el|la)\s+ni[ñn][oa]s?\s+${W}(?:ends?|ended|ending|fades?|faded|fading|weakens?|weakened|weakening|eases?|eased|easing)\b`, 'gi'),
  // "El Niño is over" (only directly after, so "El Niño pushes the Amazon over the edge" isn't caught)
  /\b(?:el|la)\s+ni[ñn][oa]s?\s+(?:is\s+|has\s+)?(?:finally\s+|officially\s+)?(?:over|gone|done)\b/gi,
  // positive tipping points (a hopeful idea, not a warning)
  /\b(?:positive|social|good|green)\s+tipping\s+points?\b/gi,
  // rediscovered / thought extinct / de-extinction
  /\b(?:rediscover\w*|thought\s+(?:to\s+be\s+)?extinct|presumed\s+extinct|de-extinct\w*)\b/gi,
];

/*
 * Setbacks: phrases that signal somber news, including ones containing a
 * "good" word ("record loss", "record heat"). Counted as reflection, then removed.
 */
const SETBACKS: RegExp[] = [
  /\brecord[-\s](?:loss(?:es)?|lows?|heat|temperatures?|droughts?|fires?|wildfires?|floods?|melt(?:ing)?)\b/gi,
  /\b(?:worst|deadliest|hottest)\s+(?:\w+\s+){0,2}?(?:ever|on\s+record|in\s+(?:a\s+)?(?:decade|century|history))\b/gi,
  /\b(?:fails?|failed|failing)\s+to\s+(?:recover|protect|save|restore)\b/gi,
  // at risk / under threat / on the brink (turnarounds like "back from the brink" are removed first)
  /\b(?:at[\s-]risk|under\s+threat|on\s+the\s+brink|in\s+danger|running\s+out|race\s+against\s+time)\b/gi,
  /\b(?:sounds?|sounded|raises?|raised)\s+(?:the\s+)?alarm\b/gi,
  /\b(?:climate|biodiversity|housing|water|mental\s+health)\s+crisis\b/gi,
  // El Niño / La Niña (with or without the ñ, plural too)
  /\b(?:el|la)\s+ni[ñn][oa]s?\b/gi,
  // tipping points: over the edge / past the point of no return / tipping point
  /\b(?:over|off|past|to)\s+the\s+edge\b|\bpoints?\s+of\s+no\s+return\b|\btipping\s+points?\b|\bpast\s+the\s+point\b/gi,
  // state of emergency / climate emergency / declares an emergency
  /\b(?:states?\s+of\s+emergency|(?:climate|nature|biodiversity|public\s+health|national)\s+emergenc(?:y|ies)|declar(?:es?|ed|ing)\s+(?:an?\s+)?emergency)\b/gi,
];
/*
 * Neutral: phrases with a somber-looking word that are just a job, place or
 * thing ("emergency responders", "emergency room"). Removed before scoring,
 * so the rest of the headline decides the tone.
 */
const NEUTRAL: RegExp[] = [
  /\bemergency\s+(?:rooms?|departments?|services?|responders?|workers?|crews?|teams?|vets?|veterinar\w*|care|medicine|kits?|plans?|preparedness|shelters?|numbers?|lines?|vehicles?|calls?|exits?)\b/gi,
];

/* Keyword rules: whole words, * = starts with (see match.ts) */
const KEYWORDS: Record<Tone, string[]> = {
  reflection: [
    'extinct', 'extinction', 'declin*', 'setback*', 'threat*', 'endangered', 'record loss', 'loss', 'losses',
    'crisis', 'crises', 'warning*', 'warn', 'warns', 'warned', 'struggl*', 'fail*', 'lost', 'shrink*', 'drought*',
    'flood*', 'wildfire*', 'heatwave*', 'sentenced', 'traffick*', 'poach*', 'illegal*', 'pollut*', 'collapse*',
    'deforestation', 'melting', 'mourn*', 'disaster*', 'emergency', 'emergencies', 'shortage*', 'conflict*', 'displac*',
    'damag*', 'destroy*', 'destruction', 'devastat*', 'catastroph*', 'toxic', 'contaminat*', 'outbreak*',
    'vulnerable', 'urgent*', 'alarm*', 'grim', 'scarc*', 'die-off*', 'bleach*', 'erosion', 'overfish*',
    'invasive', 'degrad*', 'risk', 'risks', 'concern*', 'worsen*', 'dire', 'tragic', 'tragedy','ugly truth',
  ],
  celebration: [
    'recover*', 'restor*', 'saved', 'saves', 'milestone*', 'success*', 'successfully', 'record', 'breakthrough*',
    'wins', 'won', 'victory', 'achiev*', 'return*', 'rebound*', 'thriv*', 'flourish*', 'approved', 'protected',
    'ban', 'bans', 'banned', 'comeback', 'first ever', 'celebrat*', 'triumph*', 'save', 'saving',
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

/** Scoring order (also the tie order between the positive tones). */
const TIE_ORDER: Tone[] = ['celebration', 'appreciation', 'growth', 'reflection'];

const MATCHERS = Object.fromEntries(
  Object.entries(KEYWORDS).map(([tone, kws]) => [tone, keywordMatcher(kws)]),
) as Record<Tone, RegExp>;

/** A turnaround or setback phrase outweighs single keywords. */
const PHRASE_WEIGHT = 3;

function scoreText(text: string): Record<Tone, number> {
  const scores: Record<Tone, number> = { reflection: 0, growth: 0, celebration: 0, appreciation: 0 };

  // Blank out neutral phrases, then count turnarounds (celebration) and setbacks (reflection) and blank those too
  let rest = text;
  for (const re of NEUTRAL) rest = rest.replace(re, ' ');
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

/** Full-article text counts at this weight (title 2, excerpt/description 1). */
const BODY_WEIGHT = 0.5;
/** Reflection needs at least this score, then wins ties against the positive tones. */
const REFLECTION_MIN = 2;

/**
 * Picks a post's tone from the title (×2), excerpt or video description (×1)
 * and, when the feed has it, the start of the full article (×0.5).
 * Reflection wins when it scores at least REFLECTION_MIN and ties or beats
 * every positive tone; otherwise the best positive tone wins.
 * Defaults to celebration when nothing matches. Override any post in curation.ts.
 */
export function classifyTone(title: string, description = '', body = ''): Tone {
  const t = scoreText(title);
  const d = scoreText(description);
  const b = scoreText(body);
  const total = (tone: Tone) => t[tone] * 2 + d[tone] + b[tone] * BODY_WEIGHT;

  let best: Tone = 'celebration';
  let bestScore = 0;
  for (const tone of ['celebration', 'appreciation', 'growth'] as const) {
    if (total(tone) > bestScore) {
      best = tone;
      bestScore = total(tone);
    }
  }

  const somber = total('reflection');
  return somber >= REFLECTION_MIN && somber >= bestScore ? 'reflection' : best;
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
