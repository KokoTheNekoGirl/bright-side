'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PlayIcon, WarningIcon } from '@phosphor-icons/react';

/*
 * Click-to-play YouTube embed. Shows the thumbnail first and only loads
 * YouTube's player (and its cookies/scripts) when someone presses play.
 * Uses youtube-nocookie.com, YouTube's privacy-enhanced embed.
 */
export default function VideoEmbed({
  videoId,
  title,
  sensitive = false,
}: {
  videoId: string;
  title: string;
  sensitive?: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="video-embed aspect-video w-full rounded-lg"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`${sensitive ? 'Content warning. ' : ''}Play video: ${title}`}
      data-sensitive={sensitive || undefined}
      className="video-embed group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-lg"
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={`${title} thumbnail`}
        title={title}
        fill
        loading="lazy"
        sizes="(min-width: 1200px) 600px, (min-width: 768px) calc(100vw - 32px), 100vw"
        className={`object-cover ${sensitive ? 'scale-110 blur-xl' : ''}`}
      />

      <span className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        {sensitive && (
          <span className="inline-flex items-center gap-1 rounded-full bg-deep/80 px-3 py-1 text-sm text-eclipse-text">
            <WarningIcon aria-hidden="true" className="size-4" />
            Content warning
          </span>
        )}
        <span className="rounded-full bg-deep/70 p-4 transition-transform group-hover:scale-110 motion-reduce:transition-none">
          <PlayIcon aria-hidden="true" weight="fill" className="size-8 text-heading" />
        </span>
      </span>
    </button>
  );
}
