/**
 * build-index.ts
 *
 * Extracts a lightweight search index from processed/items.json.
 * Only id, name, category, rarity, wikiSlug — Fuse.js only indexes this file.
 */

import fs from 'fs';
import path from 'path';
import { TerrariaItem } from '../../types/item';
import { ItemIndex } from '../../types/item';

const OUT = path.resolve(__dirname, '../processed');

const items: TerrariaItem[] = JSON.parse(
  fs.readFileSync(path.join(OUT, 'items.json'), 'utf8'),
);

const index: ItemIndex[] = items.map((item) => ({
  id: item.id,
  name: item.name,
  category: item.category,
  rarity: item.rarity,
  wikiSlug: item.wikiSlug,
}));

fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index));

const sizeKB = Math.round(
  Buffer.byteLength(JSON.stringify(index)) / 1024,
);
console.log(`  ✓ index.json — ${index.length} entries, ~${sizeKB} KB`);
