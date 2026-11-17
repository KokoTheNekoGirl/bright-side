import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BrushStroke from '@/components/BrushStroke';

export const metadata: Metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <div className="px-4 py-10">
      <section
        aria-labelledby="not-found-heading"
        data-phase="new"
        className="not-found relative mx-auto flex w-full max-w-2xl flex-col items-center gap-2.5 overflow-hidden rounded-[20px] bg-container px-6 py-7 text-center shadow-card outline-2 -outline-offset-1 outline-primary sm:px-12"
      >
        <div aria-hidden="true" className="nebula pointer-events-none h-full w-full absolute inset-0 overflow-hidden" />
        <Image
          src="/assets/phases/new.svg"
          alt=""
          width={120}
          height={100}
          priority
          unoptimized
          className="h-moon w-auto z-10 moon-glow mb-2.5"
        />

        <div className="flex w-full flex-col items-center gap-1 z-10 mb-2.5">
          <p className="md-subheading text-shadow-canvas">
            404 &amp;{' '}
            <span className="relative inline-block">
              Lost in the dark
              <BrushStroke className="animate-brush-wipe motion-reduce:animate-none" />
            </span>
          </p>

          <h1 id="not-found-heading" className="xlg-heading text-shadow-surface">
            This Page Drifted Out Of Orbit.
          </h1>
        </div>

        <p className="min-w-full w-0 text-shadow-canvas z-10">
          Even the new moon comes back around. The page you’re looking for may have moved, or never
          existed, but there’s still plenty of <strong className="font-bold text-primary">good news</strong> for you.
        </p>

        <nav aria-label="Get back on track" className="mt-4 z-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link href="/" className="brush-link relative text-primary hover:drop-shadow-[0_0_15px_rgb(var(--primary))]">
            back to the bright side
            <BrushStroke />
          </Link>
          <Link href="/news" className="brush-link relative text-primary hover:drop-shadow-[0_0_15px_rgb(var(--primary))]">
            browse all good news
            <BrushStroke />
          </Link>
        </nav>
      </section>
    </div>
  );
}
