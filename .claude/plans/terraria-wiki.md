# Terraria Wiki Mobile App — Implementation Plan
<!-- plan lives at: terraria-wiki/.claude/plans/ -->

## Context

Building a greenfield Terraria wiki mobile app for iOS + Android using Expo / React Native. V1 scope: item search & browse, crafting recipes, and boss guides. Data comes from existing open-source JSON datasets (scraped from the official Terraria wiki). No backend — fully static, frontend-only.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Expo (managed workflow) + TypeScript |
| Navigation | Expo Router v4 (file-based, deep links built-in) |
| Styling | NativeWind v4 (Tailwind for RN — full creative control for Terraria aesthetic) |
| Lists | `@shopify/flash-list` (required for 5000+ items on Android) |
| UI State | Zustand |
| Data State | React Context (large read-only JSON, loaded once) |
| Search | Fuse.js on a lightweight 150 KB index |
| Images | `expo-image` (built-in LRU cache) + `expo-file-system` fallback |
| Bottom sheets | `@gorhom/bottom-sheet` |

---

## Data Strategy

**Sources:**
- Items + Recipes: `natan-dot-com/Terraria-Dataset` (GitHub) + `Carsmaniac/terraria-crafting-tree`
- Bosses: hand-authored `bosses.json` (only ~20 major bosses; no machine-readable source exists for strategy/health/drops)
- Images: `https://terraria.wiki.gg/w/Special:FilePath/[Item_Name].png` (MediaWiki redirect, no hash computation needed)

**Build-time preprocessing** (`npm run build:data`, runs before `expo start`):
1. Merge 30+ natan category files → `processed/items.json` (normalized, integer IDs)
2. Denormalize recipe IDs → `processed/recipes.json` (ingredient names + quantities inlined)
3. Extract lightweight fields → `processed/index.json` (~150 KB, what Fuse.js indexes)

Commit `processed/` to git. Never edit by hand.

---

## Project Structure

```
terraria-wiki/
├── app/
│   ├── _layout.tsx              # Root stack
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab bar (Items / Crafting / Bosses)
│   │   ├── index.tsx            # Items list + search
│   │   ├── crafting.tsx         # Crafting hub
│   │   └── bosses.tsx           # Boss list
│   ├── item/[id].tsx            # Item detail
│   ├── boss/[id].tsx            # Boss detail
│   └── crafting/[id].tsx        # Craft tree detail
│
├── src/
│   ├── components/ui/           # WikiImage, RarityBadge, StatRow, SearchBar
│   ├── components/items/        # ItemCard, ItemStatBlock, CategoryFilter
│   ├── components/crafting/     # RecipeCard, IngredientRow, CraftingStationBadge
│   ├── components/bosses/       # BossCard, DropTable, StrategySection
│   ├── data/
│   │   ├── raw/                 # Committed source JSONs (natan + carsmaniac)
│   │   ├── processed/           # Build-time output (items, recipes, index, bosses)
│   │   ├── scripts/             # build-data.ts, merge-items.ts, build-recipes.ts, build-index.ts
│   │   └── loaders/             # DataContext.tsx, useItems.ts, useRecipes.ts, useBosses.ts
│   ├── store/                   # Zustand: searchSlice (query, category, sort), settingsSlice
│   ├── hooks/                   # useDebounce, useItemSearch, useWikiImage, useCraftingTree
│   ├── lib/                     # imageCache.ts, fuseInstance.ts, wikiUrl.ts
│   ├── types/                   # item.ts, recipe.ts, boss.ts, common.ts
│   └── theme/                   # colors.ts (Terraria palette), typography.ts
│
└── assets/
    ├── fonts/                   # Andy Bold (in-game feel)
    └── images/placeholder-item.png
```

---

## Navigation Flow

```
Root Stack
├── Tabs
│   ├── Items tab → item/[id] (stack push)
│   ├── Crafting tab → crafting/[id] (stack push)
│   └── Bosses tab → boss/[id] (stack push)
```

Deep links work automatically via Expo Router: `terrariawiki://item/1133`

---

## Key Screens

- **Items tab**: SearchBar (debounced 200ms) + CategoryFilter pills + FlashList of ItemCards
- **Item detail**: hero sprite, RarityBadge, tabbed Stats / Recipes / Used In; tapping ingredients navigates to their detail
- **Crafting tab**: search mode toggle ("What can I make?" vs "What do I need?") + RecipeCard list
- **Craft tree detail**: recursive indented tree + flat "Shopping List" of raw materials
- **Bosses tab**: SectionList grouped Pre-Hardmode / Hardmode / Post-Moon-Lord
- **Boss detail**: tabbed Summoning / Drops / Strategy

---

## Implementation Order

1. **Init project**: `npx create-expo-app terraria-wiki --template expo-template-blank-typescript`
2. **Install deps**: all packages listed above
3. **Types first**: `src/types/item.ts`, `recipe.ts`, `boss.ts`, `common.ts`
4. **Data pipeline**: download raw JSONs → write build scripts → run → verify `processed/` output
5. **DataContext**: load processed JSONs, build Fuse.js index async, expose via context
6. **Navigation shell**: root `_layout.tsx` + tabs `_layout.tsx` with placeholder screens
7. **Items tab + Item detail**: first fully working feature (most data-dense, validates architecture)
8. **Crafting tab + Craft tree**: depends on items being done
9. **Bosses tab + Boss detail**: hand-author `bosses.json` then build screens
10. **Polish**: Terraria theme, transitions, image loading skeletons, empty states

---

## Boss JSON Schema (hand-authored)

```typescript
interface Boss {
  id: string;
  name: string;
  phase: 'pre-hardmode' | 'hardmode' | 'post-moonlord';
  health: { pc: number; expert: number; master: number };
  defense: number;
  summonItems: number[];           // item IDs
  summonConditions: string;
  drops: { itemId: number; probability: string; quantity: string }[];
  strategy: { phase: string; description: string; attacks: string[] }[];
  wikiSlug: string;               // for image URL
}
```

---

## Verification

- `npm run build:data` completes without errors; `processed/` contains 4 JSON files
- `expo start` launches on iOS Simulator and Android Emulator
- Item list renders 5000+ items smoothly (test scroll FPS on Android)
- Fuzzy search returns relevant results for partial queries ("terra" → Terrablade, etc.)
- Tapping an item with a known recipe shows correct ingredients with icons
- Boss detail shows correct drop table with links to item detail
- Image caching: second visit to item list loads images instantly
