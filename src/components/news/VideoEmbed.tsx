'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { PlayIcon, WarningIcon } from '@phosphor-icons/react';
import { announceVideo } from '@/lib/video-audio';

const YOUTUBE_ORIGIN = 'https://www.youtube-nocookie.com';

/*
 * Click-to-play YouTube embed. Shows the thumbnail first and only loads
 * YouTube's player (and its cookies/scripts) when someone presses play.
 * Uses youtube-nocookie.com, YouTube's privacy-enhanced embed.
 *
 * While the video plays, the music player is told to step aside. YouTube reports
 * play / pause / end through postMessage (enablejsapi=1), so the music comes back
 * when the video is paused or finished.
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
  const frameRef = useRef<HTMLIFrameElement>(null);
  const id = useId();

  // Listen for YouTube's player state: 1 = playing, 2 = paused, 0 = ended
  useEffect(() => {
    if (!playing) return;

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YOUTUBE_ORIGIN || e.source !== frameRef.current?.contentWindow) return;
      let data: { event?: string; info?: unknown };
      try {
        data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      const state =
        data.event === 'onStateChange'
          ? data.info
          : data.event === 'infoDelivery'
            ? (data.info as { playerState?: number } | undefined)?.playerState
            : undefined;
      if (state === 1) announceVideo(id, true);
      if (state === 2 || state === 0) announceVideo(id, false);
    };

    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      announceVideo(id, false); // video removed from the page
    };
  }, [playing, id]);

  /** Ask the player to send state updates once it has loaded. */
  const listen = () => {
    const frame = frameRef.current?.contentWindow;
    if (!frame) return;
    frame.postMessage(JSON.stringify({ event: 'listening', id, channel: 'widget' }), YOUTUBE_ORIGIN);
    frame.postMessage(
      JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'], id, channel: 'widget' }),
      YOUTUBE_ORIGIN,
    );
  };

  if (playing) {
    const origin = encodeURIComponent(window.location.origin);
    return (
      <iframe
        ref={frameRef}
        src={`${YOUTUBE_ORIGIN}/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1&origin=${origin}`}
        title={title}
        onLoad={listen}
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
      onClick={() => {
        announceVideo(id, true); // step the music aside right away
        setPlaying(true);
      }}
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
