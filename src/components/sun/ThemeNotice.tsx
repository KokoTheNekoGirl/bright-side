'use client';

import { setTheme, type Theme } from '@/lib/sun/theme';

/*
 * One-time notice for visitors whose device prefers light mode and who haven't chosen yet.
 * <html data-theme-notice>, so it never pops in after the page loads.
 * Not a modal and not an alert: it's simply first in the page.
 */
export default function ThemeNotice() {
  const choose = (theme: Theme) => {
    setTheme(theme);
    document.getElementById('theme-toggle')?.focus();
  };

  return (
    <section aria-labelledby="theme-notice-title" className="theme-notice">
      <h2 id="theme-notice-title" className="font-display text-lg-custom">
        Bright✦Side is designed around the night sky
      </h2>
      <p>
        Your device prefers light mode, so you can switch to our daytime theme, which follows the sun with higher
        contrast. You can change this anytime with the sun and moon button in the menu.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <button type="button" onClick={() => choose('bright')} className="theme-notice-button cursor-pointer">
          Enter daytime <span className="text-sm">(light, higher contrast)</span>
        </button>
        <button type="button" onClick={() => choose('night')} className="theme-notice-button cursor-pointer">
          I prefer nighttime
        </button>
      </div>
    </section>
  );
}
