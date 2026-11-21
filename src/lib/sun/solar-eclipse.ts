import { EclipseKind, NextGlobalSolarEclipse, SearchGlobalSolarEclipse } from 'astronomy-engine';

const DAY = 86_400_000;

/*
 * The peak time of an annular or total solar eclipse happening around now,
 * or null. Partial eclipses are skipped.
 *
 * It looks two days either side because "the day of the eclipse" depends on
 * the visitor's timezone; the browser decides whether it's *their* day.
 * Lunar eclipses are a separate search in moon.ts, and the two can't overlap:
 * solar eclipses only happen at a new moon, lunar ones only at a full moon.
 */
export function nearbySolarEclipse(now = new Date()): string | null {
  let eclipse = SearchGlobalSolarEclipse(new Date(now.getTime() - 2 * DAY));
  while (eclipse.kind === EclipseKind.Partial) eclipse = NextGlobalSolarEclipse(eclipse.peak);

  const peak = eclipse.peak.date;
  return Math.abs(peak.getTime() - now.getTime()) <= 2 * DAY ? peak.toISOString() : null;
}
