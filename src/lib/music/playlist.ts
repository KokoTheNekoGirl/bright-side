import type { MoonTheme } from '@/lib/moon';

/*
 * Each moon's playlist is a Jamendo search, like the news feeds.
 *
 *   tags   → vibe words, matched loosely (more matches rank higher)
 *   speed  → any of: verylow, low, medium, high, veryhigh
 *
 * Every search is limited to instrumental tracks released before 2022
 * (before AI music tools took off), sorted by popularity.
 * Test a vibe first at localhost:3000/dev/music.
 */
export interface Mood {
  tags: string[];
  speed: ('verylow' | 'low' | 'medium' | 'high' | 'veryhigh')[];
}

export const MOODS: Record<MoonTheme, Mood> = {
  // Waxing: building, hopeful, a little momentum
  grow: { tags: ['lofi', 'chillhop', 'hopeful', 'uplifting'], speed: ['low', 'medium'] },
  // Waning: warm, grateful, slow
  appreciate: { tags: ['lofi', 'jazz', 'warm', 'acoustic'], speed: ['low'] },
  // Full moon: happy, bright, together
  celebrate: { tags: ['chillhop', 'lofi', 'happy', 'groovy'], speed: ['medium'] },
  // Blue moon: dreamy and joyful
  blue: { tags: ['lofi', 'dreamy', 'happy', 'chillout'], speed: ['low', 'medium'] },
  // New moon: quiet, calm, thoughtful
  reflect: { tags: ['lofi', 'ambient', 'calm', 'piano'], speed: ['verylow', 'low'] },
  // Eclipse: deep, slow, a little melancholy
  eclipse: { tags: ['ambient', 'melancholic', 'atmospheric', 'piano'], speed: ['verylow'] },
};

/** Only tracks released between these dates. */
export const RELEASED = { from: '2008-01-01', to: '2021-12-31' };

/** How many tracks each playlist holds. */
export const PLAYLIST_LENGTH = 20;

/** Tracks that always play first on these moons (Jamendo IDs). */
export const PINNED: Partial<Record<MoonTheme, number[]>> = {
  // grow: [
  //   1641226, // Lo-Fi Dream Hip-Hop by Anton Vlasov
  //   1639304, // Lo-Fi Hip-Hop by Anton Vlasov
  // ],
  // appreciate: [
  //   1894568, //Igor Pumphonia by Igor Pumphonia
  //   1897489, //Lofi and Coffee by Jon J. Morin
  // ],
  // reflect: [
  //   1861967, //Lofi t4 by Benedikt
  //   1880756, // Lofi Hiphop Jazzy Trumpet by Joel Loopez
  // ],
};

/** Tracks that never play: AI, wrong vibe, vocals, bad audio. */
export const HIDDEN: number[] = [
  // 1234567, // reason
];
