'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { MoonStarsIcon, SunHorizonIcon } from '@phosphor-icons/react';
import { getTheme, setTheme, startSunClock, subscribeTheme } from '@/lib/sun/theme';

/** Switches between the night (default) and bright themes, and keeps the sun phase current. */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => 'night' as const);
  const bright = theme === 'bright';

  useEffect(startSunClock, []);

  return (
    <li><button
      id="theme-toggle"
      type="button"
      onClick={() => setTheme(bright ? 'night' : 'bright')}
      aria-pressed={bright}
      aria-label="Daytime theme (light, higher contrast)"
      className={`theme-toggle cursor-pointer ${className}`}
    >
      {bright ? <SunHorizonIcon aria-hidden="true" weight="fill" size={22} /> : <MoonStarsIcon aria-hidden="true" weight="regular" size={22} />}
    </button></li>
  );
}
