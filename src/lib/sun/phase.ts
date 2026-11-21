export type SunPhase = 'dawn' | 'midday' | 'afternoon' | 'twilight' | 'eclipse';

/*
 * Which sun phase it is for the visitor, in their own timezone.
 * Self-contained on purpose: it's also copied into the <head> script
 * (see theme-script.ts), so it can't use anything from outside itself.
 *
 *   dawn 2–8 · midday 8–14 · afternoon 14–20 · twilight 20–2
 *   eclipse: the visitor's whole local day of an annular or total solar eclipse
 */
export function sunPhaseAt(now: Date, eclipsePeak: string | null): SunPhase {
  if (eclipsePeak && new Date(eclipsePeak).toDateString() === now.toDateString()) return 'eclipse';
  const h = now.getHours();
  if (h >= 2 && h < 8) return 'dawn';
  if (h >= 8 && h < 14) return 'midday';
  if (h >= 14 && h < 20) return 'afternoon';
  return 'twilight';
}
