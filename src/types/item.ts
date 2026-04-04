import { ItemCategory, Rarity } from './common';

export interface TerrariaItem {
  id: number;
  name: string;
  category: ItemCategory;
  rarity: Rarity;
  sellValue?: number;      // in copper coins
  buyValue?: number;
  damage?: number;
  damageType?: string;     // 'Melee' | 'Ranged' | 'Magic' | 'Summon' | 'Throwing'
  useTime?: number;
  knockback?: number;
  critChance?: number;
  defense?: number;
  tooltip?: string;
  maxStack?: number;
  wikiSlug: string;        // for image URL construction
}

// Lightweight record used for search index and list rendering
export interface ItemIndex {
  id: number;
  name: string;
  category: ItemCategory;
  rarity: Rarity;
  wikiSlug: string;
}
