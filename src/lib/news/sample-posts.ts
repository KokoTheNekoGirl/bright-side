import type { Post } from './get-posts';

/*
 * Placeholder posts for styling (NEWS_PREVIEW=sample). Not real articles.
 * 45 posts so pagination has 3 pages. Includes videos and a graphic post. Dates are relative to today so the
 * home page features always have something for every tone.
 */

type Template = Pick<Post, 'title' | 'excerpt' | 'categories' | 'tone'> &
  Partial<Pick<Post, 'kind' | 'videoId' | 'graphic'>> & { source: Post['source'] };

const MONGABAY = { id: 'mongabay', name: 'Mongabay', homepage: 'https://news.mongabay.com', license: 'cc' } as const;
const RTBC = { id: 'rtbc', name: 'Reasons to be Cheerful', homepage: 'https://reasonstobecheerful.world', license: 'cc' } as const;
const MIT = { id: 'mit-news', name: 'MIT News', homepage: 'https://news.mit.edu', license: 'cc' } as const;
const OCEAN = { id: 'ocean-cleanup', name: 'The Ocean Cleanup', homepage: 'https://www.youtube.com/@theoceancleanup', license: 'embed' } as const;
const WILD = { id: 'planet-wild', name: 'Planet Wild', homepage: 'https://www.youtube.com/@planet-wild', license: 'embed' } as const;
/** YouTube's own API demo video, used as a stand-in so thumbnails load. */
const DEMO_VIDEO = 'M7lc1UVf-VE';

const TEMPLATES: Template[] = [
  { title: 'endangered sea turtles return to restored beach', excerpt: 'Conservation efforts have helped sea turtles return to a previously damaged nesting habitat.', categories: ['animals', 'oceans'], tone: 'celebration', source: MONGABAY },
  { title: 'city launches pilot for free night buses', excerpt: 'A six-month trial will test whether late-night service gets shift workers home safer.', categories: ['people', 'tomorrow'], tone: 'growth', source: RTBC },
  { title: 'volunteers mark 20 years of river clean-ups', excerpt: 'What started as one weekend a year is now a year-round effort with hundreds of neighbours.', categories: ['people', 'nature'], tone: 'appreciation', source: MIT },
  { title: 'coral reefs face a hard year, but scientists see a path forward', excerpt: 'Bleaching hit hard this season. Researchers say heat-tolerant corals offer a reason to keep going.', categories: ['oceans', 'science'], tone: 'reflection', source: MONGABAY },
  { title: 'town swaps its last coal plant for a community solar farm', excerpt: 'Residents now co-own the panels that power their homes, and the savings fund a new youth centre.', categories: ['climate', 'people'], tone: 'celebration', source: RTBC },
  { title: 'new low-cost test could spot eye disease years earlier', excerpt: 'A phone-based scan could bring early screening to clinics without specialist equipment.', categories: ['health', 'science'], tone: 'growth', source: MIT },
  { title: 'meet the rangers guarding the last old-growth valley', excerpt: 'Their tireless patrols have kept loggers out for over a decade.', categories: ['nature', 'people'], tone: 'appreciation', source: MONGABAY },
  { title: 'monarch numbers dip again, renewing calls for milkweed corridors', excerpt: 'A tough count this winter, and a clear ask: plant more native milkweed.', categories: ['animals', 'nature'], tone: 'reflection', source: RTBC },
  { title: 'river cleanup crews mark a record year', excerpt: '', categories: ['oceans', 'tomorrow'], tone: 'appreciation', source: OCEAN, kind: 'video', videoId: DEMO_VIDEO },
  { title: 'rewilding a valley, one beaver dam at a time', excerpt: '', categories: ['nature', 'tomorrow'], tone: 'growth', source: WILD, kind: 'video', videoId: DEMO_VIDEO },
  { title: 'rhino carcasses found as poaching surge hits reserve', excerpt: 'Rangers discovered dead rhinos this week; the reserve is asking for help funding patrols.', categories: ['graphic', 'animals'], tone: 'reflection', source: MONGABAY, graphic: true },
];

const DAY_MS = 86_400_000;

export const SAMPLE_POSTS: Post[] = Array.from({ length: 45 }, (_, i) => {
  const t = TEMPLATES[i % TEMPLATES.length];
  // First round: every 12 hours (so every template is in the current cycle). Then one every 8 days.
  const n = TEMPLATES.length;
  const daysAgo = i < n ? i / 2 : n + (i - n) * 8;
  return {
    kind: 'article' as const,
    videoId: null,
    graphic: false,
    ...t,
    id: `sample-${i + 1}`,
    title: i < TEMPLATES.length ? t.title : `${t.title} (${i + 1})`,
    url: `https://example.com/sample-${i + 1}`,
    date: new Date(Date.now() - daysAgo * DAY_MS),
    author: null,
    pinned: false,
    canEmbed: false,
    contentHtml: null,
  };
});
