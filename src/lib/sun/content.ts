import type { MoonTheme } from '@/lib/moon';
import type { SunPhase } from './phase';

/*
 * Bright theme hero copy. The sun sets the heading; the moon still sets the
 * tone (eyebrow + body), so the featured news matches in both themes.
 * *Asterisks* mark highlighted words, same as moon-content.ts.
 */
export const SUN_HEADINGS: Record<Exclude<SunPhase, 'eclipse'>, string> = {
  dawn: 'A Little Light Shining Through,',
  midday: 'Make Each Day A Little Brighter.',
  afternoon: 'The Day Is Warm And Bright,',
  twilight: 'Night Falls So Light Can Return.',
};

export const SUN_ALT: Record<SunPhase, string> = {
  dawn: 'The sun rising soon.',
  midday: 'The midday sun is out right now.',
  afternoon: 'The afternoon sun is cast over right now.',
  twilight: 'The sun is setting or has set.',
  eclipse: 'A solar eclipse is happening today.',
};

export const SUN_TONE: Record<MoonTheme, { eyebrow: string; body: string }> = {
  grow: {
    eyebrow: 'Look on the bright side & *grow*',
    body: 'The moon is growing brighter, so let’s *grow* with her too and see what new opportunities are out there this month.',
  },
  celebrate: {
    eyebrow: 'Look on the bright side & *celebrate*',
    body: 'Tonight the moon is at its brightest, so let’s *celebrate* what we’ve achieved this month.',
  },
  appreciate: {
    eyebrow: 'Look on the bright side & *appreciate*',
    body: 'The moonlight is dimming, so let’s *appreciate* the ongoing efforts happening this month.',
  },
  reflect: {
    eyebrow: 'Let’s take a moment & *reflect*',
    body: 'Tonight the moon is resting. Take a moment to *reflect* on the somber news this month. Take a breather.',
  },
  blue: {
    eyebrow: 'Look on the bright side & *rejoice*',
    body: 'A rare blue moon rises tonight, so let’s *rejoice* in everything going right this month.',
  },
  eclipse: {
    eyebrow: 'Let’s take a moment & *reflect deeply*',
    body: 'The moon slips into Earth’s shadow tonight. Let’s *reflect deeply* on the stories that still need care.',
  },
};

/** The day of an annular or total solar eclipse replaces the whole hero. */
export const SOLAR_ECLIPSE = {
  eyebrow: 'Let’s take a moment & *reflect*',
  heading: 'Light Can’t Live Without Darkness.',
  body: 'The moon and sun overlap today in a rare *solar eclipse*, but light always returns after a moment of darkness.',
};
