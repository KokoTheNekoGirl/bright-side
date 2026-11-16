/**
 * Builds one case-insensitive regex from a keyword list.
 *   'bird'     → bird, birds (whole word)
 *   'restor*'  → restore, restored, restoration…
 *   'net zero' → the phrase
 */
export function keywordMatcher(keywords: string[]): RegExp {
  const parts = keywords.map((kw) => {
    const stem = kw.endsWith('*');
    const escaped = kw
      .replace(/\*$/, '')
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\s+/g, '\\s+');
    return stem ? `${escaped}\\w*` : `${escaped}(?:s|es)?`;
  });
  return new RegExp(`\\b(?:${parts.join('|')})\\b`, 'gi');
}
