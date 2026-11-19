/*
 * Lets videos tell the music player when they start and stop,
 * so the music can step aside while someone watches.
 */
export const VIDEO_EVENT = 'bright-side:video';

export interface VideoEventDetail {
  id: string;
  playing: boolean;
}

export function announceVideo(id: string, playing: boolean) {
  window.dispatchEvent(new CustomEvent<VideoEventDetail>(VIDEO_EVENT, { detail: { id, playing } }));
}
