import { keywordMatcher } from './match';

/*
 * Bright Side categories.
 *
 * `keywords` drive the auto-categoriser (matched against title, excerpt
 * and the feed's own tags). Keywords match whole words (plurals included);
 * end one with * to match any word starting with it, e.g. 'restor*'.
 *
 * Two are "general" categories with their own rules (see categorise()):
 *   hope     → sparks of hope: general feel-good, no specific focus
 *   tomorrow → a better tomorrow: impact on the future (laws, bans, climate
 *              action, protests that win) OR a story spanning 3+ topics
 *
 * 'graphic' is special: never auto-scored here. It's added (always first)
 * to somber posts with sensitive content. See content.ts.
 */

export type CategoryId =
  | 'animals'
  | 'people'
  | 'science'
  | 'hope'
  | 'tomorrow'
  | 'nature'
  | 'climate'
  | 'health'
  | 'oceans'
  | 'graphic';

/** Colour family, used as data-color on the tag for styling. */
export type CategoryColor = 'orange' | 'yellow' | 'green' | 'blue' | 'red';

export interface Category {
  id: CategoryId;
  label: string;
  color: CategoryColor;
  keywords: string[];
}

export const CATEGORIES: Record<CategoryId, Category> = {
  animals: {
    id: 'animals',
    label: 'animals & wildlife',
    color: 'orange',
    keywords: ['wildlife', 'animal', 'species', 'bird', 'turtle', 'elephant', 'tiger', 'wolf', 'wolves', 'bear', 'bison', 'rhino', 'primate', 'monkey', 'ape', 'orangutan', 'lemur', 'bee', 'butterfl*', 'frog', 'rediscover*', 'endangered', 'rewild*', 'pets', 'dog', 'cat', 'pangolin'],
  },
  people: {
    id: 'people',
    label: 'people & communities',
    color: 'orange',
    keywords: ['community', 'communities', 'neighbour*', 'neighbor*', 'volunteer*', 'indigenous', 'school', 'students', 'teacher', 'housing', 'refugee', 'family', 'families', 'village', 'villager*', 'town', 'residents', 'locals'],
  },
  science: {
    id: 'science',
    label: 'science & innovation',
    color: 'yellow',
    keywords: ['scientist', 'research*', 'study', 'studies', 'discover*', 'breakthrough', 'invent*', 'innovat*', 'technology', 'engineer*', 'space', 'nasa', 'telescope', 'robot*', 'battery', 'batteries', 'genetic*', 'clinical trial', 'lab'],
  },
  hope: {
    id: 'hope',
    label: 'sparks of hope',
    color: 'yellow',
    keywords: ['kindness', 'kind-hearted', 'stranger*', 'heartwarming', 'faith in humanity', 'good deed*', 'generous', 'generosity', 'surprise*', 'reunit*', 'reunion*', 'rescue*', 'hero*', 'joy', 'smile*', 'gift*', 'donat*', 'hope', 'hopeful', 'inspir*', 'celebrat*', 'random act*'],
  },
  tomorrow: {
    id: 'tomorrow',
    label: 'a better tomorrow',
    color: 'yellow',
    keywords: ['law', 'lawmaker*', 'legislat*', 'bill', 'policy', 'policies', 'ban', 'banned', 'protest*', 'campaign*', 'vote', 'voted', 'voters', 'court', 'ruling', 'treaty', 'agreement', 'pledge*', 'government*', 'council*', 'parliament', 'senate', 'mayor', 'reform*', 'rights', 'justice', 'future', 'generations', 'climate action'],
  },
  nature: {
    id: 'nature',
    label: 'nature & ecosystems',
    color: 'green',
    keywords: ['forest', 'tree', 'reforest*', 'restor*', 'ecosystem', 'habitat', 'park', 'protected area', 'wetland', 'river', 'grassland', 'biodiversity', 'garden', 'soil', 'rainforest', 'mangrove', 'nature'],
  },
  climate: {
    id: 'climate',
    label: 'climate action',
    color: 'green',
    keywords: ['climate', 'carbon', 'emission', 'renewable', 'solar', 'wind power', 'wind farm', 'electric', 'ev', 'fossil', 'coal', 'net zero', 'clean energy', 'heat pump', 'recycl*', 'plastic'],
  },
  health: {
    id: 'health',
    label: 'health & wellbeing',
    color: 'green',
    keywords: ['health', 'wellbeing', 'well-being', 'mental', 'disease', 'vaccine', 'cancer', 'medicine', 'medical', 'hospital', 'patients', 'treatment', 'cure', 'nutrition', 'happiness', 'loneliness'],
  },
  oceans: {
    id: 'oceans',
    label: 'oceans & marine life',
    color: 'blue',
    keywords: ['ocean', 'sea', 'marine', 'coral', 'reef', 'whale', 'dolphin', 'shark', 'fish', 'seagrass', 'coast', 'beach', 'turtle', 'manatee', 'kelp'],
  },
  graphic: {
    id: 'graphic',
    label: 'graphic content',
    color: 'red',
    keywords: [],
  },
};

/** Topic-specific categories (everything except the general ones and 'graphic'). */
const SPECIFIC: CategoryId[] = ['animals', 'people', 'science', 'nature', 'climate', 'health', 'oceans'];
const GENERAL: CategoryId[] = ['hope', 'tomorrow'];

const MATCHERS = Object.fromEntries(
  [...SPECIFIC, ...GENERAL].map((id) => [id, keywordMatcher(CATEGORIES[id].keywords)]),
) as Record<CategoryId, RegExp>;

/** Second category only if it scores at least this share of the first… */
const SECOND_RATIO = 1 / 3;
/** …and a topic only "counts" with at least this score (one title hit, or two in the text). */
const MIN_SCORE = 2;

/**
 * Picks 1–2 categories for a post (title hits count double).
 *  - Nothing topic-specific matched → sparks of hope (or a better tomorrow if that matched more)
 *  - 3+ topics each scoring MIN_SCORE → a better tomorrow + the strongest topic
 *  - Otherwise the best 1–2 matches
 */
export function categorise({ title, text, tags }: { title: string; text: string; tags: string[] }): CategoryId[] {
  const body = `${text} ${tags.join(' ')}`;
  const count = (re: RegExp, str: string) => str.match(re)?.length ?? 0;
  const score = (id: CategoryId) => count(MATCHERS[id], title) * 2 + count(MATCHERS[id], body);

  const rank = (ids: CategoryId[]) =>
    ids
      .map((id) => ({ id, score: score(id) }))
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score);

  const specific = rank(SPECIFIC);
  const general = rank(GENERAL);

  // General story: no specific topic
  if (!specific.length) return [general[0]?.id ?? 'hope'];

  // Everything coming together: 3+ topics with real weight
  if (specific.filter((c) => c.score >= MIN_SCORE).length >= 3) return ['tomorrow', specific[0].id];

  const [first, second] = rank([...SPECIFIC, ...GENERAL]);
  return second && second.score >= MIN_SCORE && second.score >= first.score * SECOND_RATIO
    ? [first.id, second.id]
    : [first.id];
}
