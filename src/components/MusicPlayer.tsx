'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import {
  PlayPauseIcon,
  QueueIcon,
  ShuffleIcon,
  SpeakerSimpleHighIcon,
  SpeakerSimpleSlashIcon,
} from '@phosphor-icons/react';
import ExternalLink from '@/components/ExternalLink';
import type { Track } from '@/lib/music/jamendo';

const STORAGE_KEY = 'bright-side:music';

/** What's remembered between visits, in this browser only. */
interface Saved {
  order: number[]; // track IDs in play order
  trackId: number;
  time: number;
  playing: boolean;
  muted: boolean;
  shuffle: boolean;
}

function load(): Partial<Saved> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function save(state: Saved) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // private mode or storage full: just don't remember
  }
}

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const inOrder = (length: number) => Array.from({ length }, (_, i) => i);

/** `first` stays at the front; everything else is shuffled. */
function shuffled(length: number, first: number) {
  const rest = inOrder(length).filter((i) => i !== first);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [first, ...rest];
}

/** Rebuilds the saved queue, or starts a fresh one if the playlist has changed. */
function restoreOrder(tracks: Track[], saved: Partial<Saved>, shuffle: boolean) {
  const indexOf = new Map(tracks.map((t, i) => [t.id, i]));
  const savedOrder = saved.order?.map((id) => indexOf.get(id));
  if (savedOrder?.length === tracks.length && savedOrder.every((i) => i !== undefined)) {
    return savedOrder as number[];
  }
  const first = indexOf.get(saved.trackId ?? -1) ?? 0;
  return shuffle ? shuffled(tracks.length, first) : inOrder(tracks.length);
}

const noop = () => () => {};

/*
 * The player only renders in the browser, so it can read what was saved
 * without the server and browser disagreeing. It appears just after the page loads.
 */
export default function MusicPlayer({ tracks }: { tracks: Track[] }) {
  const isBrowser = useSyncExternalStore(noop, () => true, () => false);
  if (!isBrowser || tracks.length === 0) return null;
  return <Player tracks={tracks} />;
}

function Player({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const queueId = useId();

  const [saved] = useState(load);
  const [shuffle, setShuffle] = useState(saved.shuffle ?? true);
  const [order, setOrder] = useState(() => restoreOrder(tracks, saved, saved.shuffle ?? true));
  const [pos, setPos] = useState(() =>
    Math.max(0, order.findIndex((i) => tracks[i].id === saved.trackId)),
  );
  const [muted, setMuted] = useState(saved.muted ?? false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(saved.trackId !== undefined);
  const [queueOpen, setQueueOpen] = useState(false);

  /** Whether the current track should be playing (survives track changes). */
  const wantPlay = useRef(saved.playing ?? false);
  /** Where to start the restored track, used once. */
  const resumeAt = useRef(saved.time ?? 0);

  const index = order[pos];
  const track = tracks[index];

  /** Removes the "resume on first click" listeners, if any are waiting. */
  const stopWaiting = useRef<() => void>(() => {});

  // Play when the track changes, or on load if it was playing last visit.
  // Browsers block sound before the visitor interacts, so if that happens,
  // resume on their first click, tap or key press anywhere on the page.
  // Clicks inside the player are left alone, so its own buttons work normally.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !wantPlay.current) return;

    const resume = (e: Event) => {
      if (playerRef.current?.contains(e.target as Node)) return;
      stopWaiting.current();
      if (wantPlay.current) audio.play().catch(() => {});
    };
    const wait = () => {
      document.addEventListener('pointerdown', resume);
      document.addEventListener('keydown', resume);
      stopWaiting.current = () => {
        document.removeEventListener('pointerdown', resume);
        document.removeEventListener('keydown', resume);
        stopWaiting.current = () => {};
      };
    };

    audio.play().catch(wait);
    return () => stopWaiting.current();
  }, [index]);

  // Remember the queue and settings whenever they change
  useEffect(() => {
    if (!started) return;
    save({
      order: order.map((i) => tracks[i].id),
      trackId: track.id,
      time: Math.floor(audioRef.current?.currentTime ?? 0),
      playing,
      muted,
      shuffle,
    });
  }, [started, order, track, playing, muted, shuffle, tracks]);

  // Close the queue with Escape or a click outside the player
  useEffect(() => {
    if (!queueOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setQueueOpen(false);
    const onClick = (e: PointerEvent) => {
      if (!playerRef.current?.contains(e.target as Node)) setQueueOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onClick);
    };
  }, [queueOpen]);

  /** Saves the playback position (every few seconds while playing, and on leaving). */
  const lastSaved = useRef(0);
  const savePosition = (force = false) => {
    const audio = audioRef.current;
    if (!audio || !started) return;
    const now = Date.now();
    if (!force && now - lastSaved.current < 5000) return;
    lastSaved.current = now;
    save({
      order: order.map((i) => tracks[i].id),
      trackId: track.id,
      time: Math.floor(audio.currentTime),
      playing: !audio.paused,
      muted,
      shuffle,
    });
  };

  useEffect(() => {
    const onLeave = () => savePosition(true);
    window.addEventListener('pagehide', onLeave);
    return () => window.removeEventListener('pagehide', onLeave);
  });

  const play = () => {
    // Each listener gets their own order, decided on their first play
    if (!started && shuffle) {
      setOrder(shuffled(tracks.length, index));
      setPos(0);
    }
    setStarted(true);
    wantPlay.current = true;
    audioRef.current?.play().catch(() => setPlaying(false));
  };

  const pause = () => {
    stopWaiting.current();
    wantPlay.current = false;
    audioRef.current?.pause();
  };

  const togglePlay = () => (audioRef.current?.paused ? play() : pause());

  const toggleShuffle = () => {
    const on = !shuffle;
    setShuffle(on);
    // Keep the current song; reorder what comes after it
    if (on) {
      setOrder(shuffled(tracks.length, index));
      setPos(0);
    } else {
      setOrder(inOrder(tracks.length));
      setPos(index);
    }
  };

  /** Jump to a position in the play order and play it. */
  const playAt = (p: number) => {
    setStarted(true);
    wantPlay.current = true;
    resumeAt.current = 0;
    if (p === pos && audioRef.current) {
      // Same track (e.g. a one-song playlist looping): restart it
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    setPos(p);
  };

  const status = !started ? 'queued' : playing ? 'now playing' : 'paused';

  return (
    <div ref={playerRef} className="music-player relative">
      {/* Queue panel */}
      <div
        id={queueId}
        hidden={!queueOpen}
        className="music-queue absolute bottom-full left-0 mb-3 flex max-h-[min(60dvh,28rem)] w-full max-w-sm flex-col rounded-xl bg-container p-4 shadow-card outline-2 outline-primary"
      >
        <p className="mb-2 font-display text-heading">Up next</p>
        <ol className="-mr-2 flex min-h-0 flex-col gap-1 overflow-y-auto overscroll-contain pr-2">
          {order.map((trackIndex, p) => {
            const t = tracks[trackIndex];
            return (
              <li key={t.id} className="flex items-baseline justify-between gap-3">
                <button
                  type="button"
                  onClick={() => playAt(p)}
                  aria-current={p === pos ? 'true' : undefined}
                  className="queue-track min-w-0 cursor-pointer text-left wrap-anywhere"
                >
                  {t.title} <span className="text-accent">by {t.artist}</span>
                </button>
                <span className="shrink-0 text-sm tabular-nums text-accent">
                  {formatTime(t.duration)}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-sm text-accent">
          Music from{' '}
          <ExternalLink href="https://www.jamendo.com" className="source-link">
            Jamendo
          </ExternalLink>
          {track.license && (
            <>
              {' '}
              · now playing under{' '}
              <ExternalLink href={track.license.url} className="source-link">
                {track.license.name}
              </ExternalLink>
            </>
          )}
        </p>
      </div>

      {/* Bar */}
      <div className="music-bar flex items-center gap-3 rounded-full px-5 py-2.5">
        <button
          type="button"
          onClick={() => setQueueOpen((open) => !open)}
          aria-expanded={queueOpen}
          aria-controls={queueId}
          aria-label="Music queue"
          className="player-button shrink-0 cursor-pointer"
        >
          <QueueIcon aria-hidden="true" size={24} />
        </button>

        <p className="min-w-0 flex-1 truncate" aria-live="polite">
          <span className="player-status">{status}</span>{' '}
          <span aria-hidden="true" className="player-star">
            ✦
          </span>{' '}
          <ExternalLink href={track.trackUrl} className="player-link">
            {track.title}
          </ExternalLink>{' '}
          <span aria-hidden="true" className="player-star">
            ✦
          </span>{' '}
          <ExternalLink href={track.artistUrl} className="player-link">
            {track.artist}
          </ExternalLink>
        </p>

        <button
          type="button"
          onClick={toggleShuffle}
          aria-pressed={shuffle}
          aria-label="Shuffle"
          className="player-button shrink-0 cursor-pointer"
        >
          <ShuffleIcon aria-hidden="true" size={20} />
        </button>

        <button
          type="button"
          onClick={togglePlay}
          aria-pressed={playing}
          aria-label="Play music"
          className="player-button shrink-0 cursor-pointer"
        >
          <PlayPauseIcon aria-hidden="true" size={24} />
        </button>

        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-pressed={muted}
          aria-label="Mute"
          className="player-button shrink-0 cursor-pointer"
        >
          {muted ? (
            <SpeakerSimpleSlashIcon aria-hidden="true" size={20} />
          ) : (
            <SpeakerSimpleHighIcon aria-hidden="true" size={20} />
          )}
        </button>
      </div>

      <audio
        ref={audioRef}
        src={track.audio}
        preload={started ? 'auto' : 'none'}
        muted={muted}
        onLoadedMetadata={(e) => {
          if (resumeAt.current > 0) {
            e.currentTarget.currentTime = resumeAt.current;
            resumeAt.current = 0;
          }
        }}
        onPlay={() => {
          stopWaiting.current();
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={() => savePosition()}
        onEnded={() => playAt((pos + 1) % tracks.length)}
      />
    </div>
  );
}
