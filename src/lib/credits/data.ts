/*
 * Visual assets made by other people. The Sources & credits page lists
 * everything here automatically. Add an entry whenever you use someone else's
 * icons, illustrations, photos or fonts.
 *
 *   attribution: 'required' → the licence requires credit (keep it visible)
 *                'courtesy' → not required, credited because it's kind
 */
export interface VisualCredit {
  id: string;
  /** What it is, e.g. "Phosphor Icons" or the illustration's title. */
  name: string;
  /** Link to the asset itself (or the project's homepage). */
  url: string;
  /** The person or team who made it. */
  author?: { name: string; url?: string };
  /** Where it came from, if not the author's own site. */
  source?: { name: string; url: string };
  license: { name: string; url?: string };
  attribution: 'required' | 'courtesy';
  /** Where it appears on Bright Side, in plain words. */
  usedFor: string;
}

export const VISUAL_CREDITS: VisualCredit[] = [
  {
    id: 'phosphor',
    name: 'Phosphor Icons',
    url: 'https://phosphoricons.com',
    author: { name: 'Helena Zhang & Tobias Fried', url: 'https://phosphoricons.com' },
    license: { name: 'MIT License', url: 'https://github.com/phosphor-icons/react/blob/master/LICENSE' },
    attribution: 'courtesy',
    usedFor: 'icons throughout the site',
  },
  {
    id: 'vecteezy-background',
    name: 'Acacia Flower Black/White Isolated Sketch',
    url: 'https://www.vecteezy.com/vector-art/43029420-acacia-flower-black-white-isolated-sketch',
    author: { name: 'Hatch CR', url: 'https://www.vecteezy.com/members/hatchcr' },
    source: { name: 'Vecteezy.com', url: 'https://www.vecteezy.com' },
    license: { name: 'Vecteezy Free License', url: 'https://www.vecteezy.com/licensing-agreement' },
    attribution: 'required',
    usedFor: 'background illustration',
  },
];