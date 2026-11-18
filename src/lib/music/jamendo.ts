import type { MoonTheme } from '@/lib/moon';
import { HIDDEN, MOODS, PINNED, PLAYLIST_LENGTH, RELEASED } from './playlist';

const API = 'https://api.jamendo.com/v3.0/tracks/';
const REVALIDATE = 86_400;
/** Fetch extra so hidden tracks and the daily shuffle still leave a full playlist. */
const POOL = 50;
/** Fewer than this and the moon tops up from the 'grow' search. */
const MIN_TRACKS = 5;

export interface Track {
  id: number;
  title: string;
  artist: string;
  artistUrl: string;
  trackUrl: string;
  audio: string;
  duration: number;
  license: { name: string; url: string } | null;
}

interface JamendoTrack {
  id: string;
  name: string;
  duration: number;
  artist_id: string;
  artist_name: string;
  shareurl: string;
  audio: string;
  license_ccurl: string;
}

/** "https://creativecommons.org/licenses/by-nc-sa/3.0/" → "CC BY-NC-SA 3.0" */
function licenseName(url: string): string {
  const match = url.match(/licenses\/([a-z-]+)\/([\d.]+)/i);
  if (match) return `CC ${match[1].toUpperCase()} ${match[2]}`;
  if (/publicdomain\/zero/i.test(url)) return 'CC0';
  return 'Creative Commons';
}

function toTrack(t: JamendoTrack): Track {
  return {
    id: Number(t.id),
    title: t.name,
    artist: t.artist_name,
    artistUrl: `https://www.jamendo.com/artist/${t.artist_id}`,
    trackUrl: t.shareurl,
    audio: t.audio,
    duration: t.duration,
    license: t.license_ccurl ? { name: licenseName(t.license_ccurl), url: t.license_ccurl } : null,
  };
}

async function request(params: Record<string, string>): Promise<Track[]> {
  const clientId = process.env.JAMENDO_CLIENT_ID;
  if (!clientId) return [];

  const query = new URLSearchParams({
    client_id: clientId,
    format: 'json',
    audioformat: 'mp32',
    ...params,
  });

  try {
    const res = await fetch(`${API}?${query}`, { next: { revalidate: REVALIDATE } });
    if (!res.ok) throw new Error(`Jamendo ${res.status}`);
    const data: { headers: { status: string; error_message?: string }; results: JamendoTrack[] } =
      await res.json();
    if (data.headers.status !== 'success') throw new Error(data.headers.error_message);
    return data.results.filter((t) => t.audio).map(toTrack);
  } catch (error) {
    console.error('[music] Jamendo request failed:', error);
    return [];
  }
}

/** Shuffle that stays the same all day, so the order doesn't jump every hour. */
function dailyShuffle<T>(items: T[]): T[] {
  let seed = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
  const random = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** One Jamendo search: instrumental, released in the allowed years, most popular first. */
function search(tags: string[], speed: string[] = []) {
  return request({
    limit: String(POOL),
    order: 'popularity_total',
    vocalinstrumental: 'instrumental',
    datebetween: `${RELEASED.from}_${RELEASED.to}`,
    fuzzytags: tags.join(' '), // sent as tag+tag
    ...(speed.length > 0 && { speed: speed.join(' ') }),
  });
}

/*
 * Searches for a mood, loosening the search if it finds too few tracks.
 * Many tracks have no tempo info, so the speed filter alone can empty a search.
 *   1. all tags + speed   2. all tags, any speed   3. first two tags, any speed
 * The release-year limit is never loosened.
 */
async function searchMood(theme: MoonTheme): Promise<Track[]> {
  const { tags, speed } = MOODS[theme];
  const attempts = [
    () => search(tags, speed),
    () => search(tags),
    () => search(tags.slice(0, 2)),
  ];

  const found = new Map<number, Track>();
  for (const attempt of attempts) {
    for (const track of await attempt()) found.set(track.id, track);
    if (found.size >= PLAYLIST_LENGTH * 1.5) break;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[music] ${theme}: found ${found.size} tracks`);
  }
  return [...found.values()];
}

/** The playlist for tonight's moon: pinned tracks first, then a daily shuffle of the search. */
export async function getPlaylist(theme: MoonTheme): Promise<Track[]> {
  const pinnedIds = PINNED[theme] ?? [];
  const [pinned, found] = await Promise.all([
    pinnedIds.length ? request({ id: pinnedIds.join(' '), limit: String(pinnedIds.length) }) : [],
    searchMood(theme),
  ]);

  const hidden = new Set(HIDDEN);
  const seen = new Set<number>();
  const keep = (t: Track) => !hidden.has(t.id) && !seen.has(t.id) && seen.add(t.id);

  const pinnedInOrder = pinnedIds.flatMap((id) => pinned.filter((t) => t.id === id)).filter(keep);
  let rest = dailyShuffle(found.filter(keep));

  // Too few found for this moon: top up from the 'grow' search, keeping the pins
  if (rest.length < MIN_TRACKS && theme !== 'grow') {
    rest = [...rest, ...dailyShuffle((await searchMood('grow')).filter(keep))];
  }

  return [...pinnedInOrder, ...rest].slice(0, PLAYLIST_LENGTH);
}

/** Every moon's playlist, each track once, for the Sources page. */
export async function getAllTracks(): Promise<Track[]> {
  const lists = await Promise.all((Object.keys(MOODS) as MoonTheme[]).map(getPlaylist));
  const seen = new Set<number>();
  return lists.flat().filter((t) => !seen.has(t.id) && seen.add(t.id));
}
