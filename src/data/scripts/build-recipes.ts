/**
 * build-recipes.ts
 *
 * Denormalizes id_references/recipes.json by inlining ingredient names,
 * wikiSlugs, result names, and crafting station names.
 *
 * Input recipe shape:
 *   { "Craft ID": "1", "Result ID": "1133", "Result Quantity": "1",
 *     "Table ID": "1", "Recipe": [{ "Ingredient ID": "1125", "Quantity": "5" }] }
 *
 * Output Recipe shape:
 *   { id, resultId, resultName, resultQuantity, resultWikiSlug,
 *     craftingStation, ingredients: [{ id, name, quantity, wikiSlug }] }
 */

import fs from 'fs';
import path from 'path';
import { TerrariaItem } from '../../types/item';
import { Recipe } from '../../types/recipe';

const RAW = path.resolve(__dirname, '../raw/natan');
const OUT = path.resolve(__dirname, '../processed');

// Build item lookup from processed items.json
const itemsPath = path.join(OUT, 'items.json');
if (!fs.existsSync(itemsPath)) {
  throw new Error('items.json not found — run merge-items.ts first');
}
const items: TerrariaItem[] = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
const itemMap = new Map<number, TerrariaItem>();
items.forEach((i) => itemMap.set(i.id, i));

// Also load id_references/items.json for items that may not be in items_data files
const idRef: { ID: string; Name: string; Type: string }[] = JSON.parse(
  fs.readFileSync(path.join(RAW, 'id_references_items.json'), 'utf8'),
);
idRef.forEach((r) => {
  const id = parseInt(r.ID);
  if (!itemMap.has(id)) {
    itemMap.set(id, {
      id,
      name: r.Name,
      category: 'Other',
      rarity: 0,
      wikiSlug: r.Name.replace(/ /g, '_'),
    });
  }
});

// Build crafting station lookup: Table ID → Name
const stations: { 'Table ID': string; Name: string }[] = JSON.parse(
  fs.readFileSync(path.join(RAW, 'id_references_crafting_stations.json'), 'utf8'),
);
const stationMap = new Map<number, string>();
stations.forEach((s) => stationMap.set(parseInt(s['Table ID']), s.Name));

// Process recipes
const rawRecipes: {
  'Craft ID': string;
  'Result ID': string;
  'Result Quantity': string;
  'Table ID': string;
  Recipe: { 'Ingredient ID': string; Quantity: string }[];
}[] = JSON.parse(fs.readFileSync(path.join(RAW, 'id_references_recipes.json'), 'utf8'));

const recipes: Recipe[] = [];
let skipped = 0;

for (const r of rawRecipes) {
  const resultId = parseInt(r['Result ID']);
  const result = itemMap.get(resultId);
  if (!result) {
    skipped++;
    continue;
  }

  const ingredients = r.Recipe.map((ing) => {
    const ingId = parseInt(ing['Ingredient ID']);
    const ingItem = itemMap.get(ingId);
    return {
      id: ingId,
      name: ingItem?.name ?? `Item #${ingId}`,
      quantity: parseInt(ing['Quantity']) || 1,
      wikiSlug: ingItem?.wikiSlug ?? `Item_${ingId}`,
    };
  });

  recipes.push({
    id: parseInt(r['Craft ID']),
    resultId,
    resultName: result.name,
    resultQuantity: parseInt(r['Result Quantity']) || 1,
    resultWikiSlug: result.wikiSlug,
    craftingStation: stationMap.get(parseInt(r['Table ID'])) ?? 'Unknown',
    ingredients,
  });
}

recipes.sort((a, b) => a.id - b.id);

fs.writeFileSync(path.join(OUT, 'recipes.json'), JSON.stringify(recipes));

console.log(`  ✓ recipes.json — ${recipes.length} recipes (${skipped} skipped)`);
