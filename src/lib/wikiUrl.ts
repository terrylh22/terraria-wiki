/**
 * Builds a Terraria wiki image URL using the Special:FilePath redirect,
 * which always resolves to the canonical image regardless of MediaWiki's
 * internal hash routing.
 */
export function wikiImageUrl(wikiSlug: string): string {
  return `https://terraria.wiki.gg/images/${wikiSlug}.png`;
}
