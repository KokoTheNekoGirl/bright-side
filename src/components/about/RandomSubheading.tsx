'use client';

import { useSyncExternalStore } from 'react';
import BrushStroke from '@/components/BrushStroke';

/*
 * Picks one of the options at random on each page load.
 * The server (and first paint) shows the first option, then it switches to
 * the random pick, avoiding a hydration mismatch. Client-side navigation
 * keeps the same pick; a refresh picks again.
 */
let choice: number | undefined;
function getChoice(count: number) {
  if (choice === undefined) choice = Math.floor(Math.random() * count);
  return choice;
}
const subscribe = () => () => {};

export default function RandomSubheading({ options }: { options: string[] }) {
  const index = useSyncExternalStore(subscribe, () => getChoice(options.length), () => 0);
  const text = options[index] ?? options[0];

  return (
    <p className="md-subheading">
      <span key={text} className="relative inline-block">
        {text}
        <BrushStroke className="animate-brush-wipe motion-reduce:animate-none" />
      </span>
    </p>
  );
}