import Image from 'next/image';
import type { MoonState } from '@/lib/moon';
import { splitHighlights } from '@/lib/moon-content';
import type { SunPhase } from '@/lib/sun/phase';
import { SOLAR_ECLIPSE, SUN_ALT, SUN_HEADINGS, SUN_TONE } from '@/lib/sun/content';
import BrushStroke from '../BrushStroke';

const PHASES: SunPhase[] = ['dawn', 'midday', 'afternoon', 'twilight', 'eclipse'];

export default function SunHero({ moon }: { moon: MoonState }) {
  const tone = SUN_TONE[moon.theme];

  return PHASES.map((phase) => {
    const isEclipse = phase === 'eclipse';
    const eyebrow = isEclipse ? SOLAR_ECLIPSE.eyebrow : tone.eyebrow;
    const heading = isEclipse ? SOLAR_ECLIPSE.heading : SUN_HEADINGS[phase as Exclude<SunPhase, 'eclipse'>];
    const body = isEclipse ? SOLAR_ECLIPSE.body : tone.body;
    const headingId = `sun-hero-heading-${phase}`;

    return (
      <section
        key={phase}
        aria-labelledby={headingId}
        data-sun-phase={phase}
        className="sun-hero relative mx-auto w-full max-w-2xl flex-col items-center gap-2.5 overflow-hidden rounded-[20px] px-6 py-7 text-center outline-2 -outline-offset-1 outline-primary sm:px-12 md:text-left"
      >
        <Image
          src={`/assets/sun/${phase}.svg`}
          alt={SUN_ALT[phase]}
          width={120}
          height={100}
          unoptimized
          className="sun-image h-moon w-auto"
        />

        <div className="flex w-full flex-col items-center gap-1 md:items-start">
          <p className="sun-eyebrow mb-2 font-sans text-lg font-semibold uppercase italic leading-5">
            {splitHighlights(eyebrow).map((part, i) =>
              part.highlight ? (
                <span key={i} className="relative inline-block">
                  {part.text}
                  <BrushStroke />
                </span>
              ) : (
                part.text
              ),
            )}
          </p>
          <h1
            id={headingId}
            className="xlg-heading text-shadow-surface"
          >
            {heading}
          </h1>
        </div>

        <p className="w-full max-w-xl font-sans text-base font-medium leading-5 text-body">
          {splitHighlights(body).map((part, i) =>
            part.highlight ? (
              <strong key={i} className={isEclipse ? 'sun-highlight font-semibold italic' : 'font-bold'}>
                {part.text}
              </strong>
            ) : (
              part.text
            ),
          )}
        </p>
      </section>
    );
  });
}
