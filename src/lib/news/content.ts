import { keywordMatcher } from './match';
import type { Tone } from './tone';

/*
 * Sensitive content rules. Same matching as categories (whole words, * = starts with).
 * Move words between the two lists to change what's blocked vs. shown with a warning.
 */

/** Never shown on Bright Side, from sources with `filterNegative`. */
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
 * Topics Bright Side skips entirely, from every source and including the feed's own tags.
 * Same matching rules: whole words, * = starts with.
 */
export const EXCLUDE_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
  'large language model', 'llm', 'generative', 'chatbot', 'chatgpt', 'computer vision', 'algorithm*',
];

const excluded = keywordMatcher(EXCLUDE_KEYWORDS);

export const isExcluded = (text: string) => text.search(excluded) !== -1;
