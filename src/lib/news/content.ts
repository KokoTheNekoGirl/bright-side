import { keywordMatcher } from './match';
import type { Tone } from './tone';

/*
 * Sensitive content rules. Same matching as categories (whole words, * = starts with).
 * Move words between the two lists to change what's blocked vs. shown with a warning.
 */

/** Never shown on Bright✦Side, from sources with `filterNegative`. */
export const BLOCK_KEYWORDS = [
  'massacre*', 'terror*', 'suicid*', 'self-harm', 'shooting*', 'bomb*', 'murder*', 'genocide',
];

/**
 * Shown, but tagged 'graphic' (first category, content warning) when the
 * post is also somber (tone: reflection). Override per post in curation.ts.
 */
export const GRAPHIC_KEYWORDS = [
  'kill*', 'dies', 'died', 'death*', 'dead', 'carcass*', 'corpse*', 'remains', 'blood*', 'bloody',
  'injur*', 'wound*', 'slaughter*', 'cull*', 'mutilat*', 'gore', 'graphic', 'disturbing', 'violen*',
  'war', 'wars', 'abuse*', 'assault*', 'starv*', 'famine', 'cruelty', 'trapped', 'snare*', 'poisoned',
];

const blocked = keywordMatcher(BLOCK_KEYWORDS);
const graphic = keywordMatcher(GRAPHIC_KEYWORDS);

export const isBlocked = (text: string) => text.search(blocked) !== -1;

/** Somber + sensitive words → graphic. Upbeat posts that mention e.g. "deaths fell" aren't tagged. */
export const isGraphic = (text: string, tone: Tone) => tone === 'reflection' && text.search(graphic) !== -1;

/**
 * Topics Bright✦Side skips entirely, from every source and including the feed's own tags.
 * Same matching rules: whole words, * = starts with.
 */
export const EXCLUDE_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
  'large language model', 'llm', 'generative', 'chatbot', 'chatgpt', 'computer vision', 'algorithm*',
];

const excluded = keywordMatcher(EXCLUDE_KEYWORDS);

export const isExcluded = (text: string) => text.search(excluded) !== -1;

/*
 * US partisan politics: skipped entirely, whichever side it's on.
 * Bright✦Side isn't taking a side; it's skipping the anxiety. Policy wins
 * that don't centre on politicians or parties (a city bans plastic bags,
 * a court protects a forest) still come through.
 * Canadians are a lot more chill with our politics, trust lol
 *
 * Names are matched as whole words, so "trump" won't catch "trumpet".
 * Common surnames use full names or titles to avoid false matches
 * (e.g. 'pam bondi', not 'bondi', which would catch Bondi Beach).
 */
export const POLITICS_KEYWORDS = [
  // Parties & movements
  'republicans', 'republican party', 'gop', 'democrats', 'democratic party', 'maga',
  'white house', 'oval office', 'executive order*', 'congressional', 'us congress', 'capitol hill',
  // Prominent national figures, both parties
  'trump', 'jd vance', 'vice president vance', 'biden', 'kamala', 'obama', 'pelosi', 'schumer',
  'mcconnell', 'mike johnson', 'ocasio-cortez', 'bernie sanders', 'desantis', 'newsom', 'epstein',
  // Cabinet and agency heads who appear in environment / health stories
  'rubio', 'hegseth', 'rfk', 'kennedy jr', 'pam bondi', 'kristi noem', 'zeldin', 'burgum', 'chris wright',
  'elon musk', 'doge'
];

const political = keywordMatcher(POLITICS_KEYWORDS);

/**
 * Political if a name or party appears in what readers see (title, excerpt, tags),
 * or 2+ times in the article body (a single passing mention deep in a positive
 * story doesn't count).
 */
export const isPolitical = (visible: string, body = '') =>
  visible.search(political) !== -1 || (body.match(political)?.length ?? 0) >= 2;
