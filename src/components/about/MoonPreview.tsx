'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { MoonState } from '@/lib/moon';
import { getHeroContent, splitHighlights } from '@/lib/moon-content';
import BrushStroke from '@/components/BrushStroke';

type PreviewId = 'tonight' | 'blue' | 'eclipse';

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

function previewState(id: PreviewId, tonight: MoonState): MoonState {
  if (id === 'blue') {
    return { ...tonight, theme: 'blue', image: 'blue', mode: 'blue', timing: 'during', eclipseKind: null };
  }
  if (id === 'eclipse') {
    return { ...tonight, theme: 'eclipse', image: 'eclipse', mode: 'eclipse', timing: 'during', eclipseKind: 'total' };
  }
  return tonight;
}

const OPTIONS: { id: PreviewId; label: string }[] = [
  { id: 'tonight', label: 'tonight' },
  { id: 'blue', label: 'blue moon' },
  { id: 'eclipse', label: 'lunar eclipse' },
];

export default function MoonPreview({ tonight }: { tonight: MoonState }) {
  const [selected, setSelected] = useState<PreviewId>('tonight');
  const moon = previewState(selected, tonight);
  const { eyebrow, heading, body } = getHeroContent(moon);
  const isSpecial = moon.mode !== 'default';

  return (
    <div className="moon-preview-wrap flex flex-col items-center gap-5">
      <div role="group" aria-label="Preview the moon" className="preview-toggle flex flex-wrap justify-center gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected === option.id}
            onClick={() => setSelected(option.id)}
            data-option={option.id}
            className="preview-button rounded-full px-3 py-1.5 font-medium leading-5 text-white bg-[rgba(var(--btn),0.2)] outline-1 outline-[rgb(var(--btn))]"        >
            {option.label}
          </button>
        ))}
      </div>

      <div
        aria-live="polite"
        data-moon-mode={moon.mode}
        data-phase={moon.image}
        data-theme={moon.theme}
        className="moon-preview relative mx-auto flex w-full mb-2.5 md:max-w-fit flex-col items-center gap-2.5 overflow-hidden rounded-[20px] bg-container px-6 py-7 text-center shadow-card outline-2 -outline-offset-1 outline-primary sm:px-12 md:text-left"
      >
        <div aria-hidden="true" className="nebula pointer-events-none h-full w-full absolute inset-0 overflow-hidden" />
        <Image
          src={`/assets/phases/${moon.image}.svg`}
          alt={MOON_ALT[moon.image]}
          title={MOON_ALT[moon.image]}
          width={120}
          height={100}
          unoptimized
          className="moon-glow h-moon w-auto"
        />

        <div className="flex w-full flex-col items-center gap-1 md:items-start z-10">
          <p className="md-subheading text-shadow-canvas">
            {splitHighlights(eyebrow).map((part, i) =>
              part.highlight ? (
                <span key={`${selected}-${i}`} className="relative inline-block">
                  {part.text}
                  <BrushStroke className="animate-brush-wipe motion-reduce:animate-none" />
                </span>
              ) : (
                part.text
              ),
            )}
          </p>

          <p className="font-display xlg-heading text-shadow-surface text-shadow-surface">{heading}</p>
        </div>

        <p className="min-w-full w-0 text-shadow-canvas z-10">
          {splitHighlights(body).map((part, i) =>
            part.highlight ? (
              <strong key={i} className={`text-primary ${isSpecial ? 'font-semibold italic' : 'font-bold'}`}>
                {part.text}
              </strong>
            ) : (
              part.text
            ),
          )}
        </p>
      </div>
    </div>
  );
}
