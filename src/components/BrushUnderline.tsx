import { useId } from 'react';

/*
 * Curved brushstroke underline that "paints" left to right on load.
 * Several thin strokes ("bristles") follow the same curve and end at
 * different points, so the right end tapers and frays. A turbulence
 * filter roughens the edges. Colour comes from currentColor.
 */

// [path, stroke width, opacity]
const BRISTLES: [string, number, number][] = [
  ['M3 13 C 50 6, 120 3.5, 197 6', 5, 1],
  ['M2 16 C 52 9, 118 6.5, 186 9', 3.6, 0.9],
  ['M5 10.5 C 55 4.5, 125 2, 192 3.5', 2.6, 0.85],
  ['M4 18 C 50 12, 110 9.5, 165 11', 2, 0.65],
  ['M9 8.5 C 60 3, 130 1, 175 1.5', 1.4, 0.55],
  ['M6 14.5 C 60 8.5, 140 5.5, 200 7', 1.2, 0.8],
  ['M12 17 C 70 11, 140 8, 194 10', 1, 0.6],
];

export default function BrushUnderline({ className = '' }: { className?: string }) {
  const filterId = `brush-${useId().replace(/:/g, '')}`;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 200 20"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute -bottom-3.5 -left-1 h-4 w-[calc(100%+0.5rem)] overflow-visible ${className}`}
    >
      <defs>
        <filter id={filterId} x="-5%" y="-50%" width="110%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.3" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" />
        </filter>
      </defs>

      <g filter={`url(#${filterId})`} fill="none" stroke="currentColor" strokeLinecap="round">
        {BRISTLES.map(([d, width, opacity], i) => (
          <path
            key={i}
            d={d}
            pathLength={1}
            strokeWidth={width}
            strokeOpacity={opacity}
            style={{ animationDelay: `${400 + i * 70}ms` }}
            className="animate-brush-draw [stroke-dasharray:1] [stroke-dashoffset:1] motion-reduce:animate-none motion-reduce:[stroke-dashoffset:0]"
          />
        ))}
      </g>
    </svg>
  );
}