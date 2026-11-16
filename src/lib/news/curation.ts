import type { CategoryId } from './categories';
import type { Tone } from './tone';

/*
 * Hand curation, keyed by the post URL (exactly as it appears in the feed;
 * for YouTube that's https://www.youtube.com/watch?v=VIDEO_ID).
 *
 *   categories → override the auto-picked categories (1–2; 'graphic' is added separately)
 *   graphic    → force the content warning on (true) or off (false)
 *   tone       → override the private editorial tone. Never rendered.
 *   hide       → never show this post
 *   pin        → always show at the top
 *   embed      → mark a CC article for full embedding later (license: 'cc' only)
 */

export interface Curation {
  categories?: [CategoryId] | [CategoryId, CategoryId];
  graphic?: boolean;
  tone?: Tone;
  hide?: boolean;
  pin?: boolean;
  embed?: boolean;
}

export const CURATION: Record<string, Curation> = {
  // 'https://news.mongabay.com/2026/06/example-article/': {
  //   categories: ['oceans', 'animals'],
  //   tone: 'celebration',
  //   embed: true,
  // },
};
