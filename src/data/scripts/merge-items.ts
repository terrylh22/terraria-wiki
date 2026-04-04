/**
 * merge-items.ts
 *
 * Merges all items_*.json category files with the id_references/items.json
 * lookup to produce a single normalized processed/items.json array.
 *
 * Input shape (items_weapon.json example):
 *   { "Item ID": "4", "Name": "Iron Broadsword", "Damage": "10", "Rarity": "0", ... }
 *
 * Output shape (TerrariaItem):
 *   { id: 4, name: "Iron Broadsword", category: "Weapon", rarity: 0, ... }
 */

import fs from 'fs';
import path from 'path';
import { ItemCategory } from '../../types/common';
import { TerrariaItem } from '../../types/item';

const RAW = path.resolve(__dirname, '../raw/natan');
const OUT = path.resolve(__dirname, '../processed');

// Map filename → ItemCategory
const FILE_CATEGORY: Record<string, ItemCategory> = {
  items_weapon: 'Weapon',
  items_armor: 'Armor',
  items_accessory: 'Accessory',
  items_tool: 'Tool',
  items_potion: 'Potion',
  items_crafting_material: 'Material',
  items_furniture: 'Furniture',
  items_ammunition: 'Ammo',
  items_block: 'Block',
  items_brick: 'Block',
  items_boss_summon: 'Other',
  items_event_summon: 'Other',
  items_consumable: 'Potion',
  items_ore: 'Material',
  items_gem: 'Material',
};

function toWikiSlug(name: string): string {
  return name.replace(/ /g, '_');
}

function parseRarity(raw: string | undefined): number {
  const n = parseInt(raw ?? '0', 10);
  return isNaN(n) ? 0 : n;
}

function parseCoinValue(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  // "3 Silver 60 Copper Coins" → copper value
  let total = 0;
  const platinum = raw.match(/(\d+)\s*Platinum/i);
  const gold = raw.match(/(\d+)\s*Gold/i);
  const silver = raw.match(/(\d+)\s*Silver/i);
  const copper = raw.match(/(\d+)\s*Copper/i);
  if (platinum) total += parseInt(platinum[1]) * 1_000_000;
  if (gold) total += parseInt(gold[1]) * 10_000;
  if (silver) total += parseInt(silver[1]) * 100;
  if (copper) total += parseInt(copper[1]);
  return total || undefined;
}

function parseNumber(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const n = parseFloat(raw.replace(/[^0-9.]/g, ''));
  return isNaN(n) ? undefined : n;
}

// Load the id_references/items.json for type fallback
const idRef: { ID: string; Name: string; Type: string }[] = JSON.parse(
  fs.readFileSync(path.join(RAW, 'id_references_items.json'), 'utf8'),
);
const idRefMap = new Map<number, string>();
idRef.forEach((r) => idRefMap.set(parseInt(r.ID), r.Type));

const seen = new Set<number>();
const items: TerrariaItem[] = [];

for (const [file, category] of Object.entries(FILE_CATEGORY)) {
  const filePath = path.join(RAW, `${file}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ Missing: ${file}.json — skipping`);
    continue;
  }

  const raw: Record<string, any>[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const entry of raw) {
    const id = parseInt(entry['Item ID'], 10);
    if (isNaN(id) || seen.has(id)) continue;
    seen.add(id);

    const name: string = entry['Name'] ?? '';
    if (!name) continue;

    const item: TerrariaItem = {
      id,
      name,
      category,
      rarity: parseRarity(entry['Rarity']) as any,
      wikiSlug: toWikiSlug(name),
      sellValue: parseCoinValue(entry['Sell']),
      buyValue: parseCoinValue(entry['Buy']),
      damage: parseNumber(entry['Damage']),
      damageType: entry['Damage type'] ?? entry['Type'],
      useTime: parseNumber(entry['Use time']),
      knockback: parseNumber(entry['Knockback']),
      critChance: parseNumber(entry['Critical chance']),
      defense: parseNumber(entry['Defense']),
      tooltip: entry['Tooltip'] ?? undefined,
      maxStack: parseNumber(entry['Max stack']),
    };

    // Remove undefined fields to keep JSON lean
    (Object.keys(item) as (keyof TerrariaItem)[]).forEach((k) => {
      if (item[k] === undefined) delete item[k];
    });

    items.push(item);
  }
}

// Sort by ID for deterministic output
items.sort((a, b) => a.id - b.id);

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'items.json'), JSON.stringify(items));

console.log(`  ✓ items.json — ${items.length} items`);
