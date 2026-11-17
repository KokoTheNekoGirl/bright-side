import { keywordMatcher } from './match';

/*
 * Bright✦Side categories.
 *
 * `keywords` drive the auto-categoriser (matched against title, excerpt
 * and the feed's own tags). Keywords match whole words (plurals included);
 * end one with * to match any word starting with it, e.g. 'restor*'.
 *
 * Two are "general" categories with their own rules (see categorise()):
 *   hope     → sparks of hope: general feel-good, no specific focus
 *   tomorrow → a brighter tomorrow: impact on the future (laws, bans, climate
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
    keywords: [
      'wildlife', 'animal', 'species', 'fauna', 'mammal*', 'reptile*', 'amphibian*', 'insect*', 'pollinator*',
      'bird', 'birdlife', 'songbird*', 'raptor*', 'owl', 'eagle', 'vulture', 'parrot', 'hornbill', 'crane', 'stork',
      'penguin', 'turtle', 'tortoise*', 'elephant', 'tiger', 'lion', 'leopard', 'jaguar', 'cheetah', 'lynx',
      'wolf', 'wolves', 'fox', 'foxes', 'bear', 'bison', 'buffalo', 'rhino', 'giraffe', 'zebra', 'gorilla',
      'chimpanzee', 'chimp', 'primate', 'monkey', 'ape', 'orangutan', 'lemur', 'panda', 'koala', 'kangaroo',
      'deer', 'elk', 'moose', 'caribou', 'reindeer', 'beaver*', 'otter', 'hedgehog', 'bat', 'bats', 'pangolin',
      'bee', 'bees', 'bumblebee*', 'butterfl*', 'moth', 'moths', 'frog', 'toad', 'snake', 'lizard', 'crocodile*',
      'cub*', 'calves', 'hatchling*', 'nesting', 'breeding', 'herd*', 'flock*', 'sanctuar*',
      'rediscover*', 'endangered', 'rewild*', 'reintroduc*', 'pets', 'dog', 'cat',
    ],
  },
  people: {
    id: 'people',
    label: 'people & communities',
    color: 'orange',
    keywords: ['community', 'communities', '*together', 'neighbour*', 'neighbor*', 'volunteer*', 'indigenous', 'school', 'students', 'teacher', 'housing', 'refugee', 'family', 'families', 'village', 'villager*', 'town', 'residents', 'locals'],
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
    label: 'a brighter tomorrow',
    color: 'yellow',
    keywords: ['law', 'lawmaker*', 'legislat*', 'bill', 'policy', 'policies', 'ban', 'banned', 'protest*', 'campaign*', 'vote', 'voted', 'voters', 'court', 'ruling', 'treaty', 'agreement', 'pledge*', 'government*', 'council*', 'parliament', 'senate', 'mayor', 'reform*', 'rights', 'justice', 'future', 'generations', 'climate action'],
  },
  nature: {
    id: 'nature',
    label: 'nature & ecosystems',
    color: 'green',
    keywords: ['forest', 'tree', 'reforest*', 'restor*', 'ecosystem', 'habitat', 'park', 'protected area', 'wetland', 'river', 'grassland', 'biodiversity', 'garden', 'soil', 'rainforest', 'mangrove', 'nature', 'the amazon', 'amazonia', 'amazonian', 'amazon basin', 'amazon river', 'amazon rainforest', 'brazilian amazon', 'peruvian amazon', 'colombian amazon', 'ecuadorian amazon', 'bolivian amazon'],
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
    keywords: [
      'ocean', 'sea', 'seas', 'marine', 'high seas', 'deep sea', 'seabed', 'coral', 'reef', 'whale',
      'dolphin', 'porpoise*', 'seals', 'sea lion*', 'walrus*', 'shark', 'manta*', 'octopus*', 'squid',
      'jellyfish', 'seahorse*', 'sea turtle*', 'fish', 'fisher*', 'fishing', 'fisheries', 'overfish*', 'bycatch',
      'seagrass', 'seaweed', 'kelp', 'plankton', 'coast*', 'beach', 'shore*', 'tide', 'tides', 'tidal',
      'estuar*', 'lagoon*', 'salt marsh*', 'mangrove', 'manatee', 'dugong*', 'blue carbon', 'marine protected area*',
    ],
  },
  graphic: {
    id: 'graphic',
    label: 'graphic content',
    color: 'red',
    keywords: [],
  },
};

/** Order of the filter buttons on /news (graphic isn't filterable). */
export const FILTER_CATEGORIES: CategoryId[] = [
  'animals', 'people', 'science', 'hope', 'tomorrow', 'nature', 'climate', 'health', 'oceans',
];

export const categoryHref = (id: CategoryId | 'featured') => `/news/category/${id}`;

/** Topic-specific categories (everything except the general ones and 'graphic'). */
const SPECIFIC: CategoryId[] = ['animals', 'people', 'science', 'nature', 'climate', 'health', 'oceans'];
const GENERAL: CategoryId[] = ['hope', 'tomorrow'];

const MATCHERS = Object.fromEntries(
  [...SPECIFIC, ...GENERAL].map((id) => [id, keywordMatcher(CATEGORIES[id].keywords)]),
) as Record<CategoryId, RegExp>;

/** Full-article text counts at this weight (title 2, excerpt/description and tags 1). */
const BODY_WEIGHT = 0.5;

/** Second category only if it scores at least this share of the first… */
const SECOND_RATIO = 1 / 3;
/** …and a topic only "counts" with at least this score (one title hit, or two in the text). */
const MIN_SCORE = 2;
/** For "a better tomorrow": each of the 3+ topics must score at least this share of the top one. */
const TOMORROW_RATIO = 1 / 4;

interface CategoriseInput {
  title: string;
  /** Excerpt or video description */
  text: string;
  /** Start of the full article, when the feed has it */
  body?: string;
  tags: string[];
}

/*
 * Underwater "forests" and "meadows" are ocean habitats, not land ones.
 * Rewritten to "ocean" before scoring so they count for oceans, not nature.
 */
const MARINE_HABITATS =
  /\b(?:kelp|underwater|seaweed|seagrass|sea\s+grass|coral|eelgrass)\s+(?:forests?|meadows?|gardens?|beds?)\b|\bmarine\s+(?:re)?forest\w*|\bblue\s+forests?\b/gi;
const normalise = (s: string) => s.replace(MARINE_HABITATS, ' ocean ');

function scorer(input: CategoriseInput) {
  const title = normalise(input.title);
  const body = normalise(input.body ?? '');
  const rest = normalise(`${input.text} ${input.tags.join(' ')}`);
  const count = (re: RegExp, str: string) => str.match(re)?.length ?? 0;
  const score = (id: CategoryId) =>
    count(MATCHERS[id], title) * 2 + count(MATCHERS[id], rest) + count(MATCHERS[id], body) * BODY_WEIGHT;

  return (ids: CategoryId[]) =>
    ids
      .map((id) => ({ id, score: score(id) }))
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score);
}

/**
 * Picks 1–2 categories for a post.
 *  - Nothing topic-specific matched → sparks of hope (or a better tomorrow if that matched more)
 *  - 3+ comparable topics (each ≥ MIN_SCORE and ≥ ¼ of the top) → a better tomorrow + the strongest
 *  - Otherwise the best 1–2 matches
 */
export function categorise(input: CategoriseInput): CategoryId[] {
  const rank = scorer(input);
  const specific = rank(SPECIFIC);
  const general = rank(GENERAL);

  // General story: no specific topic
  if (!specific.length) return [general[0]?.id ?? 'hope'];

  // Everything coming together: 3+ comparable topics (a passing mention doesn't count)
  const top = specific[0].score;
  const strong = specific.filter((c) => c.score >= MIN_SCORE && c.score >= top * TOMORROW_RATIO);
  if (strong.length >= 3) return ['tomorrow', specific[0].id];

  const [first, second] = rank([...SPECIFIC, ...GENERAL]);
  return second && second.score >= MIN_SCORE && second.score >= first.score * SECOND_RATIO
    ? [first.id, second.id]
    : [first.id];
}

/**
 * For sources with one fixed category: the best *other* category for this
 * specific post, or null if nothing scores at least MIN_SCORE.
 */
export function bestOtherCategory(input: CategoriseInput, exclude: CategoryId): CategoryId | null {
  const match = scorer(input)([...SPECIFIC, ...GENERAL]).find((c) => c.id !== exclude && c.score >= MIN_SCORE);
  return match?.id ?? null;
}
