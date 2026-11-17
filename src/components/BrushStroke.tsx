/**
 * The brushstroke underline. Put it inside an element with `relative`.
 * Inside a `.brush-link` it's hidden, then paints in on hover/focus and stays
 * on the active page (see globals.css). Anywhere else it's always visible.
 */
export default function BrushStroke({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`brush pointer-events-none h-2.5 absolute -bottom-2.5 left-0 aspect-[20/1] w-[calc(100%+1rem)] bg-current [mask:url(/assets/brush.svg)_center/100%_100%_no-repeat] ${className}`}
    />
  );
}
