import { sunPhaseAt } from './phase';

/*
 * Theme state shared by the <head> script, the toggle and the notice.
 *   <html data-theme="night|bright">  the visitor's choice (night is the default)
 *   <html data-sun="dawn|…|eclipse">   the sun phase, only used by the bright theme
 *   <html data-theme-notice>           show the one-time light-mode notice
 */
export type Theme = 'night' | 'bright';

export const THEME_KEY = 'bright-side:theme';
export const THEME_EVENT = 'bright-side:theme';

/**
 * Runs in <head> before the page paints, so there's no flash of the wrong theme.
 *   prefers-contrast: more        → bright, automatically
 *   prefers light, nothing saved  → night, plus the notice
 *   everyone else                 → night
 */
export function themeScript(eclipsePeak: string | null, sunPreview?: string) {
  return `(function(){try{
var d=document.documentElement;
var sunPhaseAt=${sunPhaseAt.toString()};
var saved=null;
try{saved=localStorage.getItem('${THEME_KEY}')}catch(e){}
if(!saved){try{saved=sessionStorage.getItem('${THEME_KEY}')}catch(e){}}
var contrast=matchMedia('(prefers-contrast: more)').matches;
var lightPref=matchMedia('(prefers-color-scheme: light)').matches;
d.dataset.theme=saved==='bright'||saved==='night'?saved:(contrast?'bright':'night');
if(!saved&&!contrast&&lightPref)d.dataset.themeNotice='';
d.dataset.eclipsePeak=${JSON.stringify(eclipsePeak ?? '')};
d.dataset.sunPreview=${JSON.stringify(sunPreview ?? '')};
d.dataset.sun=d.dataset.sunPreview||sunPhaseAt(new Date(),d.dataset.eclipsePeak||null);
}catch(e){}})();`;
}

/** Saves the visitor's choice and hides the notice. */
export function setTheme(theme: Theme) {
  const d = document.documentElement;
  d.dataset.theme = theme;
  delete d.dataset.themeNotice;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // storage blocked (e.g. private mode): remember for this visit instead
    try {
      sessionStorage.setItem(THEME_KEY, theme);
    } catch {}
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

export const subscribeTheme = (cb: () => void) => {
  window.addEventListener(THEME_EVENT, cb);
  return () => window.removeEventListener(THEME_EVENT, cb);
};
export const getTheme = (): Theme =>
  document.documentElement.dataset.theme === 'bright' ? 'bright' : 'night';

/** Keeps data-sun current while the page is open. Returns a cleanup function. */
export function startSunClock() {
  const d = document.documentElement;
  const tick = () => {
    if (d.dataset.sunPreview) return;
    d.dataset.sun = sunPhaseAt(new Date(), d.dataset.eclipsePeak || null);
  };
  const id = setInterval(tick, 60_000);
  return () => clearInterval(id);
}
