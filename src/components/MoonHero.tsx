import Image from 'next/image';
import type { MoonState } from '@/lib/moon';
import { getHeroContent, splitHighlights } from '@/lib/moon-content';

const MOON_ALT: Record<MoonState['image'], string> = {
  new: 'New moon',
  'wax-crescent': 'Waxing crescent moon',
  first: 'First quarter moon',
  'wax-gibbous': 'Waxing gibbous moon',
  full: 'Full moon',
  'wan-gibbous': 'Waning gibbous moon',
  third: 'Third quarter moon',
  'wan-crescent': 'Waning crescent moon',
  blue: 'Blue moon',
  eclipse: 'Lunar eclipse',
};

export default function MoonHero({ moon }: { moon: MoonState }) {
  const { eyebrow, heading, body } = getHeroContent(moon);
  // Blue moon / eclipse highlights are italic in the design
  const isSpecial = moon.mode !== 'default';

  return (
    <section
      aria-labelledby="moon-hero-heading"
      data-phase={moon.image}
      data-theme={moon.theme}
      className="moon-hero relative mx-auto flex w-full mb-2.5 md:max-w-fit flex-col items-center gap-2.5 overflow-hidden rounded-[20px] bg-container px-6 py-7 text-center shadow-card outline-2 -outline-offset-1 outline-primary sm:px-12 md:text-left"
    >
      <div aria-hidden="true" className="nebula pointer-events-none h-full w-full absolute inset-0 overflow-hidden" />
      <Image
        src={`/assets/phases/${moon.image}.svg`}
        alt={MOON_ALT[moon.image]}
        width={120}
        height={100}
        priority
        unoptimized
        className="h-moon w-auto z-10 moon-glow mb-2.5"
      />

      <div className="flex w-full flex-col items-center gap-1 md:items-start z-10">
        <p className="md-subheading text-shadow-canvas">
          {splitHighlights(eyebrow).map((part, i) =>
            part.highlight ? (
              <span key={i} className="relative inline-block">
                {part.text}
                <span aria-hidden="true" className="pointer-events-none h-[5px] absolute -bottom-1.5 -left-0 w-[calc(100%+1rem)] aspect-[20/1] bg-current [mask:url(/assets/brush.svg)_center/100%_100%_no-repeat] animate-brush-wipe motion-reduce:animate-none"/>
              </span>
            ) : (
              part.text
            ),
          )}
        </p>

        <h1
          id="moon-hero-heading"
          className="xlg-heading text-shadow-surface"
        >
          {heading}
        </h1>
      </div>

      <p className="min-w-full w-0 text-shadow-canvas z-10">
        {splitHighlights(body).map((part, i) =>
          part.highlight ? (
            <strong
              key={i}
              className={`text-primary ${isSpecial ? 'font-semibold italic' : 'font-bold'}`}
            >
              {part.text}
            </strong>
          ) : (
            part.text
          ),
        )}
      </p>
    </section>
  );
}
