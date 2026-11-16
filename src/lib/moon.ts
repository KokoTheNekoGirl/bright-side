import {
  MoonPhase,
  SearchMoonPhase,
  SearchLunarEclipse,
  Illumination,
  Body,
  EclipseKind,
  type AstroTime,
} from 'astronomy-engine';
import { SITE_TIMEZONE } from '@/consts';

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

export type MoonTheme =
  | 'grow'           // waxing
  | 'appreciate'     // waning
  | 'celebrate'      // full moon window
  | 'blue'        // blue moon window
  | 'reflect'        // new moon window
  | 'eclipse'; // lunar eclipse window

export type MoonImage =
  | 'new'
  | 'wax-crescent'
  | 'first'
  | 'wax-gibbous'
  | 'full'
  | 'wan-gibbous'
  | 'third'
  | 'wan-crescent'
  | 'blue'
  | 'eclipse';

export type MoonMode = 'default' | 'blue' | 'eclipse';

export type EventTiming = 'before' | 'during' | 'after';

export interface MoonState {
  theme: MoonTheme;
  image: MoonImage;
  mode: MoonMode;
  timing: EventTiming | null;
  eclipseKind: 'total' | 'partial' | null;
  phaseAngle: number;
  illumination: number;
  localDate: string;
}

/* ------------------------------------------------------------------ *
 * Preview Override
 * ------------------------------------------------------------------ */

const IMAGE_THEME: Record<MoonImage, MoonTheme> = {
  new: 'reflect',
  'wax-crescent': 'grow',
  first: 'grow',
  'wax-gibbous': 'grow',
  full: 'celebrate',
  'wan-gibbous': 'appreciate',
  third: 'appreciate',
  'wan-crescent': 'appreciate',
  blue: 'blue',
  eclipse: 'eclipse',
};

const EVENT_IMAGES: MoonImage[] = ['new', 'full', 'blue', 'eclipse'];
const TIMINGS: EventTiming[] = ['before', 'during', 'after'];

function previewState(): MoonState | null {
  const raw = process.env.MOON_PREVIEW?.trim();
  if (!raw || process.env.NODE_ENV === 'production') return null;

  const [image, ...flags] = raw.split(':') as [MoonImage, ...string[]];
  if (!(image in IMAGE_THEME)) {
    console.warn(`MOON_PREVIEW: unknown "${image}". Use one of: ${Object.keys(IMAGE_THEME).join(', ')}`);
    return null;
  }

  const timing = (flags.find((f) => TIMINGS.includes(f as EventTiming)) as EventTiming) ?? 'during';

  return {
    theme: IMAGE_THEME[image],
    image,
    mode: image === 'blue' || image === 'eclipse' ? image : 'default',
    timing: EVENT_IMAGES.includes(image) ? timing : null,
    eclipseKind: image === 'eclipse' ? (flags.includes('partial') ? 'partial' : 'total') : null,
    phaseAngle: 0,
    illumination: 0,
    localDate: 'preview',
  };
}

/* ------------------------------------------------------------------ *
 * Settings
 * ------------------------------------------------------------------ */

/**
 * Penumbral eclipses are barely visible, so by default only partial and
 * total eclipses switch the site into eclipse mode.
 */
const ECLIPSE_KINDS: EclipseKind[] = [EclipseKind.Total, EclipseKind.Partial];

/**
 * Show the half moon when within this many degrees of a quarter (90° / 270°).
 * The moon moves ~12.2°/day, so 15 ≈ 2.5 days, 20 ≈ 3.3 days.
 */
const HALF_MOON_RANGE = 15;

/* ------------------------------------------------------------------ *
 * Date helpers (all "days" are calendar days in SITE_TIMEZONE)
 * ------------------------------------------------------------------ */

const DAY_MS = 86_400_000;

/** YYYY-MM-DD for a moment, in the site's time zone. */
function localDay(date: Date, timeZone = SITE_TIMEZONE): string {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/** Whole calendar days from `a` to `b` (b - a). */
function dayDiff(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / DAY_MS);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/**
 * Finds the moment the moon hits `targetLon` (0 new, 90 first, 180 full,
 * 270 third) within ±2 days of `now`, and returns where today sits
 * relative to it. Returns null if today isn't within ±1 calendar day.
 */
function findWindow(
  targetLon: number,
  now: Date,
  today: string,
): { time: Date; timing: EventTiming } | null {
  const hit: AstroTime | null = SearchMoonPhase(targetLon, addDays(now, -3), 6);
  if (!hit) return null;

  const diff = dayDiff(localDay(hit.date), today);
  if (diff === -1) return { time: hit.date, timing: 'before' };
  if (diff === 0) return { time: hit.date, timing: 'during' };
  if (diff === 1) return { time: hit.date, timing: 'after' };
  return null;
}

/** Is this full moon the second one in its calendar month? */
function isBlueMoon(fullMoon: Date): boolean {
  // The previous full moon is ~29.5 days earlier.
  const prev = SearchMoonPhase(180, addDays(fullMoon, -32), 5);
  if (!prev) return false;
  return localDay(prev.date).slice(0, 7) === localDay(fullMoon).slice(0, 7);
}

/** Returns the eclipse kind if a qualifying lunar eclipse peaks at this full moon. */
function eclipseAt(fullMoon: Date): 'total' | 'partial' | null {
  const eclipse = SearchLunarEclipse(addDays(fullMoon, -2));
  const peakGap = Math.abs(eclipse.peak.date.getTime() - fullMoon.getTime());
  if (peakGap > DAY_MS || !ECLIPSE_KINDS.includes(eclipse.kind)) return null;
  return eclipse.kind === EclipseKind.Total ? 'total' : 'partial';
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

/**
 * "Now", unless MOON_PREVIEW_DATE is set (dev only), e.g.
 *   MOON_PREVIEW_DATE=2026-08-28T12:00 npm run dev
 */
function currentDate(): Date {
  const preview = process.env.MOON_PREVIEW_DATE;
  if (preview && process.env.NODE_ENV !== 'production') {
    const d = new Date(preview);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

/**
 * Works out everything the hero and site theme need for a given moment.
 * Priority: eclipse > blue moon > full > new > quarter / crescent / gibbous.
 */
export function getMoonState(now: Date = currentDate()): MoonState {
  const preview = previewState();
    if (preview) return preview;
  const today = localDay(now);
  const phaseAngle = MoonPhase(now);
  const illumination = Illumination(Body.Moon, now).phase_fraction;

  const base = { phaseAngle, illumination, localDate: today, eclipseKind: null, timing: null };

  // 1. Full moon window (and its special cases)
  const full = findWindow(180, now, today);
  if (full) {
    const eclipseKind = eclipseAt(full.time);
    if (eclipseKind) {
      return { ...base, theme: 'eclipse', image: 'eclipse', mode: 'eclipse', timing: full.timing, eclipseKind };
    }
    if (isBlueMoon(full.time)) {
      return { ...base, theme: 'blue', image: 'blue', mode: 'blue', timing: full.timing };
    }
    return { ...base, theme: 'celebrate', image: 'full', mode: 'default', timing: full.timing };
  }

  // 2. New moon window
  const newMoon = findWindow(0, now, today);
  if (newMoon) {
    return { ...base, theme: 'reflect', image: 'new', mode: 'default', timing: newMoon.timing };
  }

  // 3. Everything in between: waxing = grow, waning = appreciate
  const waxing = phaseAngle < 180;
  const theme: MoonTheme = waxing ? 'grow' : 'appreciate';

  // Half moon only on the calendar day of the quarter itself
  const quarterAngle = waxing ? 90 : 270;
  if (Math.abs(phaseAngle - quarterAngle) <= HALF_MOON_RANGE) {
    return { ...base, theme, image: waxing ? 'first' : 'third', mode: 'default' };
  }

  const isCrescent = phaseAngle < 90 || phaseAngle > 270;
  const image: MoonImage = waxing
    ? isCrescent ? 'wax-crescent' : 'wax-gibbous'
    : isCrescent ? 'wan-crescent' : 'wan-gibbous';

  return { ...base, theme, image, mode: 'default' };
}
