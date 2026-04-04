export type BossPhase = 'pre-hardmode' | 'hardmode' | 'post-moonlord';

export interface BossDrop {
  itemId: number;
  itemName: string;
  probability: string;  // e.g. "100%", "25%", "1 in 50"
  quantity: string;     // e.g. "1", "1-5"
}

export interface BossStrategyPhase {
  phase: string;
  description: string;
  attacks: string[];
}

export interface Boss {
  id: string;
  name: string;
  phase: BossPhase;
  health: { pc: number; expert: number; master: number };
  defense: number;
  summonItems: number[];        // item IDs from items index
  summonConditions: string;
  drops: BossDrop[];
  strategy: BossStrategyPhase[];
  wikiSlug: string;
}
