# Terraria Wiki App — Style Guide

## Design Direction
Dark fantasy aesthetic inspired by Terraria's UI. Deep navy/indigo backgrounds, gold accents, pixel-art sprite images. Feels like an in-game compendium.

---

## Color Palette
Defined in `src/theme/colors.ts`.

### Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| `colors.bg.primary` | `#1a1a2e` | Main screen background |
| `colors.bg.secondary` | `#16213e` | Cards, headers, hero sections |
| `colors.bg.surface` | `#0f3460` | Elevated surfaces, tooltips, pressed states |

### Brand
| Token | Hex | Usage |
|-------|-----|-------|
| `colors.brand.gold` | `#e8b84b` | Primary accent — headings, active tabs, highlights |
| `colors.brand.silver` | `#c0c0c0` | Secondary accent (reserved, lightly used) |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `colors.text.primary` | `#e8e8e8` | Body text, item names |
| `colors.text.secondary` | `#a0a0b0` | Supporting text, labels |
| `colors.text.muted` | `#666680` | Placeholder text, disabled states, subtitles |

### Border
| Token | Hex | Usage |
|-------|-----|-------|
| `colors.border` | `#2a2a4a` | Dividers, card borders |

### Rarity Colors
Matches Terraria's in-game rarity tiers exactly. Used for rarity badges and dots.
| Tier | Name | Hex |
|------|------|-----|
| -1, 0 | Gray | `#828282` |
| 1 | White | `#ffffff` |
| 2 | Blue | `#9696ff` |
| 3 | Green | `#96ff96` |
| 4 | Orange | `#ffa500` |
| 5 | Light Red | `#ff9696` |
| 6 | Pink | `#ff96ff` |
| 7 | Light Purple | `#d2ff00` |
| 8 | Yellow | `#ffff00` |
| 9 | Cyan | `#05c3dd` |
| 10 | Red | `#ff2020` |
| 11 | Purple | `#b220ff` |

---

## Typography
No custom fonts yet — using system defaults. Candidates to evaluate: **Press Start 2P** (pixel/retro, headers only), **Inter** or **SF Pro** (body).

### Current scale
| Usage | Size | Weight |
|-------|------|--------|
| Screen headers (e.g. "Items") | 28 | 700 |
| Item name (detail screen) | 20 | 700 |
| Item name (list row) | 15 | 500 |
| Category / subtitle | 12–13 | 400 |
| Tab labels | 13 | 500–600 |
| Tooltip / flavor text | 13 | 400, italic |
| Muted / metadata | 12–14 | 400 |

---

## Spacing & Layout
- Base unit: **8px**
- Standard horizontal padding: **16px**
- Card/row vertical padding: **10px**
- Gap between icon and text in list rows: **12px**
- Border radius: **8px** (cards/surfaces), **20px** (pill buttons/filters)

---

## Component Patterns

### List Rows (ItemCard)
- Height: ~57px fixed (used for `getItemLayout`)
- Left: 36×36 item sprite
- Middle: name (primary text) + category (muted)
- Right: 8px rarity dot

### Category Filter Pills
- Horizontal scroll row
- Inactive: `bg.surface` background, `border` border
- Active: `brand.gold` background, dark text

### Tab Bar (detail screen)
- Full-width, 3 tabs
- Active: `brand.gold` bottom border + gold text
- Inactive: muted text

### Hero Section (detail screen)
- `bg.secondary` background
- 64×64 item sprite
- Name, rarity badge, sell value

---

## Images
- Source: `https://terraria.wiki.gg/images/{wikiSlug}.png`
- Slug format: spaces replaced with underscores (e.g. `Iron_Pickaxe`)
- List size: 36×36
- Detail hero size: 64×64
- Rendering: `resizeMode="contain"` — pixel art, no stretching
- Component: `src/components/ui/WikiImage.tsx`