import type { EventTiming, MoonState, MoonTheme } from './moon';

/*
 * Hero copy for each theme.
 * Wrap a word in *asterisks* to highlight it (the bold/coloured word).
 * Wrap the eyebrow keyword in *asterisks* to get the underline.
 */

export interface HeroContent {
  eyebrow: string;
  heading: string;
  body: string;
}

/** Picks the right "Tomorrow night / Tonight / Last night" phrase. */
function when(timing: EventTiming | null, before: string, during: string, after: string) {
  if (timing === 'before') return before;
  if (timing === 'after') return after;
  return during;
}

type ContentFn = (state: MoonState) => HeroContent;

const CONTENT: Record<MoonTheme, ContentFn> = {
  grow: ({ image }) => ({
    eyebrow: 'Look on the Bright Side & *Grow*',
    heading: 'Good Things Are Coming.',
    body: `${
      image === 'first' ? 'It’s the first half of a new cycle'
      : image === 'wax-gibbous' ? 'It’s almost a full moon'
      : 'It’s the start of a new cycle'
    }, let’s focus on the positive *growth* that happened this month.`,
  }),

  appreciate: ({ image }) => ({
    eyebrow: 'Look on the Bright Side & *Appreciate*',
    heading: 'A Little Gratitude Goes A Long Way.',
    body: `${
      image === 'wan-gibbous' ? 'The full moon just passed'
      : image === 'third' ? 'It’s the last half of the lunar cycle'
      : 'It’s nearing the end of the cycle'
    }, let’s focus on *appreciating* what the world has achieved this month.`,
  }),

  celebrate: ({ timing }) => ({
    eyebrow: 'Look on the Bright Side & *Celebrate*',
    heading: 'A Little More Hope, Every Day.',
    body: `${when(timing, 'Tomorrow night is', 'Tonight is', 'Last night was')} a full moon, let’s focus on *celebrating* the achievements we’ve accomplished this month.`,
  }),

  blue: ({ timing }) => ({
    eyebrow: 'Look on the Bright Side & *Rejoice*',
    heading: 'Once In A Blue Moon, We Cheer.',
    body: `${when(timing, 'Tomorrow night is', 'Tonight is', 'Last night was')} a rare *blue moon*, where we celebrate on all the best news this past year. These aren’t rare, they’re precious.`,
  }),

  reflect: ({ timing }) => ({
    eyebrow: 'Let’s Take a Moment & *Reflect*',
    heading: 'Light Can’t Live Without Darkness.',
    body: `${when(timing, 'Tomorrow night is', 'Tonight is', 'Last night was')} the new moon, where we take a moment to *reflect* on the somber news this month. Feel free to take a screen break.`,
  }),

  'eclipse': ({ timing, eclipseKind }) => ({
    eyebrow: 'Let’s Take a Moment & *Reflect Deeply*',
    heading: 'Even In Darkness, We Find Light.',
    body: `${when(timing, 'Soon will be', 'Tonight is', 'Last night was')} a rare ${eclipseKind ?? 'total'} *lunar eclipse*, we’ll look back on all the somber news this past year. Take some time away.`,
  }),
};

export function getHeroContent(state: MoonState): HeroContent {
  return CONTENT[state.theme](state);
}

/** Splits "a *word* here" into parts so the highlighted bits can be styled. */
export function splitHighlights(text: string): { text: string; highlight: boolean }[] {
  return text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('*') && part.endsWith('*')
        ? { text: part.slice(1, -1), highlight: true }
        : { text: part, highlight: false },
    );
}
